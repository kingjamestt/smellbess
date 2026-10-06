import type { Bottle, Cart, CuratedSet, Order, OrderLine, OrderStatus, Product, Settings, SizeMl } from "./types";
import { SIZES } from "./types";

/**
 * Stock is worked out from real millilitres: what's left in each open bottle,
 * minus what open orders have already claimed but not yet decanted.
 *
 * Sealed bottles (sold whole) live in the same maps under `bottle:<productId>`
 * and count units, not ml. So one reservation map covers both, and the same
 * shortfall check guards the last 10ml and the last sealed bottle.
 */

/** Stock-map key for a product's sealed bottles (a count, not ml). */
export const bottleKey = (productId: string) => `bottle:${productId}`;
export const isBottleKey = (key: string) => key.startsWith("bottle:");
export const productOfKey = (key: string) => (isBottleKey(key) ? key.slice("bottle:".length) : key);

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
  /**
   * Always null: the shop never says how much is left (owner, 6 Oct 2026).
   * `lowStock` and `unitsLeft` stay for admin and internal checks.
   */
  badge: string | null;
}

/**
 * What an order's lines need: ml per product for singles, set contents and
 * the free 5ml once a scent is picked (an unpicked surprise needs nothing
 * yet), plus sealed bottles under `bottle:<productId>`.
 */
export function orderDemandMl(lines: readonly OrderLine[]): Record<string, number> {
  const out: Record<string, number> = {};
  const add = (id: string, n: number) => (out[id] = (out[id] ?? 0) + n);
  for (const line of lines) {
    if (line.kind === "set") {
      for (const item of line.items) add(item.productId, line.size * line.qty);
    } else if (line.kind === "bottle") {
      add(bottleKey(line.productId), line.qty);
    } else if (line.productId) {
      add(line.productId, line.size * line.qty);
    }
  }
  return out;
}

/** ml of each product claimed by orders that haven't been decanted yet. */
export function reservedMl(orders: readonly Order[]): Record<string, number> {
  const out: Record<string, number> = {};
  for (const order of orders) {
    if (!RESERVING_STATUSES.includes(order.status)) continue;
    for (const [id, ml] of Object.entries(orderDemandMl(order.lines))) out[id] = (out[id] ?? 0) + ml;
  }
  return out;
}

/** Sealed bottles still for sale. */
export const sealedForSale = (b: Bottle) => b.sealed === true && !b.soldAt;

/**
 * Which bottles to take an order's juice from when it's decanted: the
 * emptiest open bottle of each scent first, so bottles get finished. Sealed
 * bottles in the order are marked sold (`sell: true`). Lists anything the
 * bottles can't cover (`ml` is a count for sealed bottles).
 */
export function planDeductions(
  demand: Record<string, number>,
  bottles: readonly Bottle[],
): {
  deductions: { bottleId: string; ml: number; sell?: true }[];
  missing: { productId: string; ml: number; sealed?: true }[];
} {
  const deductions: { bottleId: string; ml: number; sell?: true }[] = [];
  const missing: { productId: string; ml: number; sealed?: true }[] = [];
  for (const [key, need] of Object.entries(demand)) {
    if (isBottleKey(key)) {
      const productId = productOfKey(key);
      const sealed = bottles
        .filter((b) => b.productId === productId && sealedForSale(b))
        .sort((a, b) => a.id.localeCompare(b.id))
        .slice(0, need);
      for (const b of sealed) deductions.push({ bottleId: b.id, ml: 0, sell: true });
      if (sealed.length < need) missing.push({ productId, ml: need - sealed.length, sealed: true });
      continue;
    }
    const productId = key;
    let left = need;
    const candidates = bottles
      .filter((b) => b.productId === productId && !b.sealed && b.mlRemaining > 0)
      .sort((a, b) => a.mlRemaining - b.mlRemaining || a.id.localeCompare(b.id));
    for (const b of candidates) {
      if (left <= 0) break;
      const take = Math.min(left, b.mlRemaining);
      deductions.push({ bottleId: b.id, ml: take });
      left -= take;
    }
    if (left > 0) missing.push({ productId, ml: left });
  }
  return { deductions, missing };
}

/**
 * Usable stock per product: Σ mlRemaining of open bottles − reserved, and
 * sealed bottles for sale under `bottle:<productId>`. Never negative.
 */
export function availableMl(
  bottles: readonly Bottle[],
  reserved: Record<string, number> = {},
): Record<string, number> {
  const out: Record<string, number> = {};
  for (const b of bottles) {
    if (b.sealed) {
      if (sealedForSale(b)) out[bottleKey(b.productId)] = (out[bottleKey(b.productId)] ?? 0) + 1;
      continue;
    }
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
      badge: null,
    };
  });
}

export function stockState(
  product: Pick<Product, "id" | "status">,
  bottles: readonly Bottle[],
  ml: number,
  sealedLeft = 0,
): StockState {
  if (product.status === "retired") return "retired";
  if (product.status === "coming_soon") return "coming_soon";
  if (ml >= Math.min(...SIZES) || sealedLeft > 0) return "in_stock";
  return bottles.some((b) => b.productId === product.id) ? "sold_out" : "arriving";
}

export const STOCK_LABELS: Record<StockState, string> = {
  in_stock: "In stock",
  sold_out: "Sold out for now",
  arriving: "Arriving soon",
  coming_soon: "Coming soon",
  retired: "Retired",
};

/** What a cart needs: ml per product (set contents included) and sealed bottles. */
export function cartDemandMl(
  cart: Cart,
  sets: Record<string, Pick<CuratedSet, "productIds">>,
): Record<string, number> {
  const out: Record<string, number> = {};
  const add = (id: string, n: number) => (out[id] = (out[id] ?? 0) + n);
  for (const line of cart.lines) {
    if (line.kind === "single") add(line.productId, line.size * line.qty);
    else if (line.kind === "bottle") add(bottleKey(line.productId), line.qty);
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
