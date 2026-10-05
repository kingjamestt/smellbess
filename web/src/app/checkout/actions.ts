"use server";

import { sanitizeCheckoutInput } from "@/lib/checkout";
import { placeOrder } from "@/lib/server";

/**
 * Place an order. Reachable by direct POST, so everything is re-validated:
 * the payload is shape-checked, prices and offers are recomputed from the
 * tier table, and stock is re-checked inside an exclusive section.
 */
export async function placeOrderAction(
  raw: unknown,
): Promise<{ ok: true; id: string } | { ok: false; errors: string[] }> {
  const input = sanitizeCheckoutInput(raw);
  if (!input) return { ok: false, errors: ["Something's off with that order. Refresh the page and try again."] };
  try {
    return await placeOrder(input);
  } catch (err) {
    console.error("placeOrder failed", err);
    return { ok: false, errors: ["We couldn't save your order. Please try again, or message us on WhatsApp."] };
  }
}
