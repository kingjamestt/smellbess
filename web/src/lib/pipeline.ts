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

/**
 * Today's decanting list: decants for every paid order, plus new cash-at-pickup
 * orders (they pay on Saturday, so they're decanted before payment). Grouped
 * by scent and size. Set contents and free 5mls are included.
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
      if (line.kind === "set") for (const i of line.items) add(i.productId, i.label, line.size, line.qty);
      else add(line.productId, line.label, line.size, line.qty);
    }
  }
  return [...rows.values()].sort((a, b) => a.label.localeCompare(b.label) || a.size - b.size);
}
