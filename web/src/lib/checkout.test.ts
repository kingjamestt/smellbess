import { describe, expect, it } from "vitest";
import {
  buildOrder,
  normalizeTtPhone,
  sanitizeCheckoutInput,
  type CheckoutContext,
  type CheckoutInput,
} from "./checkout";
import type { CuratedSet, Product } from "./types";

const product = (id: string, tier: Product["tier"], status: Product["status"] = "live"): Product => ({
  id,
  house: "House",
  name: id,
  tier,
  gender: "unisex",
  status,
  smellsLike: [],
  notes: { top: [], heart: [], base: [] },
  vibes: [],
  occasions: [],
  blurb: "",
  draft: true,
  hue: 0,
});

const products = [
  product("a1", "A"),
  product("a2", "A"),
  product("a3", "A"),
  product("plus", "A+"),
  product("soon", "A", "coming_soon"),
];
const sets: CuratedSet[] = [
  { id: "fete", name: "Fete Pack", description: "", productIds: ["a1", "a2", "a3"], draft: true },
];

const ctx: CheckoutContext = {
  products,
  sets,
  available: { a1: 95, a2: 95, a3: 4, plus: 95 },
  settings: { atomizers: { 5: true, 10: true, 15: true }, lowStockThreshold: 3 },
  delivery: {
    areas: [{ id: "pos", name: "Port of Spain", zone: "urban" }],
    pickupDay: "Saturday",
    pickupPoints: [{ id: "pp", name: "Price Plaza, Chaguanas", time: "10:00am" }],
  },
};

const base: CheckoutInput = {
  cart: { lines: [{ kind: "single", productId: "a1", size: 10, qty: 1 }] },
  customer: { name: "  Kerry   Ann ", phone: "868 555 1234" },
  delivery: { method: "pickup", pickupPointId: "pp" },
  payment: "cash_on_pickup",
};

describe("sanitizeCheckoutInput", () => {
  it("passes a well-formed payload through", () => {
    expect(sanitizeCheckoutInput(base)).toEqual({ ...base, customer: { ...base.customer, note: undefined }, delivery: { ...base.delivery, areaId: undefined }, utm: undefined });
  });

  it.each([
    null,
    "x",
    { ...base, cart: { lines: "no" } },
    { ...base, payment: "card" },
    { ...base, delivery: { method: "drone" } },
    { ...base, cart: { lines: [{ kind: "single", productId: "a1", size: 30, qty: 1 }] } },
    { ...base, cart: { lines: [{ kind: "single", productId: "a1", size: 10, qty: 0 }] } },
    { ...base, cart: { lines: [{ kind: "single", productId: "a1", size: 10, qty: 999 }] } },
    { ...base, cart: { lines: [{ kind: "set", setId: "fete", size: 15, qty: 1 }] } },
  ])("rejects malformed input %#", (raw) => expect(sanitizeCheckoutInput(raw)).toBeNull());

  it("ignores any prices the browser sends", () => {
    const raw = { ...base, cart: { lines: [{ kind: "single", productId: "a1", size: 10, qty: 1, unitPrice: 1 }] } };
    expect(sanitizeCheckoutInput(raw)?.cart.lines[0]).toEqual({ kind: "single", productId: "a1", size: 10, qty: 1 });
  });
});

describe("normalizeTtPhone", () => {
  it.each([
    ["5551234", "+1 868-555-1234"],
    ["868-555-1234", "+1 868-555-1234"],
    ["+1 (868) 555-1234", "+1 868-555-1234"],
    ["18685551234", "+1 868-555-1234"],
  ])("%s → %s", (raw, out) => expect(normalizeTtPhone(raw)).toBe(out));

  it.each(["", "12345", "+1 212 555 1234", "abc"])("rejects %s", (raw) =>
    expect(normalizeTtPhone(raw)).toBeNull(),
  );
});

describe("buildOrder", () => {
  it("builds a pickup order paid in cash", () => {
    const r = buildOrder(base, ctx);
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.order.customer).toEqual({ name: "Kerry Ann", phone: "+1 868-555-1234", note: undefined });
    expect(r.order.delivery).toMatchObject({
      method: "pickup",
      fee: 0,
      pickupPoint: { name: "Price Plaza, Chaguanas", time: "10:00am" },
    });
    expect(r.order.totals).toEqual({ subtotal: 100, discount: 0, delivery: 0, total: 100 });
  });

  it("adds the delivery fee and the bundle discount", () => {
    const r = buildOrder(
      {
        ...base,
        cart: { lines: [{ kind: "single", productId: "a1", size: 10, qty: 5 }] },
        delivery: { method: "odeliver", areaId: "pos" },
        payment: "bank_transfer",
      },
      ctx,
    );
    expect(r.ok && r.order.totals).toEqual({ subtotal: 500, discount: 150, delivery: 30, total: 380 });
    expect(r.ok && r.order.offer?.id).toBe("bundle_5x10");
  });

  it("refuses cash for delivery orders", () => {
    const r = buildOrder({ ...base, delivery: { method: "odeliver", areaId: "pos" } }, ctx);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errors[0]).toMatch(/Cash is only for pickup/);
  });

  it("adds the free 5ml as a surprise line with no scent picked", () => {
    const cart = { lines: [{ kind: "single" as const, productId: "a1", size: 10 as const, qty: 3 }] };
    const r = buildOrder({ ...base, cart }, ctx);
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.order.lines.at(-1)).toEqual({
      kind: "free",
      label: "Free 5ml surprise",
      size: 5,
      qty: 1,
      unitPrice: 0,
    });
    expect(r.order.offer?.id).toBe("free_5ml");
    expect(r.order.totals.total).toBe(300);
  });

  it("A+ 10ml decants count toward the free 5ml", () => {
    const cart = { lines: [{ kind: "single" as const, productId: "plus", size: 10 as const, qty: 3 }] };
    const r = buildOrder({ ...base, cart }, ctx);
    expect(r.ok && r.order.lines.at(-1)?.kind).toBe("free");
  });

  it("no free 5ml when no Tier A scent has 5ml to spare", () => {
    const cart = { lines: [{ kind: "single" as const, productId: "plus", size: 10 as const, qty: 3 }] };
    const r = buildOrder({ ...base, cart }, { ...ctx, available: { ...ctx.available, a1: 4, a2: 4 } });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.order.lines.some((l) => l.kind === "free")).toBe(false);
  });

  it("the public checkout only offers pickup and ODeliver", () => {
    expect(sanitizeCheckoutInput({ ...base, delivery: { method: "workplace" } })).toBeNull();
    expect(sanitizeCheckoutInput({ ...base, delivery: { method: "own_dropoff", areaId: "pos" } })).toBeNull();
  });

  it("checks stock including set contents", () => {
    const r = buildOrder({ ...base, cart: { lines: [{ kind: "set", setId: "fete", size: 5, qty: 1 }] } }, ctx);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errors[0]).toBe("We don't have enough House a3 for this order. Try a smaller size or fewer.");
  });

  it("checks stock across lines of the same scent", () => {
    const r = buildOrder(
      {
        ...base,
        cart: {
          lines: [
            { kind: "single", productId: "plus", size: 15, qty: 6 },
            { kind: "single", productId: "plus", size: 10, qty: 1 },
          ],
        },
      },
      ctx,
    );
    expect(r.ok).toBe(false);
  });

  it("can't order coming-soon scents", () => {
    const r = buildOrder({ ...base, cart: { lines: [{ kind: "single", productId: "soon", size: 5, qty: 1 }] } }, ctx);
    expect(r.ok).toBe(false);
  });

  it("validates name, phone and empty cart", () => {
    const r = buildOrder({ ...base, cart: { lines: [] }, customer: { name: "", phone: "123" } }, ctx);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errors).toHaveLength(3);
  });

  it("labels 15ml as 10ml + 5ml when 15ml atomizers are out", () => {
    const r = buildOrder(
      { ...base, cart: { lines: [{ kind: "single", productId: "a1", size: 15, qty: 1 }] } },
      { ...ctx, settings: { ...ctx.settings, atomizers: { 5: true, 10: true, 15: false } } },
    );
    expect(r.ok && r.order.lines[0]).toMatchObject({ size: 15, unitPrice: 150, shipsAsSplit: true });
  });

  it("keeps UTM source for the order", () => {
    const r = buildOrder({ ...base, utm: { source: "instagram", medium: "bio" } }, ctx);
    expect(r.ok && r.order.utm).toEqual({ source: "instagram", medium: "bio", campaign: undefined });
  });
});

describe("sealed bottles at checkout", () => {
  const bottled = products.map((p) => (p.id === "a1" ? { ...p, bottle: { sizeMl: 100, price: 550 } } : p));
  const bctx: CheckoutContext = { ...ctx, products: bottled, available: { ...ctx.available, "bottle:a1": 1 } };
  const input: CheckoutInput = { ...base, cart: { lines: [{ kind: "bottle", productId: "a1", qty: 1 }] } };

  it("accepts a bottle line from the browser", () => {
    expect(sanitizeCheckoutInput(input)?.cart.lines).toEqual([{ kind: "bottle", productId: "a1", qty: 1 }]);
  });

  it("builds a bottle order line at the bottle price", () => {
    const r = buildOrder(input, bctx);
    if (!r.ok) throw new Error(r.errors.join("; "));
    expect(r.order.lines).toEqual([
      { kind: "bottle", productId: "a1", label: "House a1", sizeMl: 100, qty: 1, unitPrice: 550 },
    ]);
    expect(r.order.totals.total).toBe(550);
  });

  it("says plainly when the sealed bottle has just sold", () => {
    const r = buildOrder(input, { ...bctx, available: { ...ctx.available, "bottle:a1": 0 } });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errors).toContain("The full bottle of House a1 has just sold. Its decants are still available.");
  });
});
