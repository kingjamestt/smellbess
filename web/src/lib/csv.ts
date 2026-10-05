import { METHOD_LABELS, PAYMENT_LABELS } from "./delivery";
import { STATUS_LABELS } from "./pipeline";
import type { Order } from "./types";

const HEADER = [
  "Order",
  "Date",
  "Status",
  "Name",
  "Phone",
  "Items",
  "Offer",
  "Subtotal",
  "Discount",
  "Delivery fee",
  "Total",
  "Delivery",
  "Area / stop",
  "Payment",
  "Note",
  "UTM source",
  "UTM campaign",
];

/** Quote a CSV cell; also defuse spreadsheet formulas (=, +, -, @) from customer text. */
function cell(value: string | number | undefined): string {
  let v = value === undefined ? "" : String(value);
  if (/^[=+\-@\t\r]/.test(v)) v = `'${v}`;
  return /[",\n\r]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v;
}

function itemsText(order: Order): string {
  return order.lines
    .map((l) =>
      l.kind === "free"
        ? `Free 5ml: ${l.productId ? l.label : "surprise (not picked)"}`
        : l.kind === "set"
          ? `${l.qty}x ${l.label} set 3x${l.size}ml`
          : `${l.qty}x ${l.label} ${l.size}ml`,
    )
    .join("; ");
}

/** Orders as CSV for Google Sheets or Excel. Dates are ISO (UTC). */
export function ordersCsv(orders: readonly Order[]): string {
  const rows = orders.map((o) => [
    o.number,
    o.createdAt,
    STATUS_LABELS[o.status],
    o.customer.name,
    // "+1 868-…" would read as a formula in Excel; local format is clearer anyway.
    o.customer.phone.replace(/^\+1\s*/, ""),
    itemsText(o),
    o.offer?.label,
    o.totals.subtotal,
    o.totals.discount,
    o.totals.delivery,
    o.totals.total,
    METHOD_LABELS[o.delivery.method],
    o.delivery.pickupPoint?.name ?? o.delivery.areaName,
    PAYMENT_LABELS[o.payment],
    o.customer.note,
    o.utm?.source,
    o.utm?.campaign,
  ]);
  return [HEADER, ...rows].map((r) => r.map(cell).join(",")).join("\r\n") + "\r\n";
}
