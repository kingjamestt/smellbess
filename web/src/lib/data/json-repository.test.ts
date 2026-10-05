import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import type { NewOrder } from "../types";
import { JsonFileRepository } from "./json-repository";
import type { Repository } from "./repository";

const newOrder: NewOrder = {
  customer: { name: "Test", phone: "+1 868-555-0000" },
  lines: [{ kind: "single", productId: "khamrah", label: "Lattafa Khamrah", size: 10, qty: 1, unitPrice: 100, shipsAsSplit: false }],
  offer: null,
  delivery: { method: "workplace", label: "Workplace hand-off", fee: 0 },
  payment: "bank_transfer",
  totals: { subtotal: 100, discount: 0, delivery: 0, total: 100 },
};

describe("JsonFileRepository", () => {
  let dir: string;
  let repo: Repository;

  beforeEach(async () => {
    dir = await mkdtemp(path.join(tmpdir(), "smellbess-"));
    repo = new JsonFileRepository(dir);
  });
  afterEach(() => rm(dir, { recursive: true, force: true }));

  it("starts from the seed", async () => {
    expect((await repo.listProducts()).length).toBe(23);
    expect((await repo.listBottles()).length).toBeGreaterThan(0);
    expect((await repo.getSettings()).atomizers[15]).toBe(true);
    expect(await repo.listOrders()).toEqual([]);
  });

  const demand = { khamrah: 10 };

  it("numbers orders sequentially from SB-1001 with unguessable ids", async () => {
    const [a, b] = await Promise.all([
      repo.placeOrder(newOrder, demand, "web"),
      repo.placeOrder(newOrder, demand, "web"),
    ]);
    if (!a.ok || !b.ok) throw new Error("expected both to save");
    expect([a.order.number, b.order.number].sort()).toEqual(["SB-1001", "SB-1002"]);
    expect(a.order.id).not.toBe(b.order.id);
    expect(a.order.id).toMatch(/^[0-9a-f-]{36}$/);
    expect(a.order.status).toBe("new");
    expect(await repo.getOrder(a.order.id)).toEqual(a.order);
  });

  it("refuses an order when open orders already hold the juice", async () => {
    // Demo stock: KH-01 has 95ml. Nine 10ml orders hold 90ml, so 10ml more won't fit.
    for (let i = 0; i < 9; i++) expect((await repo.placeOrder(newOrder, demand, "web")).ok).toBe(true);
    const r = await repo.placeOrder(newOrder, demand, "web");
    expect(r).toEqual({ ok: false, shortfalls: [{ productId: "khamrah", neededMl: 10, availableMl: 5 }] });
  });

  it("only lets one of two racing orders take the last juice", async () => {
    await repo.upsertBottle({ id: "KH-01", productId: "khamrah", sizeMl: 100, mlRemaining: 10, costTtd: 358, source: "x" });
    const results = await Promise.all([1, 2, 3].map(() => repo.placeOrder(newOrder, demand, "web")));
    expect(results.filter((r) => r.ok)).toHaveLength(1);
  });

  it("moves an order only from the status it's at, and deducts bottles", async () => {
    const r = await repo.placeOrder(newOrder, demand, "web");
    if (!r.ok) throw new Error("expected to save");
    expect(await repo.transitionOrder(r.order.id, "paid", "decanted", [])).toBe(false);
    expect(await repo.transitionOrder(r.order.id, "new", "paid", [])).toBe(true);
    expect(await repo.transitionOrder(r.order.id, "paid", "decanted", [{ bottleId: "KH-01", ml: 10 }])).toBe(true);
    expect((await repo.getOrder(r.order.id))?.status).toBe("decanted");
    expect((await repo.listBottles()).find((b) => b.id === "KH-01")?.mlRemaining).toBe(85);
  });

  it("persists across instances", async () => {
    const r = await repo.placeOrder(newOrder, demand, "web");
    if (!r.ok) throw new Error("expected to save");
    await repo.transitionOrder(r.order.id, "new", "paid", []);
    await repo.updateSettings({ atomizers: { 5: true, 10: true, 15: false } });
    const again = new JsonFileRepository(dir);
    expect((await again.getOrder(r.order.id))?.status).toBe("paid");
    expect((await again.getSettings()).atomizers[15]).toBe(false);
    expect((await again.getSettings()).pickupDay).toBe("Saturday");
  });

  it("updates an order's lines (picking the free 5ml)", async () => {
    const r = await repo.placeOrder(newOrder, demand, "web");
    if (!r.ok) throw new Error("expected to save");
    const lines = [...newOrder.lines, { kind: "free" as const, productId: "yara", label: "Lattafa Yara", size: 5 as const, qty: 1 as const, unitPrice: 0 as const }];
    await repo.updateOrderLines(r.order.id, lines, { khamrah: 10, yara: 5 });
    expect((await repo.getOrder(r.order.id))?.lines).toEqual(lines);
  });

  it("upserts bottles and areas", async () => {
    await repo.upsertBottle({ id: "KH-01", productId: "khamrah", sizeMl: 100, mlRemaining: 40, costTtd: 358, source: "x" });
    expect((await repo.listBottles()).find((b) => b.id === "KH-01")?.mlRemaining).toBe(40);
    await repo.deleteBottle("KH-01");
    expect((await repo.listBottles()).some((b) => b.id === "KH-01")).toBe(false);
    await repo.upsertArea({ id: "tobago", name: "Tobago", zone: "tobago" });
    expect((await repo.listAreas()).filter((a) => a.id === "tobago")).toHaveLength(1);
  });
});
