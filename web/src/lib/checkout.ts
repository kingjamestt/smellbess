import { quoteDelivery, paymentOptionsFor, type DeliveryChoice, type DeliveryConfig } from "./delivery";
import { OFFER_RULES, priceCart, type OfferContext, type Quote } from "./offers";
import { cartDemandMl, sizeAvailability, stockShortfalls } from "./stock";
import type {
  Cart,
  CuratedSet,
  NewOrder,
  OrderLine,
  PaymentMethod,
  Product,
  Settings,
} from "./types";

export const productLabel = (p: Pick<Product, "house" | "name">) => `${p.house} ${p.name}`;

/** Products we could pack as the free 5ml right now: live, Tier A, 5ml left after this cart. */
export function freeSampleOptions(
  products: readonly Product[],
  available: Record<string, number>,
  cart: Cart,
  sets: Record<string, Pick<CuratedSet, "productIds">>,
): string[] {
  const demand = cartDemandMl(cart, sets);
  return products
    .filter(
      (p) =>
        p.status === "live" &&
        p.tier === OFFER_RULES.freeSample.tier &&
        (available[p.id] ?? 0) - (demand[p.id] ?? 0) >= OFFER_RULES.freeSample.size,
    )
    .map((p) => p.id);
}

export function buildOfferContext(
  products: readonly Product[],
  sets: readonly CuratedSet[],
  available: Record<string, number>,
  cart: Cart,
): OfferContext {
  const setMap = Object.fromEntries(sets.map((s) => [s.id, s]));
  return {
    products: Object.fromEntries(
      products.map((p) => [p.id, { tier: p.tier, label: productLabel(p) }]),
    ),
    sets: Object.fromEntries(
      sets.map((s) => [s.id, { name: s.name, productIds: s.productIds, price: s.price }]),
    ),
    freeSampleOptions: freeSampleOptions(products, available, cart, setMap),
  };
}

/** Accepts 7-digit local numbers or 1-868 numbers. Returns "+1 868-xxx-xxxx" or null. */
export function normalizeTtPhone(raw: string): string | null {
  let digits = raw.replace(/\D/g, "");
  if (digits.length === 7) digits = `1868${digits}`;
  if (digits.length === 10 && digits.startsWith("868")) digits = `1${digits}`;
  if (digits.length !== 11 || !digits.startsWith("1868")) return null;
  return `+1 868-${digits.slice(4, 7)}-${digits.slice(7)}`;
}

export interface CheckoutInput {
  cart: Cart;
  customer: { name: string; phone: string; note?: string };
  delivery: DeliveryChoice;
  payment: PaymentMethod;
  utm?: { source?: string; medium?: string; campaign?: string };
}

/** What the public checkout offers. Workplace hand-off is admin-only (WhatsApp orders). */
const PUBLIC_METHODS = ["pickup", "odeliver"] as const;
const ADMIN_METHODS = ["pickup", "odeliver", "workplace"] as const;
const PAYMENTS = ["bank_transfer", "cash_on_pickup"] as const;
const MAX_LINES = 30;
const MAX_QTY = 20;

const str = (v: unknown, max = 200): string | undefined =>
  typeof v === "string" ? v.slice(0, max) : undefined;
const oneOf = <T extends string>(v: unknown, options: readonly T[]): T | undefined =>
  options.includes(v as T) ? (v as T) : undefined;

/**
 * Shape-check the untrusted payload from the browser. Returns null if it isn't
 * a checkout at all. Business rules are checked later by buildOrder.
 */
export function sanitizeCheckoutInput(
  raw: unknown,
  { allowWorkplace = false }: { allowWorkplace?: boolean } = {},
): CheckoutInput | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const cart = r.cart as Record<string, unknown> | undefined;
  const customer = r.customer as Record<string, unknown> | undefined;
  const delivery = r.delivery as Record<string, unknown> | undefined;
  if (!cart || !Array.isArray(cart.lines) || !customer || !delivery) return null;
  if (cart.lines.length > MAX_LINES) return null;

  const lines: Cart["lines"] = [];
  for (const l of cart.lines as Record<string, unknown>[]) {
    const qty = Number(l?.qty);
    if (!Number.isInteger(qty) || qty < 1 || qty > MAX_QTY) return null;
    if (l.kind === "single" && typeof l.productId === "string" && [5, 10, 15].includes(l.size as number)) {
      lines.push({ kind: "single", productId: l.productId, size: l.size as 5 | 10 | 15, qty });
    } else if (l.kind === "set" && typeof l.setId === "string" && [5, 10].includes(l.size as number)) {
      lines.push({ kind: "set", setId: l.setId, size: l.size as 5 | 10, qty });
    } else {
      return null;
    }
  }
  const method = oneOf(delivery.method, allowWorkplace ? ADMIN_METHODS : PUBLIC_METHODS);
  const payment = oneOf(r.payment, PAYMENTS);
  if (!method || !payment) return null;
  const utm = r.utm as Record<string, unknown> | undefined;

  return {
    cart: { lines },
    customer: { name: str(customer.name) ?? "", phone: str(customer.phone, 40) ?? "", note: str(customer.note, 500) },
    delivery: { method, areaId: str(delivery.areaId, 100), pickupPointId: str(delivery.pickupPointId, 100) },
    payment,
    utm: utm ? { source: str(utm.source, 60), medium: str(utm.medium, 60), campaign: str(utm.campaign, 60) } : undefined,
  };
}

export interface CheckoutContext {
  products: readonly Product[];
  sets: readonly CuratedSet[];
  /** Usable ml per product, already net of open orders. */
  available: Record<string, number>;
  settings: Pick<Settings, "atomizers" | "lowStockThreshold">;
  delivery: DeliveryConfig;
}

export type CheckoutResult =
  | { ok: true; order: NewOrder; quote: Quote }
  | { ok: false; errors: string[] };

const clean = (s: string | undefined, max: number) =>
  (s ?? "").replace(/\s+/g, " ").trim().slice(0, max);

/**
 * Validate a checkout and turn it into an order. Pure: the server calls it
 * with fresh stock and prices; the cart's own numbers are never trusted.
 */
export function buildOrder(input: CheckoutInput, ctx: CheckoutContext): CheckoutResult {
  const errors: string[] = [];
  const products = new Map(ctx.products.map((p) => [p.id, p]));
  const sets = new Map(ctx.sets.map((s) => [s.id, s]));

  const name = clean(input.customer.name, 80);
  if (name.length < 2) errors.push("Tell us your name.");
  const phone = normalizeTtPhone(input.customer.phone ?? "");
  if (!phone) errors.push("Enter a TT phone number we can WhatsApp (e.g. 868-555-1234).");
  const note = clean(input.customer.note, 500) || undefined;

  const cart: Cart = { lines: input.cart.lines };
  if (cart.lines.length === 0) errors.push("Your cart is empty.");

  // Only live scents can be bought.
  for (const line of cart.lines) {
    const ids = line.kind === "single" ? [line.productId] : (sets.get(line.setId)?.productIds ?? []);
    for (const id of ids) {
      const p = products.get(id);
      if (p && p.status !== "live") errors.push(`${productLabel(p)} isn't available to order yet.`);
    }
    if (line.kind === "single" && ![5, 10, 15].includes(line.size)) errors.push("Unknown size.");
    if (line.kind === "set" && ![5, 10].includes(line.size)) errors.push("Sets come in 5ml or 10ml.");
  }

  const offerCtx = buildOfferContext(ctx.products, ctx.sets, ctx.available, cart);
  const quote = priceCart(cart, offerCtx);
  errors.push(...quote.problems);

  // The free 5ml is a surprise: no scent is reserved now. The offer is only
  // given while a Tier A scent has 5ml to spare after this cart.
  const setMap = Object.fromEntries(ctx.sets.map((s) => [s.id, s]));
  for (const s of stockShortfalls(cartDemandMl(cart, setMap), ctx.available)) {
    const p = products.get(s.productId);
    errors.push(
      `Not enough ${p ? productLabel(p) : "stock"} left for this order (${s.availableMl}ml available). Lower the size or quantity.`,
    );
  }

  const delivery = quoteDelivery(input.delivery, ctx.delivery);
  if (!delivery.ok) errors.push(delivery.error);
  else if (!paymentOptionsFor(delivery.method).includes(input.payment)) {
    errors.push("Cash is only for Saturday pickup. Delivery orders are paid by bank transfer before dispatch.");
  }

  if (errors.length > 0 || !delivery.ok || !phone) return { ok: false, errors: [...new Set(errors)] };

  const splitFifteen = sizeAvailability(0, ctx.settings).find((s) => s.size === 15)!.shipsAsSplit;
  const lines: OrderLine[] = quote.lines.map((pl) => {
    const line = pl.line;
    if (line.kind === "single") {
      return {
        kind: "single",
        productId: line.productId,
        label: productLabel(products.get(line.productId)!),
        size: line.size,
        qty: line.qty,
        unitPrice: pl.unit,
        shipsAsSplit: line.size === 15 && splitFifteen,
      };
    }
    const set = sets.get(line.setId)!;
    return {
      kind: "set",
      setId: set.id,
      label: set.name,
      size: line.size,
      qty: line.qty,
      unitPrice: pl.unit,
      items: set.productIds.map((id) => ({ productId: id, label: productLabel(products.get(id)!) })),
    };
  });
  if (quote.freeSample) {
    lines.push({ kind: "free", label: "Free 5ml surprise", size: 5, qty: 1, unitPrice: 0 });
  }

  const order: NewOrder = {
    customer: { name, phone, note },
    lines,
    offer: quote.offer
      ? {
          id: quote.offer.id,
          label: quote.offer.label,
          savings: quote.offer.value,
          explanation: quote.offer.explanation,
        }
      : null,
    delivery: {
      method: delivery.method,
      label: delivery.label,
      areaId: delivery.area?.id,
      areaName: delivery.area?.name,
      zone: delivery.area?.zone,
      pickupPoint: delivery.pickupPoint,
      fee: delivery.fee,
    },
    payment: input.payment,
    totals: {
      subtotal: quote.subtotal,
      discount: quote.discount,
      delivery: delivery.fee,
      total: quote.itemsTotal + delivery.fee,
    },
    utm: input.utm
      ? {
          source: clean(input.utm.source, 60) || undefined,
          medium: clean(input.utm.medium, 60) || undefined,
          campaign: clean(input.utm.campaign, 60) || undefined,
        }
      : undefined,
  };
  return { ok: true, order, quote };
}
