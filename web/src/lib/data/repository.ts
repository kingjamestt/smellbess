import type {
  Area,
  Bottle,
  CuratedSet,
  NewOrder,
  Order,
  OrderStatus,
  Product,
  Settings,
} from "../types";

/**
 * The one interface the app talks to for data. Pages, server actions and
 * admin code call these methods and never touch files or SQL directly.
 *
 * Implementations:
 * - JsonFileRepository (now): seed catalog + a JSON file for mutable state.
 *   Runs locally with no cloud services.
 * - SupabaseRepository (M2): Postgres tables mirroring src/lib/types.ts, auth
 *   for the 2 admins, storage for photos. `runExclusive` becomes a Postgres
 *   function/transaction so two orders can't claim the same last 10ml.
 */
export interface Repository {
  // Catalog
  listProducts(): Promise<Product[]>;
  listSets(): Promise<CuratedSet[]>;

  // Stock
  listBottles(): Promise<Bottle[]>;
  upsertBottle(bottle: Bottle): Promise<void>;

  // Delivery
  listAreas(): Promise<Area[]>;
  upsertArea(area: Area): Promise<void>;

  // Settings (atomizer flags, low-stock threshold)
  getSettings(): Promise<Settings>;
  updateSettings(patch: Partial<Settings>): Promise<Settings>;

  // Orders
  listOrders(): Promise<Order[]>;
  getOrder(id: string): Promise<Order | null>;
  /** Saves the order and gives it an id, an order number and status "new". */
  createOrder(order: NewOrder): Promise<Order>;
  updateOrderStatus(id: string, status: OrderStatus): Promise<Order>;

  /** Run `fn` with no other write in between (read stock → check → save order). */
  runExclusive<T>(fn: () => Promise<T>): Promise<T>;
}
