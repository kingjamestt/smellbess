"use client";

import { cartActions } from "@/lib/cart-store";
import type { OfferContext, Quote } from "@/lib/offers";

/** Shows the one applied offer in plain words, nudges, and the free 5ml picker. */
export function OfferBox({
  quote,
  offerCtx,
  editable = true,
}: {
  quote: Quote;
  offerCtx: OfferContext;
  editable?: boolean;
}) {
  if (!quote.offer && quote.hints.length === 0 && quote.messages.length === 0) return null;
  const free = quote.freeSample;
  return (
    <section aria-label="Offer" className="space-y-2 rounded-2xl border-2 border-sun bg-sun/15 p-4">
      {quote.offer && (
        <p className="font-display text-lg font-extrabold">{quote.offer.label}</p>
      )}
      {quote.messages.map((m) => (
        <p key={m} className="text-sm">
          {m}
        </p>
      ))}
      {free && editable && (
        <label className="block pt-1">
          <span className="label">Your free 5ml (any in-stock Arabian)</span>
          <select
            className="field"
            value={free.productId ?? ""}
            onChange={(e) => cartActions.setFreeSample(e.target.value || undefined)}
          >
            <option value="">Choose one…</option>
            {free.options.map((id) => (
              <option key={id} value={id}>
                {offerCtx.products[id]?.label}
              </option>
            ))}
          </select>
        </label>
      )}
      {quote.hints.map((h) => (
        <p key={h} className="text-sm font-semibold text-sea">
          {h}
        </p>
      ))}
    </section>
  );
}
