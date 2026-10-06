"use client";

import { useMemo } from "react";
import type { CatalogSnapshot } from "@/lib/catalog";
import { buildOfferContext, productLabel } from "@/lib/checkout";
import { priceCart } from "@/lib/offers";
import { cartDemandMl, isBottleKey, productOfKey, stockShortfalls } from "@/lib/stock";
import type { Cart } from "@/lib/types";

/** Same pure functions the server uses, run in the browser for display. */
export function useQuote(catalog: CatalogSnapshot, cart: Cart) {
  return useMemo(() => {
    const offerCtx = buildOfferContext(catalog.products, catalog.sets, catalog.available, cart);
    const quote = priceCart(cart, offerCtx);
    const setMap = Object.fromEntries(catalog.sets.map((s) => [s.id, s]));
    const byId = new Map(catalog.products.map((p) => [p.id, p]));
    const shortfalls = stockShortfalls(cartDemandMl(cart, setMap), catalog.available).map((s) => {
      const p = byId.get(productOfKey(s.productId));
      const name = p ? productLabel(p) : "a scent";
      if (isBottleKey(s.productId)) {
        return s.availableMl === 0
          ? `The sealed bottle of ${name} has sold. Remove it, or pick a decant instead.`
          : `We don't have that many sealed bottles of ${name}. Lower the quantity.`;
      }
      return `We don't have enough ${name} for that. Try a smaller size or fewer.`;
    });
    const unavailable = cart.lines.flatMap((l) => {
      const ids = l.kind === "set" ? (setMap[l.setId]?.productIds ?? []) : [l.productId];
      return ids
        .map((id) => byId.get(id))
        .filter((p) => p && p.status !== "live")
        .map((p) => `${productLabel(p!)} isn't available to order yet.`);
    });
    const blockers = [...quote.problems, ...unavailable, ...shortfalls];
    return { quote, offerCtx, blockers, byId };
  }, [catalog, cart]);
}
