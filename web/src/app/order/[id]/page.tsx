import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SITE } from "@/config/site";
import { PAYMENT_LABELS } from "@/lib/delivery";
import { formatTtd } from "@/lib/pricing";
import { getOrder, getSettings } from "@/lib/server";
import { orderMessage, whatsappLink } from "@/lib/whatsapp";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Order confirmed", robots: { index: false, follow: false } };

type Props = { params: Promise<{ id: string }> };

export default async function OrderPage({ params }: Props) {
  const { id } = await params;
  const order = await getOrder(id);
  if (!order) notFound();

  const { pickupDay } = await getSettings();
  const message = orderMessage(order, pickupDay);
  const waHref = whatsappLink(SITE.whatsappNumber, message);
  const pickup = order.delivery.pickupPoint;
  const firstName = order.customer.name.split(" ")[0];

  return (
    <div className="container-page max-w-2xl space-y-6 py-6">
      <div className="space-y-1">
        <p className="text-sm font-semibold uppercase tracking-wide text-sea">Order saved</p>
        <h1 className="text-3xl font-extrabold">Thanks, {firstName}! Your order is {order.number}.</h1>
        <p className="text-muted">Two quick steps and it&apos;s locked in.</p>
      </div>

      <section aria-labelledby="step1" className="card space-y-3 p-4">
        <h2 id="step1" className="text-xl font-bold">
          1. Send us your order on WhatsApp
        </h2>
        <p className="text-sm text-muted">
          It opens WhatsApp with your order already typed. Just hit send. We confirm stock and reply fast.
        </p>
        <a href={waHref} className="btn-whatsapp w-full" rel="noopener">
          Send order on WhatsApp
        </a>
        <p className="text-xs text-muted">WhatsApp us at {SITE.whatsappDisplay}.</p>
      </section>

      <section aria-labelledby="step2" className="card space-y-3 p-4">
        <h2 id="step2" className="text-xl font-bold">
          2. {order.payment === "bank_transfer" ? "Pay by bank transfer" : "Pay cash at pickup"}
        </h2>
        {order.payment === "bank_transfer" ? (
          <p className="text-sm">
            Once you send your order, we reply on WhatsApp with our bank details. Transfer{" "}
            <strong>{formatTtd(order.totals.total)}</strong> with <strong>{order.number}</strong> as the
            reference, then send us the receipt there.
            {order.delivery.method === "odeliver" ? " We dispatch once payment is in." : ""}
          </p>
        ) : (
          <p className="text-sm">
            Bring <strong>{formatTtd(order.totals.total)}</strong> in cash to your pickup.
          </p>
        )}
      </section>

      <section aria-labelledby="getting" className="card space-y-2 p-4">
        <h2 id="getting" className="text-xl font-bold">
          {pickup ? "Your pickup" : "Delivery"}
        </h2>
        {pickup ? (
          <p className="text-lg">
            <strong>
              {pickupDay}, {pickup.time}
            </strong>{" "}
            at <strong>{pickup.name}</strong>
          </p>
        ) : (
          <p>{order.delivery.label}</p>
        )}
      </section>

      <section aria-labelledby="items" className="card space-y-2 p-4">
        <h2 id="items" className="text-xl font-bold">
          What you ordered
        </h2>
        <ul className="space-y-1 text-sm">
          {order.lines.map((l, i) => (
            <li key={i} className="flex justify-between gap-2">
              <span>
                {l.kind === "free"
                  ? `Free 5ml surprise${l.productId ? `: ${l.label}` : " (we pick)"}`
                  : l.kind === "set"
                    ? `${l.qty}× ${l.label} set (3×${l.size}ml)`
                    : `${l.qty}× ${l.label} ${l.size}ml${l.shipsAsSplit ? " (ships as 10ml + 5ml)" : ""}`}
              </span>
              <span>{l.kind === "free" ? "FREE" : formatTtd(l.unitPrice * l.qty)}</span>
            </li>
          ))}
        </ul>
        {order.offer && <p className="text-sm text-sea">{order.offer.explanation}</p>}
        <dl className="space-y-1 border-t border-line pt-2 text-sm">
          <div className="flex justify-between">
            <dt>Subtotal</dt>
            <dd>{formatTtd(order.totals.subtotal)}</dd>
          </div>
          {order.totals.discount > 0 && (
            <div className="flex justify-between text-sea">
              <dt>Offer</dt>
              <dd>−{formatTtd(order.totals.discount)}</dd>
            </div>
          )}
          <div className="flex justify-between">
            <dt>Delivery</dt>
            <dd>{order.totals.delivery === 0 ? "Free" : formatTtd(order.totals.delivery)}</dd>
          </div>
          <div className="flex justify-between text-lg font-extrabold">
            <dt>Total</dt>
            <dd>{formatTtd(order.totals.total)}</dd>
          </div>
          <div className="flex justify-between text-muted">
            <dt>Payment</dt>
            <dd>{PAYMENT_LABELS[order.payment]}</dd>
          </div>
        </dl>
      </section>

      <Link href="/scents" className="btn-secondary w-full">
        Keep browsing
      </Link>
    </div>
  );
}
