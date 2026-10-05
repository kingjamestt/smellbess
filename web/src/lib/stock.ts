import type { Bottle, Cart, CuratedSet, Order, OrderStatus, Product, Settings, SizeMl } from "./types";
import { SIZES } from "./types";

/**
 * Stock is worked out from real millilitres: what's left in each bottle, minus
 * what open orders have already claimed but not yet decanted.
 */

/** Orders in these statuses have claimed juice that's still in the bottle. */
export const RESERVING_STATUSES: readonly OrderStatus[] = ["new", "paid"];

export type StockState = "in_stock" | "sold_out" | "arriving" | "coming_soon" | "retired";

export interface SizeAvailability {
  size: SizeMl;
  available: boolean;
  /** How many of this size we could fill right now (sizes share the same juice). */
  unitsLeft: number;
  lowStock: boolean;
  /** 15ml atomizers are out: the 15ml ships as a 10ml + a 5ml. */
  shipsAsSplit: boolean;
  /** Honest badge text, e.g. "2 left in 10ml". */
  badge: string | null;
}

/** ml of each product claimed by orders that haven't been decanted yet. */
export function reservedMl(orders: readonly Order[]): Record<string, number> {
  const out: Record<string, number> = {};
  const add = (id: string, ml: number) => (out[id] = (out[id] ?? 0) + ml);
  for (const order of orders) {
    if (!RESERVING_STATUSES.includes(order.status)) continue;
    for (const line of order.lines) {
      if (line.kind === "set") {
        for (const item of line.items) add(item.productId, line.size * line.qty);
      } else if (line.productId) {
        // An unpicked free 5ml surprise reserves nothing until we choose it.
        add(line.productId, line.size * line.qty);
      }
    }
  }
  return out;
}

/** Usable ml per product: Σ mlRemaining − reserved. Never negative. */
export function availableMl(
  bottles: readonly Bottle[],
  reserved: Record<string, number> = {},
): Record<string, number> {
  const out: Record<string, number> = {};
  for (const b of bottles) {
    out[b.productId] = (out[b.productId] ?? 0) + Math.max(0, b.mlRemaining);
  }
  for (const [id, ml] of Object.entries(reserved)) {
    out[id] = Math.max(0, (out[id] ?? 0) - ml);
  }
  return out;
}

export function sizeAvailability(
  ml: number,
  settings: Pick<Settings, "atomizers" | "lowStockThreshold">,
): SizeAvailability[] {
  return SIZES.map((size) => {
    const unitsLeft = Math.floor(Math.max(0, ml) / size);
    const available = unitsLeft > 0;
    const lowStock = available && unitsLeft <= settings.lowStockThreshold;
    const shipsAsSplit = size === 15 && !settings.atomizers[15];
    return {
      size,
      available,
      unitsLeft,
      lowStock,
      shipsAsSplit,
      badge: !available ? null : lowStock ? `${unitsLeft} left in ${size}ml` : null,
    };
  });
}

export function stockState(
  product: Pick<Product, "id" | "status">,
  bottles: readonly Bottle[],
  ml: number,
): StockState {
  if (product.status === "retired") return "retired";
  if (product.status === "coming_soon") return "coming_soon";
  if (ml >= Math.min(...SIZES)) return "in_stock";
  return bottles.some((b) => b.productId === product.id) ? "sold_out" : "arriving";
}

export const STOCK_LABELS: Record<StockState, string> = {
  in_stock: "In stock",
  sold_out: "Sold out for now",
  arriving: "Arriving soon",
  coming_soon: "Coming soon",
  retired: "Retired",
};

/** ml of each product a cart needs, including set contents. */
export function cartDemandMl(
  cart: Cart,
  sets: Record<string, Pick<CuratedSet, "productIds">>,
): Record<string, number> {
  const out: Record<string, number> = {};
  const add = (id: string, ml: number) => (out[id] = (out[id] ?? 0) + ml);
  for (const line of cart.lines) {
    if (line.kind === "single") add(line.productId, line.size * line.qty);
    else for (const id of sets[line.setId]?.productIds ?? []) add(id, line.size * line.qty);
  }
  return out;
}

/** Products where the cart needs more juice than we have. Empty = all good. */
export function stockShortfalls(
  demand: Record<string, number>,
  available: Record<string, number>,
): { productId: string; neededMl: number; availableMl: number }[] {
  return Object.entries(demand)
    .filter(([id, ml]) => ml > (available[id] ?? 0))
    .map(([productId, neededMl]) => ({
      productId,
      neededMl,
      availableMl: available[productId] ?? 0,
    }));
}
