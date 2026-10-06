"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Spinner } from "./spinner";
import { placeOrderAction } from "@/app/checkout/actions";
import type { CatalogSnapshot } from "@/lib/catalog";
import { cartActions, readUtm, useCart, useHydrated } from "@/lib/cart-store";
import { PAYMENT_LABELS, paymentOptionsFor, quoteDelivery } from "@/lib/delivery";
import { formatTtd } from "@/lib/pricing";
import type { PaymentMethod } from "@/lib/types";
import { DeliveryPicker, type DeliveryState } from "./delivery-picker";
import { OfferBox } from "./offer-box";
import { useQuote } from "./use-quote";

export function CheckoutForm({ catalog, pickupDay }: { catalog: CatalogSnapshot; pickupDay: string }) {
  const cart = useCart();
  const hydrated = useHydrated();
  const router = useRouter();
  const { quote, blockers } = useQuote(catalog, cart);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [delivery, setDelivery] = useState<DeliveryState>({ method: "pickup" });
  const [paymentChoice, setPaymentChoice] = useState<PaymentMethod>("bank_transfer");
  const [errors, setErrors] = useState<string[]>([]);
  const [placing, startPlacing] = useTransition();
  const [placed, setPlaced] = useState(false);

  const paymentOptions = paymentOptionsFor(delivery.method);
  const payment = paymentOptions.includes(paymentChoice) ? paymentChoice : "bank_transfer";
  const dq = quoteDelivery(delivery, catalog.delivery);
  const total = quote.itemsTotal + (dq.ok ? dq.fee : 0);

  if (!hydrated) return <p className="text-muted">Loading…</p>;
  if (placed) return <p className="text-lg font-medium">Order placed. Taking you to your confirmation…</p>;
  if (cart.lines.length === 0) {
    return (
      <p>
        Your cart is empty.{" "}
        <Link href="/scents" className="font-medium text-hibiscus underline">
          Browse scents
        </Link>
      </p>
    );
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setErrors([]);
    startPlacing(async () => {
      const result = await placeOrderAction({
        cart,
        customer: { name, phone, note },
        delivery,
        payment,
        utm: readUtm(),
      });
      if (result.ok) {
        setPlaced(true);
        router.push(`/order/${result.id}`);
        cartActions.clear();
      } else {
        setErrors(result.errors);
        router.refresh();
      }
    });
  }

  return (
    <form onSubmit={submit} className="grid gap-8 md:grid-cols-[minmax(0,1fr)_22rem] md:gap-12" noValidate>
      <div className="space-y-6">
        <section aria-labelledby="you" className="space-y-3">
          <h2 id="you" className="text-lg font-medium">
            You
          </h2>
          <label className="block">
            <span className="label">Name</span>
            <input
              className="field"
              autoComplete="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          <label className="block">
            <span className="label">WhatsApp number</span>
            <input
              className="field"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="868-555-1234"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </label>
        </section>

        <section aria-labelledby="delivery" className="space-y-3">
          <h2 id="delivery" className="text-lg font-medium">
            Pickup or delivery
          </h2>
          <DeliveryPicker
            config={catalog.delivery}
            pickupDay={pickupDay}
            value={delivery}
            onChange={setDelivery}
          />
        </section>

        <section aria-labelledby="pay" className="space-y-2">
          <h2 id="pay" className="text-lg font-medium">
            Payment
          </h2>
          <div className="flex flex-wrap gap-2" role="radiogroup" aria-labelledby="pay">
            {paymentOptions.map((p) => (
              <label key={p} className={`chip cursor-pointer gap-2 ${payment === p ? "chip-on" : ""}`}>
                <input
                  type="radio"
                  name="payment"
                  className="sr-only"
                  checked={payment === p}
                  onChange={() => setPaymentChoice(p)}
                />
                {PAYMENT_LABELS[p]}
              </label>
            ))}
          </div>
          <p className="text-sm text-muted">
            {delivery.method === "pickup"
              ? "Pay by transfer before pickup, or bring cash."
              : "Delivery orders are paid by bank transfer before we send them out. We send our bank details on WhatsApp. No rounded-md border border-line payments yet."}
          </p>
        </section>

        <label className="block">
          <span className="label">Anything we should know? (optional)</span>
          <textarea
            className="field min-h-20"
            maxLength={500}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Gift? Landmark for the driver?"
          />
        </label>
      </div>

      <aside className="space-y-4">
        <OfferBox quote={quote} />
        <section aria-labelledby="summary" className="space-y-2 rounded-md border border-line p-5">
          <h2 id="summary" className="text-lg font-medium">
            Order summary
          </h2>
          <ul className="space-y-1 text-sm">
            {quote.lines.map((l) => (
              <li key={l.index} className="flex justify-between gap-2">
                <span>
                  {l.line.qty}× {l.label}
                </span>
                <span>{formatTtd(l.total)}</span>
              </li>
            ))}
            {quote.freeSample && (
              <li className="flex justify-between gap-2 text-hibiscus">
                <span>Free 5ml surprise (we pick)</span>
                <span>FREE</span>
              </li>
            )}
          </ul>
          <dl className="space-y-1 border-t border-line pt-2">
            <div className="flex justify-between">
              <dt>Subtotal</dt>
              <dd>{formatTtd(quote.subtotal)}</dd>
            </div>
            {quote.discount > 0 && (
              <div className="flex justify-between text-hibiscus">
                <dt>Offer</dt>
                <dd>−{formatTtd(quote.discount)}</dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt>Delivery</dt>
              <dd>{dq.ok ? (dq.fee === 0 ? "Free" : formatTtd(dq.fee)) : "Choose above"}</dd>
            </div>
            <div className="flex justify-between border-t border-line pt-2 text-xl font-medium">
              <dt>Total</dt>
              <dd>{formatTtd(total)}</dd>
            </div>
          </dl>
          <p className="text-xs text-muted">Prices in TTD. Nothing hidden.</p>
        </section>

        {[...blockers, ...errors].length > 0 && (
          <ul className="space-y-1 text-sm font-medium text-danger" role="alert">
            {[...new Set([...blockers, ...errors])].map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
        )}
        {blockers.length > 0 && (
          <Link href="/cart" className="btn-secondary w-full">
            Fix in cart
          </Link>
        )}
        <button
          type="submit"
          className="btn-primary w-full"
          disabled={placing || blockers.length > 0 || !dq.ok}
        >
          {placing ? (
            <>
              <Spinner size="sm" arc="current" label="Placing your order" />
              Placing order
            </>
          ) : (
            `Place order · ${formatTtd(total)}`
          )}
        </button>
        {!dq.ok && <p className="text-sm text-muted">{dq.error}</p>}
        <p className="text-xs text-muted">
          Next you&apos;ll get your order number and a button to send the order to us on WhatsApp. We reply there
          to confirm, with payment details if you&apos;re paying by transfer.
        </p>
      </aside>
    </form>
  );
}
