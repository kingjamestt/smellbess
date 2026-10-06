import { PAYMENT_LABELS } from "./delivery";
import { formatTtd } from "./pricing";
import type { Order } from "./types";

/** The message the customer sends us. Plain text, WhatsApp-friendly. */
export function orderMessage(order: Order, pickupDay = "Saturday"): string {
  const out: string[] = [];
  out.push(`Hi Smell Bess! I just placed order *${order.number}*.`);
  out.push("");
  for (const line of order.lines) {
    if (line.kind === "single") {
      const split = line.shipsAsSplit ? " (ships as 10ml + 5ml)" : "";
      out.push(`• ${line.qty}× ${line.label} ${line.size}ml${split}: ${formatTtd(line.unitPrice * line.qty)}`);
    } else if (line.kind === "bottle") {
      out.push(`• ${line.qty}× ${line.label}, sealed ${line.sizeMl}ml bottle: ${formatTtd(line.unitPrice * line.qty)}`);
    } else if (line.kind === "set") {
      out.push(`• ${line.qty}× ${line.label} set 3×${line.size}ml: ${formatTtd(line.unitPrice * line.qty)}`);
      out.push(`   (${line.items.map((i) => i.label).join(", ")})`);
    } else {
      out.push(`• Free 5ml surprise (you pick)`);
    }
  }
  if (order.offer) out.push(`Offer: ${order.offer.label}`);
  out.push("");
  if (order.delivery.pickupPoint) {
    const p = order.delivery.pickupPoint;
    out.push(`Pickup: ${pickupDay}, ${p.name} at ${p.time}`);
  } else {
    out.push(`Delivery: ${order.delivery.label} (${formatTtd(order.delivery.fee)})`);
  }
  if (order.totals.discount > 0) out.push(`Discount: -${formatTtd(order.totals.discount)}`);
  out.push(`Total: ${formatTtd(order.totals.total)}`);
  out.push(`Payment: ${PAYMENT_LABELS[order.payment]}`);
  out.push("");
  out.push(`Name: ${order.customer.name}`);
  if (order.customer.note) out.push(`Note: ${order.customer.note}`);
  return out.join("\n");
}

/** wa.me link with the message pre-filled. `number` is digits only, e.g. "18685550000". */
export function whatsappLink(number: string, message: string): string {
  return `https://wa.me/${number.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
}
