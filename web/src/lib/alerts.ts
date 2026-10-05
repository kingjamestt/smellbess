import "server-only";
import { parseAdminEmails } from "./admins";
import { formatTtd } from "./pricing";
import type { Order } from "./types";
import { orderMessage } from "./whatsapp";

/** Plain-text email body for a new order. Pure, so it can be tested. */
export function newOrderEmail(order: Order, siteUrl?: string): { subject: string; text: string } {
  const where = order.delivery.pickupPoint ? `pickup at ${order.delivery.pickupPoint.name}` : order.delivery.label;
  const link = siteUrl ? `\n\nOpen in admin: ${siteUrl.replace(/\/$/, "")}/admin/orders/${order.id}` : "";
  return {
    subject: `New order ${order.number}: ${formatTtd(order.totals.total)}, ${where}`,
    text: `${orderMessage(order)}\n\nWhatsApp: ${order.customer.phone}${link}`,
  };
}

/**
 * Email both admins about a new order, via Resend (resend.com). Does nothing
 * unless RESEND_API_KEY and SMELLBESS_ADMIN_EMAILS are set. Never throws: a
 * failed email must not break checkout.
 */
export async function sendNewOrderAlert(order: Order): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = parseAdminEmails(process.env.SMELLBESS_ADMIN_EMAILS);
  if (!apiKey || to.length === 0) return;
  const { subject, text } = newOrderEmail(order, process.env.SMELLBESS_SITE_URL);
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.SMELLBESS_ALERT_FROM ?? "Smell Bess <onboarding@resend.dev>",
        to,
        subject,
        text,
      }),
    });
    if (!res.ok) console.error("Order alert email failed", res.status, await res.text());
  } catch (err) {
    console.error("Order alert email failed", err);
  }
}
