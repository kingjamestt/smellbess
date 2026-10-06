import { AsyncLocalStorage } from "node:async_hooks";
import { randomUUID } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { AREAS, DEFAULT_SETTINGS, DEMO_BOTTLES, PRODUCTS, SETS } from "@/data/seed";
import { availableMl, reservedMl, stockShortfalls } from "../stock";
import type { Area, Bottle, NewOrder, Order, OrderLine, OrderStatus, Settings } from "../types";
import type { BottleDeduction, PlaceOrderResult, Repository } from "./repository";

interface StoreFile {
  version: 1;
  bottles: Bottle[];
  areas: Area[];
  settings: Settings;
  orders: Order[];
  nextOrderSeq: number;
}

const FIRST_ORDER_SEQ = 1001;

function initialState(): StoreFile {
  return {
    version: 1,
    bottles: structuredClone(DEMO_BOTTLES),
    areas: structuredClone(AREAS),
    settings: structuredClone(DEFAULT_SETTINGS),
    orders: [],
    nextOrderSeq: FIRST_ORDER_SEQ,
  };
}

/**
 * File-backed store. The catalog (products, sets) comes from src/data/seed.ts;
 * mutable state (bottles, areas, settings, orders) lives in
 * `<SMELLBESS_DATA_DIR or ./.data>/store.json`, created from the seed on first
 * use. Delete the file to reset.
 *
 * Fine for local dev and a single server. Serverless hosts have no writable
 * disk, so production uses SupabaseRepository.
 */
export class JsonFileRepository implements Repository {
  readonly kind = "json" as const;
  private readonly file: string;
  private queue: Promise<unknown> = Promise.resolve();
  private readonly lock = new AsyncLocalStorage<boolean>();

  constructor(dir = process.env.SMELLBESS_DATA_DIR ?? path.join(process.cwd(), ".data")) {
    this.file = path.join(dir, "store.json");
  }

  private async read(): Promise<StoreFile> {
    try {
      return JSON.parse(await readFile(this.file, "utf8")) as StoreFile;
    } catch (err) {
      if ((err as NodeJS.ErrnoException).code !== "ENOENT") throw err;
      const state = initialState();
      await this.write(state);
      return state;
    }
  }

  private async write(state: StoreFile): Promise<void> {
    await mkdir(path.dirname(this.file), { recursive: true });
    const tmp = `${this.file}.${randomUUID()}.tmp`;
    await writeFile(tmp, JSON.stringify(state, null, 2), "utf8");
    await rename(tmp, this.file);
  }

  /** Serialise writes in this process. Calls nested inside one run inline. */
  private runExclusive<T>(fn: () => Promise<T>): Promise<T> {
    if (this.lock.getStore()) return fn();
    const run = () => this.lock.run(true, fn);
    const next = this.queue.then(run, run);
    this.queue = next.catch(() => undefined);
    return next;
  }

  private mutate<T>(fn: (state: StoreFile) => T): Promise<T> {
    return this.runExclusive(async () => {
      const state = await this.read();
      const result = fn(state);
      await this.write(state);
      return result;
    });
  }

  async listProducts() {
    return structuredClone(PRODUCTS);
  }

  async listSets() {
    return structuredClone(SETS);
  }

  async listBottles() {
    return (await this.read()).bottles;
  }

  upsertBottle(bottle: Bottle) {
    return this.mutate((s) => {
      s.bottles = [...s.bottles.filter((b) => b.id !== bottle.id), bottle];
    });
  }

  async listAreas() {
    return (await this.read()).areas;
  }

  deleteBottle(id: string) {
    return this.mutate((s) => {
      s.bottles = s.bottles.filter((b) => b.id !== id);
    });
  }

  upsertArea(area: Area) {
    return this.mutate((s) => {
      s.areas = [...s.areas.filter((a) => a.id !== area.id), area];
    });
  }

  async getSettings() {
    // Older store files predate some settings: fill them from the defaults.
    return { ...DEFAULT_SETTINGS, ...(await this.read()).settings };
  }

  updateSettings(patch: Partial<Settings>) {
    return this.mutate((s) => (s.settings = { ...DEFAULT_SETTINGS, ...s.settings, ...patch }));
  }

  async listOrders() {
    return (await this.read()).orders;
  }

  async getOrder(id: string) {
    return (await this.read()).orders.find((o) => o.id === id) ?? null;
  }

  // `source` isn't stored in the JSON file.
  placeOrder(input: NewOrder, demand: Record<string, number>): Promise<PlaceOrderResult> {
    return this.mutate((s): PlaceOrderResult => {
      const shortfalls = stockShortfalls(demand, availableMl(s.bottles, reservedMl(s.orders)));
      if (shortfalls.length > 0) return { ok: false, shortfalls };
      const order: Order = {
        ...input,
        id: randomUUID(),
        number: `SB-${s.nextOrderSeq}`,
        createdAt: new Date().toISOString(),
        status: "new",
      };
      s.nextOrderSeq += 1;
      s.orders.push(order);
      return { ok: true, order };
    });
  }

  transitionOrder(id: string, from: OrderStatus, to: OrderStatus, deductions: BottleDeduction[]) {
    return this.mutate((s) => {
      const order = s.orders.find((o) => o.id === id);
      if (!order || order.status !== from) return false;
      order.status = to;
      for (const d of deductions) {
        const bottle = s.bottles.find((b) => b.id === d.bottleId);
        if (!bottle) continue;
        if (d.sell) {
          if (bottle.sealed && !bottle.soldAt) bottle.soldAt = new Date().toISOString();
        } else {
          bottle.mlRemaining = Math.max(0, bottle.mlRemaining - d.ml);
        }
      }
      return true;
    });
  }

  // The JSON store works reservations out from the lines, so `reserved` isn't stored.
  updateOrderLines(id: string, lines: OrderLine[]) {
    return this.mutate((s) => {
      const order = s.orders.find((o) => o.id === id);
      if (!order) throw new Error(`Order ${id} not found`);
      order.lines = lines;
    });
  }
}
