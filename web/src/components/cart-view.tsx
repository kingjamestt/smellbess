"use client";

import Link from "next/link";
import type { CatalogSnapshot } from "@/lib/catalog";
import { cartActions, useCart, useHydrated } from "@/lib/cart-store";
import { formatTtd } from "@/lib/pricing";
import { OfferBox } from "./offer-box";
import { ScentArt } from "./scent-art";
import { useQuote } from "./use-quote";

export function CartView({ catalog }: { catalog: CatalogSnapshot }) {
  const cart = useCart();
  const hydrated = useHydrated();
  const { quote, blockers, byId } = useQuote(catalog, cart);

  if (!hydrated) return <p className="text-muted">Loading your cart…</p>;
  if (cart.lines.length === 0) {
    return (
      <div className="card space-y-3 p-6 text-center">
        <p className="text-lg font-semibold">Your cart is empty.</p>
        <div className="flex flex-wrap justify-center gap-2">
          <Link href="/scents" className="btn-primary">
            Browse scents
          </Link>
          <Link href="/sets" className="btn-secondary">
            See curated sets
          </Link>
        </div>
      </div>
    );
  }

  const fifteenSplit = catalog.settings.atomizers[15] === false;

  return (
    <div className="grid gap-6 md:grid-cols-[1fr_20rem]">
      <ul className="space-y-3">
        {quote.lines.map((pl) => {
          const line = pl.line;
          const hue =
            line.kind === "single"
              ? (byId.get(line.productId)?.hue ?? 0)
              : (byId.get(catalog.sets.find((s) => s.id === line.setId)?.productIds[0] ?? "")?.hue ?? 0);
          const href = line.kind === "single" ? `/scents/${line.productId}` : "/sets";
          const setItems =
            line.kind === "set"
              ? catalog.sets
                  .find((s) => s.id === line.setId)
                  ?.productIds.map((id) => byId.get(id)?.name)
                  .join(", ")
              : null;
          return (
            <li key={pl.index} className="card flex gap-3 p-3">
              <ScentArt hue={hue} label={pl.label} className="h-20 w-20 shrink-0 rounded-xl" />
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <Link href={href} className="font-semibold leading-tight hover:underline">
                  {pl.label}
                </Link>
                {setItems && <p className="text-xs text-muted">{setItems}</p>}
                {line.kind === "single" && line.size === 15 && fifteenSplit && (
                  <p className="text-xs font-semibold text-muted">Ships as 10ml + 5ml</p>
                )}
                <div className="mt-auto flex items-center justify-between gap-2">
                  <div className="flex items-center rounded-full border border-line">
                    <button
                      type="button"
                      className="h-10 w-10 text-lg font-bold"
                      aria-label={`One less ${pl.label}`}
                      onClick={() => cartActions.setQty(pl.index, line.qty - 1)}
                    >
                      −
                    </button>
                    <span className="w-6 text-center font-semibold" aria-label="Quantity">
                      {line.qty}
                    </span>
                    <button
                      type="button"
                      className="h-10 w-10 text-lg font-bold"
                      aria-label={`One more ${pl.label}`}
                      onClick={() => cartActions.setQty(pl.index, line.qty + 1)}
                    >
                      +
                    </button>
                  </div>
                  <p className="text-right font-semibold">
                    {pl.total !== pl.regularTotal && (
                      <s className="mr-1 text-sm font-normal text-muted">{formatTtd(pl.regularTotal)}</s>
                    )}
                    {formatTtd(pl.total)}
                  </p>
                </div>
              </div>
            </li>
          );
        })}
        {quote.freeSample && (
          <li className="card flex items-center justify-between gap-3 border-dashed p-3">
            <span className="font-semibold">Free 5ml surprise (we pick)</span>
            <span className="font-semibold text-sea">FREE</span>
          </li>
        )}
      </ul>

      <aside className="space-y-4">
        <OfferBox quote={quote} />
        <dl className="card space-y-1 p-4">
          <div className="flex justify-between">
            <dt>Subtotal</dt>
            <dd>{formatTtd(quote.subtotal)}</dd>
          </div>
          {quote.discount > 0 && (
            <div className="flex justify-between text-sea">
              <dt>Offer</dt>
              <dd>−{formatTtd(quote.discount)}</dd>
            </div>
          )}
          <div className="flex justify-between border-t border-line pt-2 text-lg font-extrabold">
            <dt>Items total</dt>
            <dd>{formatTtd(quote.itemsTotal)}</dd>
          </div>
          <p className="pt-1 text-xs text-muted">Delivery is added next and shown before you place the order.</p>
        </dl>
        {blockers.length > 0 && (
          <ul className="space-y-1 text-sm font-semibold text-danger" role="alert">
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
