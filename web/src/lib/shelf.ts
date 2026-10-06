import type { ProductView } from "./catalog";
import { OFFER_RULES } from "./offers";
import { priceFor } from "./pricing";
import type { Gender, WearTime, Weather } from "./types";

/**
 * How the shop sorts and filters scents: when you'd wear it (Daytime,
 * Nighttime, Anytime), the weather, who's wearing it, and which deal a scent
 * counts toward. Shared by the homepage shelf and the scents page.
 */

/** `short` is the filter-chip label; `label` is for headings and sentences. */
export const WEAR_TIMES: { id: WearTime; label: string; short: string }[] = [
  { id: "day", label: "Daytime", short: "Day" },
  { id: "night", label: "Nighttime", short: "Night" },
  { id: "any", label: "Anytime", short: "Anytime" },
];
export const WEATHERS: { id: Exclude<Weather, "any">; label: string; short: string }[] = [
  { id: "warm", label: "Warm weather", short: "Warm weather" },
  { id: "cold", label: "Cold weather", short: "Cold weather" },
];

/** Deals a scent can count toward, as linked from the offers bar. */
export type DealFilter = "bundle" | "free-5ml";
export const DEALS: Record<DealFilter, { label: string; short: string }> = {
  bundle: { label: `${OFFER_RULES.bundle.count} Arabian 10ml for TT$${OFFER_RULES.bundle.price}`, short: "Counts toward 5×10ml" },
  "free-5ml": { label: "A free 5ml with 3 decants of 10ml or more", short: "Counts toward the free 5ml" },
};

export interface ShelfFilter {
  time?: WearTime;
  weather?: Exclude<Weather, "any">;
  gender?: Gender;
  deal?: DealFilter;
  query?: string;
}

/** A scent counts toward a deal while it's live and has a 10ml to sell. */
export function countsToward(p: ProductView, deal: DealFilter): boolean {
  if (p.status !== "live" || !p.sizes.some((s) => s.size === 10 && s.available)) return false;
  return deal === "bundle" ? p.tier === OFFER_RULES.bundle.tier : true;
}

export function matchesShelf(p: ProductView, f: ShelfFilter): boolean {
  if (f.time && p.wear?.time !== f.time) return false;
  // "Any weather" scents suit both, so they stay in either weather filter.
  if (f.weather && p.wear && p.wear.weather !== f.weather && p.wear.weather !== "any") return false;
  if (f.weather && !p.wear) return false;
  // Unisex scents belong to everyone, so they show under Him and Her too.
  if (f.gender && p.gender !== f.gender && !(p.gender === "unisex" && f.gender !== "unisex")) return false;
  if (f.deal && !countsToward(p, f.deal)) return false;
  const q = f.query?.trim().toLowerCase();
  if (q) {
    const hay = [p.house, p.name, p.variant, p.blurb, ...p.smellsLike, ...p.notes.top, ...p.notes.heart, ...p.notes.base, ...p.vibes]
      .join(" ")
      .toLowerCase();
    // Every word must match somewhere, so "sweet vanilla" finds a sweet scent with vanilla in it.
    if (!q.split(/\s+/).every((w) => hay.includes(w))) return false;
  }
  return true;
}

/** Live scents grouped Daytime → Nighttime → Anytime; scents without a wear time go last. Empty groups dropped. */
export function groupByTime(products: readonly ProductView[]): { time: WearTime | "other"; label: string; items: ProductView[] }[] {
  const groups = WEAR_TIMES.map((t) => ({ time: t.id as WearTime | "other", label: t.label, items: products.filter((p) => p.wear?.time === t.id) }));
  groups.push({ time: "other", label: "More", items: products.filter((p) => !p.wear) });
  return groups.filter((g) => g.items.length > 0);
}

/** Which part of the day it is in Trinidad (UTC−4): 6am–6pm is daytime. */
export function timeOfDayTT(now = new Date()): Exclude<WearTime, "any"> {
  const hour = (now.getUTCHours() + 24 - 4) % 24;
  return hour >= 6 && hour < 18 ? "day" : "night";
}

/** "TT$60 / 100 / 150": the three decant prices, compact. */
export function decantPrices(p: Pick<ProductView, "tier">): string {
  return `TT$${priceFor(p.tier, 5)} / ${priceFor(p.tier, 10)} / ${priceFor(p.tier, 15)}`;
}

/** Read filters from the scents page URL (?time=day&weather=warm&gender=him&deal=bundle&q=...). */
export function filterFromParams(params: Record<string, string | string[] | undefined>): ShelfFilter {
  const one = (k: string) => (typeof params[k] === "string" ? (params[k] as string) : undefined);
  const pick = <T extends string>(v: string | undefined, ok: readonly T[]) => (ok.includes(v as T) ? (v as T) : undefined);
  return {
    time: pick(one("time"), ["day", "night", "any"] as const),
    weather: pick(one("weather"), ["warm", "cold"] as const),
    gender: pick(one("gender"), ["him", "her", "unisex"] as const),
    deal: pick(one("deal"), ["bundle", "free-5ml"] as const),
    query: one("q")?.slice(0, 80),
  };
}

const GENDER_LABELS: Record<Gender, string> = { him: "For him", her: "For her", unisex: "Unisex" };
const GENDER_SHORT: Record<Gender, string> = { him: "Him", her: "Her", unisex: "Unisex" };

/** Short tag for cards and rows: "Him", "Her", "Unisex". */
export function genderShort(p: Pick<ProductView, "gender">): string {
  return GENDER_SHORT[p.gender];
}

export function genderLabel(p: Pick<ProductView, "gender" | "leans">): string {
  if (p.gender === "unisex" && p.leans) return `Unisex, leans ${p.leans === "her" ? "feminine" : "masculine"}`;
  return GENDER_LABELS[p.gender];
}

/** "Daytime, warm weather", "Anytime", or null when we haven't said. */
export function wearLabel(p: Pick<ProductView, "wear">): string | null {
  if (!p.wear) return null;
  const time = WEAR_TIMES.find((t) => t.id === p.wear!.time)!.label;
  const weather = WEATHERS.find((w) => w.id === p.wear!.weather)?.label.toLowerCase();
  return weather ? `${time}, ${weather}` : time;
}
