"use client";

import Link from "next/link";
import type { CatalogSnapshot } from "@/lib/catalog";
import { cartActions, useCart, useHydrated } from "@/lib/cart-store";
import { formatTtd } from "@/lib/pricing";
import { OfferBox } from "./offer-box";
import { ScentPhoto } from "./scent-photo";
import { Spinner } from "./spinner";
import { useQuote } from "./use-quote";

function Stepper({ label, qty, onChange }: { label: string; qty: number; onChange: (q: number) => void }) {
  return (
    <div className="flex items-center rounded-md border border-line">
      <button type="button" className="grid h-11 w-11 place-items-center text-muted hover:text-ink" aria-label={`One less ${label}`} onClick={() => onChange(qty - 1)}>
        <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden stroke="currentColor" strokeWidth="1.5">
          <path d="M2 6h8" />
        </svg>
      </button>
      <span className="w-7 text-center tabular-nums" aria-label="Quantity">
        {qty}
      </span>
      <button type="button" className="grid h-11 w-11 place-items-center text-muted hover:text-ink" aria-label={`One more ${label}`} onClick={() => onChange(qty + 1)}>
        <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden stroke="currentColor" strokeWidth="1.5">
          <path d="M2 6h8M6 2v8" />
        </svg>
      </button>
    </div>
  );
}

export function CartView({ catalog }: { catalog: CatalogSnapshot }) {
  const cart = useCart();
  const hydrated = useHydrated();
  const { quote, blockers, byId } = useQuote(catalog, cart);

  if (!hydrated) return <Spinner size="md" label="Loading your cart" className="py-16" />;
  if (cart.lines.length === 0) {
    return (
      <div className="space-y-5 rounded-md border border-line px-6 py-12 text-center">
        <p className="text-lg">Your cart is empty.</p>
        <p className="mx-auto max-w-sm text-sm text-muted">Start with a 5ml of something that catches your eye, or let a set choose for you.</p>
        <div className="flex flex-wrap justify-center gap-2">
          <Link href="/scents" className="btn-primary">
            See the scents
          </Link>
          <Link href="/sets" className="btn-secondary">
            See the sets
          </Link>
        </div>
      </div>
    );
  }

  const fifteenSplit = catalog.settings.atomizers[15] === false;

  return (
    <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_22rem] md:gap-12">
      <ul className="divide-y divide-line border-y border-line">
        {quote.lines.map((pl) => {
          const line = pl.line;
          const set = line.kind === "set" ? catalog.sets.find((s) => s.id === line.setId) : undefined;
          const photos = (set ? set.productIds : [line.kind === "set" ? "" : line.productId]).map((id) => byId.get(id)).filter((p) => p !== undefined);
          const href = line.kind === "set" ? `/sets#${line.setId}` : `/scents/${line.productId}`;
          return (
            <li key={pl.index} className="flex gap-4 py-4">
              <div className={`grid shrink-0 gap-1 ${photos.length > 1 ? "w-[5.5rem] grid-cols-3" : "w-[4.5rem]"}`}>
                {photos.map((p) => (
                  <ScentPhoto key={p.id} product={p} sizes="72px" className={photos.length > 1 ? "aspect-[1/2]" : "aspect-[5/6]"} inset="p-[6%]" />
                ))}
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <Link href={href} className="font-medium leading-snug hover:text-hibiscus">
                  {pl.label}
                </Link>
                {set && <p className="text-xs text-muted">{set.productIds.map((id) => byId.get(id)?.name).join(", ")}</p>}
                {line.kind === "single" && line.size === 15 && fifteenSplit && <p className="text-xs text-muted">Ships as a 10ml and a 5ml</p>}
                {line.kind === "bottle" && <p className="text-xs text-muted">Sealed and boxed. Not part of offers.</p>}
                <div className="mt-auto flex items-center justify-between gap-3 pt-2">
                  <div className="flex items-center gap-4">
                    {line.kind !== "bottle" && <Stepper label={pl.label} qty={line.qty} onChange={(q) => cartActions.setQty(pl.index, q)} />}
                    <button
                      type="button"
                      className="min-h-11 text-sm text-muted underline underline-offset-4 hover:text-ink"
                      aria-label={`Remove ${pl.label}`}
                      onClick={() => cartActions.setQty(pl.index, 0)}
                    >
                      Remove
                    </button>
                  </div>
                  <p className="text-right tabular-nums">
                    {pl.total !== pl.regularTotal && <s className="mr-2 text-sm text-muted">{formatTtd(pl.regularTotal)}</s>}
                    <span className="wide text-[0.9375rem]">{formatTtd(pl.total)}</span>
                  </p>
                </div>
              </div>
            </li>
          );
        })}
        {quote.freeSample && (
          <li className="flex items-center justify-between gap-3 py-4">
            <span>A 5ml, chosen by us</span>
            <span className="label-caps text-hibiscus">Free</span>
          </li>
        )}
      </ul>

      <aside className="space-y-4 md:sticky md:top-20 md:self-start">
        <OfferBox quote={quote} />
        <dl className="space-y-2 rounded-md border border-line p-5 tabular-nums">
          {quote.discount > 0 && (
            <>
              <div className="flex justify-between text-muted">
                <dt>Subtotal</dt>
                <dd>{formatTtd(quote.subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Offer</dt>
                <dd className="text-hibiscus">−{formatTtd(quote.discount)}</dd>
              </div>
            </>
          )}
          <div className={`flex items-baseline justify-between ${quote.discount > 0 ? "border-t border-line pt-3" : ""}`}>
            <dt>Items total</dt>
            <dd className="wide text-xl">{formatTtd(quote.itemsTotal)}</dd>
          </div>
          <p className="pt-1 text-xs text-muted">Delivery comes next, and you see it before you place the order.</p>
        </dl>
        {blockers.length > 0 && (
          <ul className="space-y-1 text-sm text-danger" role="alert">
            {blockers.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
        )}
        {blockers.length > 0 ? (
          <button type="button" className="btn-primary w-full" disabled>
            Checkout
          </button>
        ) : (
          <Link href="/checkout" className="btn-primary w-full">
            Checkout
          </Link>
        )}
      </aside>
    </div>
  );
}
