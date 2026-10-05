import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import type { NewOrder } from "../types";
import { JsonFileRepository } from "./json-repository";

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
  let repo: JsonFileRepository;

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

  it("numbers orders sequentially from SB-1001 with unguessable ids", async () => {
    const [a, b] = await Promise.all([repo.createOrder(newOrder), repo.createOrder(newOrder)]);
    expect([a.number, b.number].sort()).toEqual(["SB-1001", "SB-1002"]);
    expect(a.id).not.toBe(b.id);
    expect(a.id).toMatch(/^[0-9a-f-]{36}$/);
    expect(a.status).toBe("new");
    expect(await repo.getOrder(a.id)).toEqual(a);
  });

  it("persists across instances", async () => {
    const order = await repo.createOrder(newOrder);
    await repo.updateOrderStatus(order.id, "paid");
    await repo.updateSettings({ atomizers: { 5: true, 10: true, 15: false } });
    const again = new JsonFileRepository(dir);
    expect((await again.getOrder(order.id))?.status).toBe("paid");
    expect((await again.getSettings()).atomizers[15]).toBe(false);
  });

  it("upserts bottles and areas", async () => {
    await repo.upsertBottle({ id: "KH-01", productId: "khamrah", sizeMl: 100, mlRemaining: 40, costTtd: 358, source: "x" });
    expect((await repo.listBottles()).find((b) => b.id === "KH-01")?.mlRemaining).toBe(40);
    await repo.upsertArea({ id: "tobago", name: "Tobago", zone: "tobago" });
    expect((await repo.listAreas()).filter((a) => a.id === "tobago")).toHaveLength(1);
  });
});
