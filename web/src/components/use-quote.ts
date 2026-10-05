"use client";

import { useMemo } from "react";
import type { CatalogSnapshot } from "@/lib/catalog";
import { buildOfferContext, productLabel } from "@/lib/checkout";
import { priceCart } from "@/lib/offers";
import { cartDemandMl, stockShortfalls } from "@/lib/stock";
import type { Cart } from "@/lib/types";

/** Same pure functions the server uses, run in the browser for display. */
export function useQuote(catalog: CatalogSnapshot, cart: Cart) {
  return useMemo(() => {
    const offerCtx = buildOfferContext(catalog.products, catalog.sets, catalog.available, cart);
    const quote = priceCart(cart, offerCtx);
    const setMap = Object.fromEntries(catalog.sets.map((s) => [s.id, s]));
    const byId = new Map(catalog.products.map((p) => [p.id, p]));
    const shortfalls = stockShortfalls(cartDemandMl(cart, setMap), catalog.available).map((s) => {
      const p = byId.get(s.productId);
      return `Only ${s.availableMl}ml of ${p ? productLabel(p) : "a scent"} left. Lower the size or quantity.`;
    });
    const unavailable = cart.lines.flatMap((l) => {
      const ids = l.kind === "single" ? [l.productId] : (setMap[l.setId]?.productIds ?? []);
      return ids
        .map((id) => byId.get(id))
        .filter((p) => p && p.status !== "live")
        .map((p) => `${productLabel(p!)} isn't available to order yet.`);
    });
    const blockers = [...quote.problems, ...unavailable, ...shortfalls];
    return { quote, offerCtx, blockers, byId };
  }, [catalog, cart]);
}
