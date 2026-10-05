import { AsyncLocalStorage } from "node:async_hooks";
import { randomUUID } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { AREAS, DEFAULT_SETTINGS, DEMO_BOTTLES, PRODUCTS, SETS } from "@/data/seed";
import type { Area, Bottle, NewOrder, Order, OrderStatus, Settings } from "../types";
import type { Repository } from "./repository";

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
 * disk, which is why Supabase replaces this before launch (M2).
 */
export class JsonFileRepository implements Repository {
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
  runExclusive<T>(fn: () => Promise<T>): Promise<T> {
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

  upsertArea(area: Area) {
    return this.mutate((s) => {
      s.areas = [...s.areas.filter((a) => a.id !== area.id), area];
    });
  }

  async getSettings() {
    return (await this.read()).settings;
  }

  updateSettings(patch: Partial<Settings>) {
    return this.mutate((s) => (s.settings = { ...s.settings, ...patch }));
  }

  async listOrders() {
    return (await this.read()).orders;
  }

  async getOrder(id: string) {
    return (await this.read()).orders.find((o) => o.id === id) ?? null;
  }

  createOrder(input: NewOrder) {
    return this.mutate((s) => {
      const order: Order = {
        ...input,
        id: randomUUID(),
        number: `SB-${s.nextOrderSeq}`,
        createdAt: new Date().toISOString(),
        status: "new",
      };
      s.nextOrderSeq += 1;
      s.orders.push(order);
      return order;
    });
  }

  updateOrderStatus(id: string, status: OrderStatus) {
    return this.mutate((s) => {
      const order = s.orders.find((o) => o.id === id);
      if (!order) throw new Error(`Order ${id} not found`);
      order.status = status;
      return order;
    });
  }
}
