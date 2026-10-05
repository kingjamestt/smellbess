import { describe, expect, it } from "vitest";
import { parseBankAccounts } from "./bank";
import { canTransition, decantingList, nextStatuses } from "./pipeline";
import type { Order } from "./types";
import { orderMessage, whatsappLink } from "./whatsapp";

const order: Order = {
  id: "abc",
  number: "SB-1001",
  createdAt: "2026-10-24T12:00:00Z",
  status: "new",
  customer: { name: "Kerry", phone: "+1 868-555-1234", note: "Gift wrap pls" },
  lines: [
    { kind: "single", productId: "khamrah", label: "Lattafa Khamrah", size: 15, qty: 1, unitPrice: 150, shipsAsSplit: true },
    {
      kind: "set",
      setId: "fete-pack",
      label: "Fete Pack",
      size: 5,
      qty: 1,
      unitPrice: 150,
      items: [
        { productId: "hawas-ice", label: "Rasasi Hawas Ice" },
        { productId: "khamrah", label: "Lattafa Khamrah" },
        { productId: "yara", label: "Lattafa Yara" },
      ],
    },
    { kind: "free", productId: "yara", label: "Lattafa Yara", size: 5, qty: 1, unitPrice: 0 },
  ],
  offer: { id: "free_5ml", label: "Free 5ml", savings: 60, explanation: "" },
  delivery: {
    method: "pickup",
    label: "Saturday pickup: Price Plaza, Chaguanas, 10:00am",
    pickupPoint: { id: "price-plaza", name: "Price Plaza, Chaguanas", time: "10:00am" },
    fee: 0,
  },
  payment: "cash_on_pickup",
  totals: { subtotal: 300, discount: 0, delivery: 0, total: 300 },
};

describe("WhatsApp message", () => {
  const msg = orderMessage(order);
  it("includes the order number, items, pickup spot and time, and total", () => {
    expect(msg).toContain("*SB-1001*");
    expect(msg).toContain("1× Lattafa Khamrah 15ml (ships as 10ml + 5ml): TT$150");
    expect(msg).toContain("Fete Pack set 3×5ml: TT$150");
    expect(msg).toContain("Free 5ml: Lattafa Yara");
    expect(msg).toContain("Pickup: Saturday, Price Plaza, Chaguanas at 10:00am");
    expect(msg).toContain("Total: TT$300");
    expect(msg).toContain("Payment: Cash at pickup");
    expect(msg).toContain("Note: Gift wrap pls");
  });

  it("builds a wa.me link with the message encoded", () => {
    const link = whatsappLink("1 868-305-0506", "Hi & bye");
    expect(link).toBe("https://wa.me/18683050506?text=Hi%20%26%20bye");
  });

  it("shows delivery fee for delivery orders", () => {
    const m = orderMessage({
      ...order,
      delivery: { method: "odeliver", label: "ODeliver courier: Arima (Urban)", fee: 30 },
      payment: "bank_transfer",
    });
    expect(m).toContain("Delivery: ODeliver courier: Arima (Urban) (TT$30)");
  });
});

describe("bank accounts from env", () => {
  it("reads a numbered list of accounts", () => {
    const accounts = parseBankAccounts({
      SMELLBESS_BANK_1_BANK: "Test Bank",
      SMELLBESS_BANK_1_ACCOUNT_NAME: "Test Name",
      SMELLBESS_BANK_1_ACCOUNT_TYPE: "Savings",
      SMELLBESS_BANK_1_ACCOUNT_NUMBER: "0000001",
      SMELLBESS_BANK_2_BANK: "Other Bank",
      SMELLBESS_BANK_2_ACCOUNT_NUMBER: "0000002",
    });
    expect(accounts).toEqual([
      { bank: "Test Bank", accountName: "Test Name", accountType: "Savings", accountNumber: "0000001" },
      { bank: "Other Bank", accountName: "", accountType: "", accountNumber: "0000002" },
    ]);
  });

  it("is empty when nothing is configured", () => {
    expect(parseBankAccounts({})).toEqual([]);
  });

  it("skips incomplete accounts", () => {
    expect(parseBankAccounts({ SMELLBESS_BANK_1_BANK: "Only a bank" })).toEqual([]);
  });
});

describe("orders pipeline", () => {
  it("new → paid → decanted → ready → done for pickup", () => {
    expect(nextStatuses(order)).toEqual(["paid", "cancelled"]);
    expect(nextStatuses({ ...order, status: "decanted" })).toEqual(["ready", "cancelled"]);
    expect(canTransition({ ...order, status: "ready" }, "done")).toBe(true);
  });

  it("decanted → out for delivery for courier orders", () => {
    const courier = { status: "decanted" as const, delivery: { ...order.delivery, method: "odeliver" as const } };
    expect(nextStatuses(courier)).toEqual(["out_for_delivery", "cancelled"]);
  });

  it("can't skip steps or reopen", () => {
    expect(canTransition(order, "decanted")).toBe(false);
    expect(nextStatuses({ ...order, status: "done" })).toEqual([]);
    expect(nextStatuses({ ...order, status: "cancelled" })).toEqual([]);
  });
});

describe("decanting list", () => {
  it("groups paid orders (and new cash-at-pickup orders) by scent and size", () => {
    const rows = decantingList([
      order,
      { ...order, status: "paid", payment: "bank_transfer" },
      { ...order, status: "new", payment: "bank_transfer" },
      { ...order, status: "done" },
    ]);
    expect(rows.map((r) => [r.label, r.size, r.count, r.ml])).toEqual([
      ["Lattafa Khamrah", 5, 2, 10],
      ["Lattafa Khamrah", 15, 2, 30],
      ["Lattafa Yara", 5, 4, 20],
      ["Rasasi Hawas Ice", 5, 2, 10],
    ]);
  });
});
