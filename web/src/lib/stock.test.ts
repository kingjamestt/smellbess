import { describe, expect, it } from "vitest";
import {
  availableMl,
  cartDemandMl,
  planDeductions,
  reservedMl,
  sizeAvailability,
  stockShortfalls,
  stockState,
} from "./stock";
import type { Bottle, Order, OrderStatus } from "./types";

const settings = { atomizers: { 5: true, 10: true, 15: true }, lowStockThreshold: 3 };

const bottle = (id: string, productId: string, mlRemaining: number): Bottle => ({
  id,
  productId,
  sizeMl: 100,
  mlRemaining,
  costTtd: 300,
  source: "test",
});

function order(status: OrderStatus, lines: Order["lines"]): Order {
  return {
    id: "x",
    number: "SB-1",
    createdAt: "2026-10-05T00:00:00Z",
    status,
    customer: { name: "T", phone: "+1 868-555-0000" },
    lines,
    offer: null,
    delivery: { method: "workplace", label: "", fee: 0 },
    payment: "bank_transfer",
    totals: { subtotal: 0, discount: 0, delivery: 0, total: 0 },
  };
}

describe("availableMl", () => {
  it("sums ml across bottles of the same scent", () => {
    expect(availableMl([bottle("1", "a", 40), bottle("2", "a", 12), bottle("3", "b", 5)])).toEqual({
      a: 52,
      b: 5,
    });
  });

  it("subtracts reserved ml and never goes negative", () => {
    expect(availableMl([bottle("1", "a", 40)], { a: 15, b: 10 })).toEqual({ a: 25, b: 0 });
    expect(availableMl([bottle("1", "a", 10)], { a: 30 })).toEqual({ a: 0 });
  });
});

describe("reservedMl", () => {
  const lines: Order["lines"] = [
    { kind: "single", productId: "a", label: "A", size: 10, qty: 2, unitPrice: 100, shipsAsSplit: false },
    {
      kind: "set",
      setId: "s",
      label: "S",
      size: 5,
      qty: 1,
      unitPrice: 150,
      items: [
        { productId: "a", label: "A" },
        { productId: "b", label: "B" },
        { productId: "c", label: "C" },
      ],
    },
    { kind: "free", productId: "b", label: "B", size: 5, qty: 1, unitPrice: 0 },
  ];

  it("counts singles, set contents and a picked free 5ml of open orders", () => {
    expect(reservedMl([order("new", lines)])).toEqual({ a: 25, b: 10, c: 5 });
  });

  it("an unpicked free 5ml surprise reserves nothing yet", () => {
    const surprise: Order["lines"] = [{ kind: "free", label: "Free 5ml surprise", size: 5, qty: 1, unitPrice: 0 }];
    expect(reservedMl([order("new", surprise)])).toEqual({});
  });

  it("only new and paid orders reserve juice", () => {
    const statuses: OrderStatus[] = ["decanted", "ready", "out_for_delivery", "done", "cancelled"];
    expect(reservedMl(statuses.map((s) => order(s, lines)))).toEqual({});
    expect(reservedMl([order("paid", lines)]).a).toBe(25);
  });
});

describe("sizeAvailability", () => {
  it("knows when stock is low, but never words it for the shop (owner: no stock counts on the site)", () => {
    const sizes = sizeAvailability(22, settings);
    expect(sizes.map((s) => [s.size, s.unitsLeft, s.lowStock, s.badge])).toEqual([
      [5, 4, false, null],
      [10, 2, true, null],
      [15, 1, true, null],
    ]);
  });

  it("no badges on a full bottle", () => {
    expect(sizeAvailability(95, settings).every((s) => s.available && !s.lowStock)).toBe(true);
  });

  it("a size is only available while there's enough juice", () => {
    const sizes = sizeAvailability(12, settings);
    expect(sizes.map((s) => s.available)).toEqual([true, true, false]);
    expect(sizeAvailability(4, settings).some((s) => s.available)).toBe(false);
  });

  it("15ml still sells as 10ml + 5ml when 15ml atomizers are out", () => {
    const sizes = sizeAvailability(95, { ...settings, atomizers: { 5: true, 10: true, 15: false } });
    const fifteen = sizes.find((s) => s.size === 15)!;
    expect(fifteen.available).toBe(true);
    expect(fifteen.shipsAsSplit).toBe(true);
    expect(sizes.filter((s) => s.shipsAsSplit)).toHaveLength(1);
  });

  it("respects the low-stock threshold setting", () => {
    expect(sizeAvailability(50, { ...settings, lowStockThreshold: 5 })[1].lowStock).toBe(true);
    expect(sizeAvailability(50, { ...settings, lowStockThreshold: 4 })[1].lowStock).toBe(false);
  });
});

describe("stockState", () => {
  const bottles = [bottle("1", "a", 3)];
  it("coming soon and retired win over stock", () => {
    expect(stockState({ id: "a", status: "coming_soon" }, bottles, 90)).toBe("coming_soon");
    expect(stockState({ id: "a", status: "retired" }, bottles, 90)).toBe("retired");
  });
  it("in stock with at least 5ml", () => {
    expect(stockState({ id: "a", status: "live" }, bottles, 5)).toBe("in_stock");
  });
  it("sold out when the bottle is (nearly) empty", () => {
    expect(stockState({ id: "a", status: "live" }, bottles, 3)).toBe("sold_out");
  });
  it("arriving when live but no bottle yet", () => {
    expect(stockState({ id: "z", status: "live" }, bottles, 0)).toBe("arriving");
  });
});

describe("cart demand and shortfalls", () => {
  const sets = { s: { productIds: ["a", "b", "c"] as [string, string, string] } };
  it("adds up singles and set contents", () => {
    const demand = cartDemandMl(
      {
        lines: [
          { kind: "single", productId: "a", size: 15, qty: 2 },
          { kind: "set", setId: "s", size: 10, qty: 1 },
        ],
      },
      sets,
    );
    expect(demand).toEqual({ a: 40, b: 10, c: 10 });
  });

  it("reports products where demand exceeds stock", () => {
    expect(stockShortfalls({ a: 40, b: 10 }, { a: 22, b: 95 })).toEqual([
      { productId: "a", neededMl: 40, availableMl: 22 },
    ]);
    expect(stockShortfalls({ a: 10 }, {})).toHaveLength(1);
    expect(stockShortfalls({ a: 10 }, { a: 10 })).toEqual([]);
  });
});

describe("sealed bottles", () => {
  const sealed = (id: string, productId: string, soldAt?: string): Bottle => ({
    ...bottle(id, productId, 100),
    sealed: true,
    soldAt,
  });

  it("count as units under bottle:<id>, never as decant ml", () => {
    const bottles = [bottle("HI-01", "hi", 22), sealed("HI-S1", "hi"), sealed("HD-S1", "hd", "2026-11-07")];
    expect(availableMl(bottles)).toEqual({ hi: 22, "bottle:hi": 1 });
  });

  it("are reserved by open orders like ml are", () => {
    const line = { kind: "bottle" as const, productId: "hi", label: "Hawas Ice", sizeMl: 100, qty: 1, unitPrice: 550 };
    const reserved = reservedMl([order("new", [line])]);
    expect(reserved).toEqual({ "bottle:hi": 1 });
    expect(availableMl([sealed("HI-S1", "hi")], reserved)).toEqual({ "bottle:hi": 0 });
  });

  it("are in a cart's demand and caught by the shortfall check", () => {
    const demand = cartDemandMl({ lines: [{ kind: "bottle", productId: "hi", qty: 1 }] }, {});
    expect(demand).toEqual({ "bottle:hi": 1 });
    expect(stockShortfalls(demand, { "bottle:hi": 0 })).toEqual([
      { productId: "bottle:hi", neededMl: 1, availableMl: 0 },
    ]);
  });

  it("are marked sold when the order is packed, and never decanted from", () => {
    const bottles = [bottle("HI-01", "hi", 22), sealed("HI-S1", "hi")];
    expect(planDeductions({ hi: 20, "bottle:hi": 1 }, bottles)).toEqual({
      deductions: [
        { bottleId: "HI-01", ml: 20 },
        { bottleId: "HI-S1", ml: 0, sell: true },
      ],
      missing: [],
    });
    expect(planDeductions({ hi: 30 }, bottles).missing).toEqual([{ productId: "hi", ml: 8 }]);
    expect(planDeductions({ "bottle:hi": 1 }, [sealed("HI-S1", "hi", "2026-11-07")]).missing).toEqual([
      { productId: "hi", ml: 1, sealed: true },
    ]);
  });

  it("keep a scent in stock when only the sealed bottle is left", () => {
    expect(stockState({ id: "hi", status: "live" }, [], 0, 1)).toBe("in_stock");
  });
});
