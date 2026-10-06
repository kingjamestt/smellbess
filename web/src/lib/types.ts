/**
 * Domain types for Smell Bess.
 *
 * These shapes are shared by the JSON-file store (now) and the Supabase store
 * (later). Keep them plain and serialisable: they cross the server/client
 * boundary as props.
 */

export type Tier = "A" | "A+" | "D1" | "D2" | "N";

/** The only decant sizes we sell. No 2ml, no 30ml. */
export const SIZES = [5, 10, 15] as const;
export type SizeMl = (typeof SIZES)[number];

export type Gender = "him" | "her" | "unisex";
export type Occasion = "office" | "lime" | "fete" | "date";
export type Vibe =
  | "fresh"
  | "aquatic"
  | "sweet"
  | "gourmand"
  | "spicy"
  | "fruity"
  | "floral"
  | "woody"
  | "amber"
  | "oud"
  | "coffee";

/**
 * live: on the site and sellable when there's juice.
 * coming_soon: approved (Bess List) but not bought yet.
 * retired: hidden from the shop.
 */
export type ProductStatus = "live" | "coming_soon" | "retired";

export interface Ratings {
  /** How it holds up in TT heat, 1–5. */
  heat: number;
  longevity: number;
  projection: number;
  compliments: number;
}

export interface Take {
  by: "him" | "her";
  text: string;
}

export interface Product {
  /** Also the URL slug. */
  id: string;
  house: string;
  name: string;
  variant?: string;
  tier: Tier;
  gender: Gender;
  leans?: "him" | "her";
  status: ProductStatus;
  /** "Smells like" DNA, our opinion. Never implies it IS the original. */
  smellsLike: string[];
  /** Looser than smellsLike: same idea or DNA with its own twist. Our opinion too. */
  inspiredBy?: string[];
  notes: { top: string[]; heart: string[]; base: string[] };
  vibes: Vibe[];
  occasions: Occasion[];
  ratings?: Ratings;
  take?: Take;
  blurb: string;
  /** True while any rating/description is our DRAFT copy. */
  draft: boolean;
  /** Hue (0–360) for the placeholder artwork until real photos exist. */
  hue: number;
  /**
   * Sealed full bottle, sold whole while one is in stock (business-plan.md
   * §2.4a). Priced to the local market, not by tier. Without it, the scent is
   * decants only.
   */
  bottle?: { sizeMl: number; price: number };
  /** When it's best worn (our call, DRAFT). Drives the Daytime / Nighttime / Anytime and weather filters. */
  wear?: { time: WearTime; weather: Weather };
  /** Self-hosted product photo under /public, e.g. "/scents/hawas-ice.webp". Product only, never our branding. */
  image?: string;
}

export type WearTime = "day" | "night" | "any";
export type Weather = "warm" | "cold" | "any";

export interface Bottle {
  /** Physical bottle ID written on the bottle, e.g. "LB-01". */
  id: string;
  productId: string;
  sizeMl: number;
  mlRemaining: number;
  /** Landed or replacement cost in TTD. */
  costTtd: number;
  source: string;
  isTester?: boolean;
  openedAt?: string;
  /**
   * Kept sealed and sold whole, never decanted. Its ml don't count as decant
   * stock. `soldAt` is set when the order it went in is packed.
   */
  sealed?: boolean;
  soldAt?: string;
}

export interface CuratedSet {
  id: string;
  name: string;
  description: string;
  /** Three different scents. Tier A, unless the set has its own `price`. */
  productIds: [string, string, string];
  /**
   * Set price override, for a set that includes an A+ scent (Fete Pack:
   * TT$175 / TT$300). Without it the standard TT$150 / TT$280 applies.
   */
  price?: Record<5 | 10, number>;
  draft: boolean;
}

export type Zone = "urban" | "rural" | "extended" | "remote" | "tobago";

export interface Area {
  id: string;
  name: string;
  zone: Zone;
}

/**
 * `workplace` is for coworker orders that come in on WhatsApp. It's never
 * offered at the public checkout; admin sets it. There is no own-drop-off
 * option: when we deliver ourselves we charge the ODeliver rate.
 */
export type DeliveryMethod = "pickup" | "workplace" | "odeliver";
export type PaymentMethod = "bank_transfer" | "cash_on_pickup";

/** A Saturday pickup stop. Edited in admin (settings). */
export interface PickupPoint {
  id: string;
  name: string;
  /** Display time, e.g. "10:00am". */
  time: string;
}

export interface Settings {
  /** Atomizer stock flags. If 15 is off, 15ml ships as 10ml + 5ml. */
  atomizers: Record<SizeMl, boolean>;
  lowStockThreshold: number;
  /** The pickup run, e.g. "Saturday". */
  pickupDay: string;
  /** Pickup stops in route order. An empty list turns pickup off. */
  pickupPoints: PickupPoint[];
}

// ---------------------------------------------------------------- cart

export type CartLine =
  | { kind: "single"; productId: string; size: SizeMl; qty: number }
  | { kind: "set"; setId: string; size: 5 | 10; qty: number }
  /** A sealed full bottle. Never part of an offer. */
  | { kind: "bottle"; productId: string; qty: number };

export interface Cart {
  lines: CartLine[];
}

// ---------------------------------------------------------------- orders

export const ORDER_STATUSES = [
  "new",
  "paid",
  "decanted",
  "ready",
  "out_for_delivery",
  "done",
  "cancelled",
] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export type OfferId = "bundle_5x10" | "set" | "free_5ml";

export type OrderLine =
  | {
      kind: "single";
      productId: string;
      label: string;
      size: SizeMl;
      qty: number;
      unitPrice: number;
      shipsAsSplit: boolean;
    }
  | {
      kind: "set";
      setId: string;
      label: string;
      size: 5 | 10;
      qty: number;
      unitPrice: number;
      items: { productId: string; label: string }[];
    }
  | {
      /** A sealed full bottle, at the product's own price. */
      kind: "bottle";
      productId: string;
      label: string;
      sizeMl: number;
      qty: number;
      unitPrice: number;
    }
  | {
      /** The surprise free 5ml. We pick the scent when packing. */
      kind: "free";
      /** Empty until an admin picks the scent (a Tier A, often a slow seller). */
      productId?: string;
      label: string;
      size: 5;
      qty: 1;
      unitPrice: 0;
    };

export interface Order {
  /** Random, unguessable id used in the confirmation URL. */
  id: string;
  /** Human order number, e.g. "SB-1001". */
  number: string;
  createdAt: string;
  status: OrderStatus;
  customer: { name: string; phone: string; note?: string };
  lines: OrderLine[];
  offer: { id: OfferId; label: string; savings: number; explanation: string } | null;
  delivery: {
    method: DeliveryMethod;
    label: string;
    areaId?: string;
    areaName?: string;
    zone?: Zone;
    pickupPoint?: { id: string; name: string; time: string };
    fee: number;
  };
  payment: PaymentMethod;
  totals: { subtotal: number; discount: number; delivery: number; total: number };
  utm?: { source?: string; medium?: string; campaign?: string };
}

export type NewOrder = Omit<Order, "id" | "number" | "createdAt" | "status">;
