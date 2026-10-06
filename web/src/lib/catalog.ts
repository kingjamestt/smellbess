import type { DeliveryConfig } from "./delivery";
import {
  availableMl,
  bottleKey,
  reservedMl,
  sizeAvailability,
  stockState,
  type SizeAvailability,
  type StockState,
} from "./stock";
import type { Bottle, CuratedSet, Order, Product, Settings } from "./types";

/** A product as the shop shows it: catalog fields + live stock. No costs. */
export interface ProductView extends Product {
  stock: StockState;
  sizes: SizeAvailability[];
  /** The sealed full bottle, while one is for sale. Null = decants only. */
  sealed: { sizeMl: number; price: number; left: number } | null;
}

export interface SetView extends CuratedSet {
  /** A set size is available while all three scents have that much juice. */
  sizes: Record<5 | 10, boolean>;
}

/** Everything the storefront needs, safe to send to the browser. */
export interface CatalogSnapshot {
  products: ProductView[];
  sets: SetView[];
  /** Usable ml per product, net of open orders. */
  available: Record<string, number>;
  settings: Pick<Settings, "atomizers" | "lowStockThreshold">;
  delivery: DeliveryConfig;
}

export function buildCatalogSnapshot(input: {
  products: Product[];
  sets: CuratedSet[];
  bottles: Bottle[];
  orders: Order[];
  settings: Settings;
  delivery: DeliveryConfig;
}): CatalogSnapshot {
  const available = availableMl(input.bottles, reservedMl(input.orders));
  const products = input.products
    .filter((p) => p.status !== "retired")
    .map((p) => {
      const live = p.status === "live";
      const ml = live ? (available[p.id] ?? 0) : 0;
      const sealedLeft = live && p.bottle ? (available[bottleKey(p.id)] ?? 0) : 0;
      return {
        ...p,
        stock: stockState(p, input.bottles, ml, sealedLeft),
        sizes: sizeAvailability(ml, input.settings),
        sealed: p.bottle && sealedLeft > 0 ? { ...p.bottle, left: sealedLeft } : null,
      };
    });
  const sets = input.sets.map((s) => ({
    ...s,
    sizes: {
      5: s.productIds.every((id) => (available[id] ?? 0) >= 5),
      10: s.productIds.every((id) => (available[id] ?? 0) >= 10),
    },
  }));
  return {
    products,
    sets,
    available,
    settings: {
      atomizers: input.settings.atomizers,
      lowStockThreshold: input.settings.lowStockThreshold,
    },
    delivery: input.delivery,
  };
}
