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

/** Where an order came from: the public checkout, or typed in by an admin. */
export type OrderSource = "web" | "admin";

export interface Shortfall {
  productId: string;
  neededMl: number;
  availableMl: number;
}

export type PlaceOrderResult = { ok: true; order: Order } | { ok: false; shortfalls: Shortfall[] };

/** Juice taken out of one bottle when an order is decanted. */
export interface BottleDeduction {
  bottleId: string;
  ml: number;
}

/**
 * The one interface the app talks to for data. Pages, server actions and
 * admin code call these methods and never touch files or SQL directly.
 *
 * Implementations:
 * - JsonFileRepository: seed catalog + a JSON file. Local dev, no cloud.
 * - SupabaseRepository: Postgres. Chosen when the Supabase env vars are set.
 *
 * Stock rule (both): available ml = Σ bottle ml − ml reserved by orders that
 * are new or paid. `placeOrder` checks and saves in one atomic step.
 */
export interface Repository {
  readonly kind: "json" | "supabase";

  // Catalog
  listProducts(): Promise<Product[]>;
  listSets(): Promise<CuratedSet[]>;

  // Stock
  listBottles(): Promise<Bottle[]>;
  upsertBottle(bottle: Bottle): Promise<void>;
  deleteBottle(id: string): Promise<void>;

  // Delivery
  listAreas(): Promise<Area[]>;
  upsertArea(area: Area): Promise<void>;

  // Settings (atomizer flags, low-stock threshold, pickup run)
  getSettings(): Promise<Settings>;
  updateSettings(patch: Partial<Settings>): Promise<Settings>;

  // Orders
  listOrders(): Promise<Order[]>;
  getOrder(id: string): Promise<Order | null>;
  /**
   * Atomically: check there's still `demand` ml of each product, then save the
   * order with an id, the next order number and status "new". `demand` is
   * stored as the order's reservation.
   */
  placeOrder(order: NewOrder, demand: Record<string, number>, source: OrderSource): Promise<PlaceOrderResult>;
  /**
   * Move an order from `from` to `to` only if it's still at `from`, and take
   * `deductions` out of the bottles in the same step. False if someone else
   * moved it first.
   */
  transitionOrder(id: string, from: OrderStatus, to: OrderStatus, deductions: BottleDeduction[]): Promise<boolean>;
  /** Replace an order's lines (e.g. picking the free 5ml) and its reservation. */
  updateOrderLines(id: string, lines: OrderLine[], reserved: Record<string, number>): Promise<void>;
}
