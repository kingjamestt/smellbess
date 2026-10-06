import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type {
  Area,
  Bottle,
  CuratedSet,
  NewOrder,
  Order,
  OrderLine,
  OrderStatus,
  Product,
  Settings,
} from "../types";
import type { BottleDeduction, OrderSource, PlaceOrderResult, Repository, Shortfall } from "./repository";

interface BottleRow {
  id: string;
  product_id: string;
  size_ml: number;
  ml_remaining: number | string;
  cost_ttd: number | string;
  source: string;
  is_tester: boolean;
  opened_at: string | null;
  sealed: boolean;
  sold_at: string | null;
}

interface OrderRow {
  id: string;
  number: string;
  created_at: string;
  status: OrderStatus;
  customer: Order["customer"];
  lines: Order["lines"];
  offer: Order["offer"];
  delivery: Order["delivery"];
  payment: Order["payment"];
  totals: Order["totals"];
  utm: Order["utm"] | null;
}

const ORDER_COLUMNS = "id, number, created_at, status, customer, lines, offer, delivery, payment, totals, utm";

const toBottle = (r: BottleRow): Bottle => ({
  id: r.id,
  productId: r.product_id,
  sizeMl: r.size_ml,
  mlRemaining: Number(r.ml_remaining),
  costTtd: Number(r.cost_ttd),
  source: r.source,
  isTester: r.is_tester || undefined,
  openedAt: r.opened_at ?? undefined,
  sealed: r.sealed || undefined,
  soldAt: r.sold_at ?? undefined,
});

const toOrder = (r: OrderRow): Order => ({
  id: r.id,
  number: r.number,
  createdAt: r.created_at,
  status: r.status,
  customer: r.customer,
  lines: r.lines,
  offer: r.offer ?? null,
  delivery: r.delivery,
  payment: r.payment,
  totals: r.totals,
  utm: r.utm ?? undefined,
});

function check<T>(res: { data: T; error: { message: string } | null }, what: string): T {
  if (res.error) throw new Error(`Supabase ${what}: ${res.error.message}`);
  return res.data;
}

/**
 * Postgres via Supabase. Uses the SECRET key, so it must only ever run on the
 * server: RLS blocks the publishable key from every table.
 */
export class SupabaseRepository implements Repository {
  readonly kind = "supabase" as const;
  private readonly db: SupabaseClient;

  constructor(url: string, secretKey: string) {
    this.db = createClient(url, secretKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }

  async listProducts(): Promise<Product[]> {
    const rows = check(await this.db.from("products").select("id, data").order("sort"), "products") ?? [];
    return rows.map((r) => ({ ...(r.data as Omit<Product, "id">), id: r.id }));
  }

  async listSets(): Promise<CuratedSet[]> {
    const rows = check(await this.db.from("sets").select("id, data").order("sort"), "sets") ?? [];
    return rows.map((r) => ({ ...(r.data as Omit<CuratedSet, "id">), id: r.id }));
  }

  async listBottles(): Promise<Bottle[]> {
    const rows = check(await this.db.from("bottles").select("*").order("id"), "bottles");
    return (rows as BottleRow[]).map(toBottle);
  }

  async upsertBottle(b: Bottle): Promise<void> {
    check(
      await this.db.from("bottles").upsert({
        id: b.id,
        product_id: b.productId,
        size_ml: b.sizeMl,
        ml_remaining: b.mlRemaining,
        cost_ttd: b.costTtd,
        source: b.source,
        is_tester: b.isTester ?? false,
        opened_at: b.openedAt ?? null,
        sealed: b.sealed ?? false,
        sold_at: b.soldAt ?? null,
        updated_at: new Date().toISOString(),
      }),
      "upsert bottle",
    );
  }

  async deleteBottle(id: string): Promise<void> {
    check(await this.db.from("bottles").delete().eq("id", id), "delete bottle");
  }

  async listAreas(): Promise<Area[]> {
    const rows = check(await this.db.from("areas").select("id, name, zone").order("sort").order("name"), "areas");
    return rows as Area[];
  }

  async upsertArea(area: Area): Promise<void> {
    check(await this.db.from("areas").upsert({ id: area.id, name: area.name, zone: area.zone }), "upsert area");
  }

  async getSettings(): Promise<Settings> {
    const row = check(await this.db.from("settings").select("*").eq("id", 1).single(), "settings");
    return {
      atomizers: row.atomizers,
      lowStockThreshold: row.low_stock_threshold,
      pickupDay: row.pickup_day,
      pickupPoints: row.pickup_points,
    };
  }

  async updateSettings(patch: Partial<Settings>): Promise<Settings> {
    const update: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (patch.atomizers) update.atomizers = patch.atomizers;
    if (patch.lowStockThreshold !== undefined) update.low_stock_threshold = patch.lowStockThreshold;
    if (patch.pickupDay !== undefined) update.pickup_day = patch.pickupDay;
    if (patch.pickupPoints) update.pickup_points = patch.pickupPoints;
    check(await this.db.from("settings").update(update).eq("id", 1), "update settings");
    return this.getSettings();
  }

  async listOrders(): Promise<Order[]> {
    const rows = check(
      await this.db.from("orders").select(ORDER_COLUMNS).order("created_at", { ascending: false }),
      "orders",
    );
    return (rows as OrderRow[]).map(toOrder);
  }

  async getOrder(id: string): Promise<Order | null> {
    // Order ids are UUIDs; anything else can't match (and would error in Postgres).
    if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
    const row = check(await this.db.from("orders").select(ORDER_COLUMNS).eq("id", id).maybeSingle(), "order");
    return row ? toOrder(row as OrderRow) : null;
  }

  async placeOrder(order: NewOrder, demand: Record<string, number>, source: OrderSource): Promise<PlaceOrderResult> {
    const result = check(
      await this.db.rpc("place_order", { p_order: { ...order, source }, p_demand: demand }),
      "place_order",
    ) as { ok: true; id: string } | { ok: false; shortfalls: Shortfall[] };
    if (!result.ok) {
      return {
        ok: false,
        shortfalls: result.shortfalls.map((s) => ({
          productId: s.productId,
          neededMl: Number(s.neededMl),
          availableMl: Number(s.availableMl),
        })),
      };
    }
    const saved = await this.getOrder(result.id);
    if (!saved) throw new Error("Order saved but couldn't be read back");
    return { ok: true, order: saved };
  }

  async transitionOrder(
    id: string,
    from: OrderStatus,
    to: OrderStatus,
    deductions: BottleDeduction[],
  ): Promise<boolean> {
    return check(
      await this.db.rpc("transition_order", { p_id: id, p_from: from, p_to: to, p_deductions: deductions }),
      "transition_order",
    ) as boolean;
  }

  async updateOrderLines(id: string, lines: OrderLine[], reserved: Record<string, number>): Promise<void> {
    check(
      await this.db
        .from("orders")
        .update({ lines, reserved, updated_at: new Date().toISOString() })
        .eq("id", id),
      "update order lines",
    );
  }
}
