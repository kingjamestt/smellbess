import { describe, expect, it } from "vitest";
import { isAdminEmail, parseAdminEmails } from "./admins";
import { newOrderEmail } from "./alerts";
import { ordersCsv } from "./csv";
import { orderDemandMl, planDeductions } from "./stock";
import type { Bottle, Order } from "./types";

const order: Order = {
  id: "11111111-2222-3333-4444-555555555555",
  number: "SB-1001",
  createdAt: "2026-10-24T12:00:00Z",
  status: "new",
  customer: { name: "Kerry, Ann", phone: "+1 868-555-1234", note: '=HYPERLINK("x")' },
  lines: [
    { kind: "single", productId: "khamrah", label: "Lattafa Khamrah", size: 10, qty: 2, unitPrice: 100, shipsAsSplit: false },
    {
      kind: "set",
      setId: "date-night",
      label: "Date Night",
      size: 5,
      qty: 1,
      unitPrice: 150,
      items: [
        { productId: "liquid-brun", label: "French Avenue Liquid Brun" },
        { productId: "khamrah-qahwa", label: "Lattafa Khamrah Qahwa" },
        { productId: "asad-bourbon", label: "Lattafa Asad Bourbon" },
      ],
    },
    { kind: "free", label: "Free 5ml surprise", size: 5, qty: 1, unitPrice: 0 },
  ],
  offer: { id: "free_5ml", label: "Free 5ml surprise", savings: 60, explanation: "" },
  delivery: { method: "odeliver", label: "ODeliver courier: Arima (Urban)", areaName: "Arima", zone: "urban", fee: 30 },
  payment: "bank_transfer",
  totals: { subtotal: 350, discount: 0, delivery: 30, total: 380 },
};

describe("admin allowlist", () => {
  it("parses, trims and lowercases; drops junk", () => {
    expect(parseAdminEmails(" A@x.com, b@y.co ,nope,, ")).toEqual(["a@x.com", "b@y.co"]);
    expect(parseAdminEmails(undefined)).toEqual([]);
  });

  it("matches case-insensitively, and nobody when the list is empty", () => {
    expect(isAdminEmail("A@X.com", ["a@x.com"])).toBe(true);
    expect(isAdminEmail("c@x.com", ["a@x.com"])).toBe(false);
    expect(isAdminEmail("a@x.com", [])).toBe(false);
    expect(isAdminEmail(null, ["a@x.com"])).toBe(false);
  });
});

describe("order demand and bottle deductions", () => {
  it("counts singles and set contents; an unpicked surprise needs nothing", () => {
    expect(orderDemandMl(order.lines)).toEqual({ khamrah: 20, "liquid-brun": 5, "khamrah-qahwa": 5, "asad-bourbon": 5 });
  });

  const bottle = (id: string, productId: string, ml: number): Bottle => ({
    id,
    productId,
    sizeMl: 100,
    mlRemaining: ml,
    costTtd: 0,
    source: "",
  });

  it("finishes the emptiest bottle first, then moves to the next", () => {
    const plan = planDeductions({ khamrah: 20 }, [bottle("KH-02", "khamrah", 95), bottle("KH-01", "khamrah", 8)]);
    expect(plan).toEqual({
      deductions: [
        { bottleId: "KH-01", ml: 8 },
        { bottleId: "KH-02", ml: 12 },
      ],
      missing: [],
    });
  });

  it("reports what the bottles can't cover", () => {
    const plan = planDeductions({ khamrah: 20, yara: 5 }, [bottle("KH-01", "khamrah", 15)]);
    expect(plan.missing).toEqual([
      { productId: "khamrah", ml: 5 },
      { productId: "yara", ml: 5 },
    ]);
  });
});

describe("CSV export", () => {
  const csv = ordersCsv([order]);
  const [header, row] = csv.trim().split("\r\n");

  it("has a header and one row per order", () => {
    expect(header.startsWith("Order,Date,Status,Name,Phone,Items")).toBe(true);
    expect(csv.trim().split("\r\n")).toHaveLength(2);
  });

  it("quotes commas and defuses spreadsheet formulas in customer text", () => {
    expect(row).toContain('"Kerry, Ann"');
    expect(row).toContain(`"'=HYPERLINK(""x"")"`);
  });

  it("writes TT phones in local format, so spreadsheets don't treat them as formulas", () => {
    expect(row).toContain(",868-555-1234,");
  });

  it("lists items, including an unpicked free 5ml", () => {
    expect(row).toContain("2x Lattafa Khamrah 10ml; 1x Date Night set 3x5ml; Free 5ml: surprise (not picked)");
    expect(row).toContain(",380,");
  });
});

describe("new order email", () => {
  it("has the order number, total and where it's going, plus an admin link", () => {
    const { subject, text } = newOrderEmail(order, "https://smellbess.netlify.app/");
    expect(subject).toBe("New order SB-1001: TT$380, ODeliver courier: Arima (Urban)");
    expect(text).toContain("WhatsApp: +1 868-555-1234");
    expect(text).toContain("https://smellbess.netlify.app/admin/orders/11111111-2222-3333-4444-555555555555");
  });
});
