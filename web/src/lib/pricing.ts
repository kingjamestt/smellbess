import type { SizeMl, Tier } from "./types";

/**
 * Decant prices in TTD, by tier and size. Source: CLAUDE.md (locked decisions)
 * and business-plan.md §2.3. Products never carry their own decant price.
 */
export const TIER_PRICES: Readonly<Record<Tier, Readonly<Record<SizeMl, number>>>> = {
  A: { 5: 60, 10: 100, 15: 150 },
  "A+": { 5: 70, 10: 120, 15: 175 },
  D1: { 5: 75, 10: 125, 15: 185 },
  D2: { 5: 120, 10: 200, 15: 275 },
  N: { 5: 100, 10: 180, 15: 250 },
};

export const TIER_LABELS: Readonly<Record<Tier, string>> = {
  A: "Arabian",
  "A+": "Premium Arabian",
  D1: "Designer",
  D2: "Premium designer",
  N: "Niche",
};

export function priceFor(tier: Tier, size: SizeMl): number {
  return TIER_PRICES[tier][size];
}

/** "TT$1,250". Deterministic (no locale lookup) so server and client match. */
export function formatTtd(amount: number): string {
  const sign = amount < 0 ? "-" : "";
  const digits = Math.round(Math.abs(amount))
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${sign}TT$${digits}`;
}
