import { describe, expect, it } from "vitest";
import type { ProductView } from "./catalog";
import { countsToward, filterFromParams, groupByTime, matchesShelf, timeOfDayTT, wearLabel } from "./shelf";

const view = (id: string, over: Partial<ProductView> = {}): ProductView => ({
  id,
  house: "House",
  name: id,
  tier: "A",
  gender: "him",
  status: "live",
  smellsLike: [],
  notes: { top: [], heart: [], base: [] },
  vibes: [],
  occasions: [],
  blurb: "",
  draft: true,
  hue: 0,
  stock: "in_stock",
  sizes: [5, 10, 15].map((size) => ({ size: size as 5 | 10 | 15, available: true, unitsLeft: 9, lowStock: false, shipsAsSplit: false, badge: null })),
  sealed: null,
  ...over,
});

const ice = view("ice", { wear: { time: "day", weather: "warm" } });
const brun = view("brun", { wear: { time: "night", weather: "cold" } });
const angham = view("angham", { wear: { time: "any", weather: "any" }, gender: "unisex" });
const musamam = view("musamam", { tier: "A+", wear: { time: "night", weather: "cold" } });

describe("shelf filters", () => {
  it("filters by time of day", () => {
    expect([ice, brun, angham].filter((p) => matchesShelf(p, { time: "night" })).map((p) => p.id)).toEqual(["brun"]);
  });

  it("an any-weather scent stays in both weather filters", () => {
    expect([ice, brun, angham].filter((p) => matchesShelf(p, { weather: "warm" })).map((p) => p.id)).toEqual(["ice", "angham"]);
    expect([ice, brun, angham].filter((p) => matchesShelf(p, { weather: "cold" })).map((p) => p.id)).toEqual(["brun", "angham"]);
  });

  it("a unisex scent shows under Him and Her; Unisex shows only unisex", () => {
    const diva = view("diva", { gender: "her" });
    const all = [ice, angham, diva];
    expect(all.filter((p) => matchesShelf(p, { gender: "him" })).map((p) => p.id)).toEqual(["ice", "angham"]);
    expect(all.filter((p) => matchesShelf(p, { gender: "her" })).map((p) => p.id)).toEqual(["angham", "diva"]);
    expect(all.filter((p) => matchesShelf(p, { gender: "unisex" })).map((p) => p.id)).toEqual(["angham"]);
  });

  it("the 5×10ml deal counts Tier A only; the free 5ml counts every live scent with a 10ml", () => {
    expect(countsToward(musamam, "bundle")).toBe(false);
    expect(countsToward(musamam, "free-5ml")).toBe(true);
    expect(countsToward(ice, "bundle")).toBe(true);
    const noTen = view("x", { sizes: ice.sizes.map((s) => (s.size === 10 ? { ...s, available: false } : s)) });
    expect(countsToward(noTen, "free-5ml")).toBe(false);
  });

  it("searches names and notes", () => {
    expect(matchesShelf(view("Hawas Ice"), { query: "hawas" })).toBe(true);
    expect(matchesShelf(view("Hawas Ice"), { query: "vanilla" })).toBe(false);
    const nebras = view("Pride Nebras", { notes: { top: ["red berries"], heart: ["vanilla", "cacao"], base: ["musk"] }, blurb: "A sweet gourmand." });
    expect(matchesShelf(nebras, { query: "Vanilla" })).toBe(true);
    expect(matchesShelf(nebras, { query: "sweet cacao" })).toBe(true);
    expect(matchesShelf(nebras, { query: "sweet coffee" })).toBe(false);
  });

  it("finds every launch scent with vanilla in its Fragrantica notes", async () => {
    const { PRODUCTS } = await import("@/data/seed");
    const hits = PRODUCTS.filter((p) => p.status === "live" && matchesShelf({ ...view(p.id), ...p } as ProductView, { query: "vanilla" }));
    expect(hits.map((p) => p.id)).toContain("pride-nebras");
  });

  it("groups Daytime, Nighttime, Anytime, dropping empty groups", () => {
    expect(groupByTime([brun, ice, musamam]).map((g) => [g.label, g.items.map((p) => p.id)])).toEqual([
      ["Daytime", ["ice"]],
      ["Nighttime", ["brun", "musamam"]],
    ]);
  });

  it("reads filters from the URL and ignores junk", () => {
    expect(filterFromParams({ deal: "bundle", time: "day", weather: "hot", gender: "her" })).toEqual({
      deal: "bundle",
      time: "day",
      weather: undefined,
      gender: "her",
      query: undefined,
    });
  });

  it("knows daytime and nighttime in Trinidad (UTC−4)", () => {
    expect(timeOfDayTT(new Date("2026-11-07T14:00:00Z"))).toBe("day"); // 10am
    expect(timeOfDayTT(new Date("2026-11-08T01:00:00Z"))).toBe("night"); // 9pm
  });

  it("labels wear in words", () => {
    expect(wearLabel(ice)).toBe("Daytime, warm weather");
    expect(wearLabel(angham)).toBe("Anytime");
  });
});
