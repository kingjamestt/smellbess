import type { Order, OrderStatus, SizeMl } from "./types";

/**
 * Orders pipeline: new → paid → decanted → ready / out for delivery → done.
 * "ready" is for pickup and hand-off; "out_for_delivery" is for drop-off and
 * courier. Any open order can be cancelled.
 */
const NEXT: Record<OrderStatus, OrderStatus[]> = {
  new: ["paid", "cancelled"],
  paid: ["decanted", "cancelled"],
  decanted: ["ready", "out_for_delivery", "cancelled"],
  ready: ["done", "cancelled"],
  out_for_delivery: ["done", "cancelled"],
  done: [],
  cancelled: [],
};

export const STATUS_LABELS: Record<OrderStatus, string> = {
  new: "New",
  paid: "Paid",
  decanted: "Decanted",
  ready: "Ready for pickup",
  out_for_delivery: "Out for delivery",
  done: "Done",
  cancelled: "Cancelled",
};

export function nextStatuses(order: Pick<Order, "status" | "delivery">): OrderStatus[] {
  const options = NEXT[order.status];
  if (order.status !== "decanted") return options;
  const inPerson = order.delivery.method === "pickup" || order.delivery.method === "workplace";
  return options.filter((s) => (inPerson ? s !== "out_for_delivery" : s !== "ready"));
}

export function canTransition(order: Pick<Order, "status" | "delivery">, to: OrderStatus): boolean {
  return nextStatuses(order).includes(to);
}

export interface DecantRow {
  productId: string;
  label: string;
  size: SizeMl;
  count: number;
  ml: number;
}

/** Orders placed in the last `days` days, cancelled ones left out. */
export function recentOrders(orders: readonly Order[], days: number, now = Date.now()): Order[] {
  return orders.filter((o) => o.status !== "cancelled" && now - Date.parse(o.createdAt) < days * 24 * 3600 * 1000);
}

/** Decanting-list row id for free 5ml surprises nobody has picked a scent for yet. */
export const SURPRISE_ID = "free-5ml-surprise";

/**
 * Today's decanting list: decants for every paid order, plus new cash-at-pickup
 * orders (they pay on Saturday, so they're decanted before payment). Grouped
 * by scent and size. Set contents and free 5mls are included; an unpicked
 * surprise 5ml shows as its own row so it isn't forgotten.
 */
export function decantingList(orders: readonly Order[]): DecantRow[] {
  const rows = new Map<string, DecantRow>();
  const add = (productId: string, label: string, size: SizeMl, count: number) => {
    const key = `${productId}:${size}`;
    const row = rows.get(key) ?? { productId, label, size, count: 0, ml: 0 };
    row.count += count;
    row.ml += size * count;
    rows.set(key, row);
  };
  for (const order of orders) {
    const due =
      order.status === "paid" || (order.status === "new" && order.payment === "cash_on_pickup");
    if (!due) continue;
    for (const line of order.lines) {
      if (line.kind === "bottle") continue; // sealed: packed whole, nothing to decant (see sealedToPack)
      if (line.kind === "set") for (const i of line.items) add(i.productId, i.label, line.size, line.qty);
      else if (line.productId) add(line.productId, line.label, line.size, line.qty);
      else add(SURPRISE_ID, "Free 5ml surprise (your pick)", line.size, line.qty);
    }
  }
  return [...rows.values()].sort((a, b) => a.label.localeCompare(b.label) || a.size - b.size);
}

export interface SealedRow {
  productId: string;
  label: string;
  count: number;
}

/** Sealed bottles to pack for the same orders as the decanting list. */
export function sealedToPack(orders: readonly Order[]): SealedRow[] {
  const rows = new Map<string, SealedRow>();
  for (const order of orders) {
    const due =
      order.status === "paid" || (order.status === "new" && order.payment === "cash_on_pickup");
    if (!due) continue;
    for (const line of order.lines) {
      if (line.kind !== "bottle") continue;
      const row = rows.get(line.productId) ?? { productId: line.productId, label: line.label, count: 0 };
      row.count += line.qty;
      rows.set(line.productId, row);
    }
  }
  return [...rows.values()].sort((a, b) => a.label.localeCompare(b.label));
}
