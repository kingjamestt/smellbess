import { describe, expect, it } from "vitest";
import { SITE } from "@/config/site";
import { AREAS, DEMO_BOTTLES, PRODUCTS, SETS } from "./seed";

const byId = new Map(PRODUCTS.map((p) => [p.id, p]));

describe("seed catalog (from scent-lists.md)", () => {
  it("has the 23 approved Bess List scents with unique ids", () => {
    expect(PRODUCTS).toHaveLength(23);
    expect(byId.size).toBe(23);
  });

  it("launches with the 11 bought scents plus 2 from the owner's shelf", () => {
    const live = PRODUCTS.filter((p) => p.status === "live").map((p) => p.name);
    expect(live.sort()).toEqual(
      [
        "Liquid Brun",
        "Hawas Ice",
        "Hawas Diva",
        "Angham",
        "Khamrah",
        "Khamrah Qahwa",
        "Yara",
        "Aquatica",
        "Elixir",
        "Supremacy Collector's Edition",
        "Asad Bourbon",
        "Amber Oud Gold Edition",
        "Marwa",
      ].sort(),
    );
  });

  it("Arabians only at launch: 2 A+ (Supremacy, Amber Oud Gold), the other 11 Tier A", () => {
    const live = PRODUCTS.filter((p) => p.status === "live");
    expect(live.filter((p) => p.tier === "A+").map((p) => p.id).sort()).toEqual([
      "amber-oud-gold",
      "supremacy-collectors-edition",
    ]);
    expect(live.filter((p) => p.tier === "A")).toHaveLength(11);
    expect(live.every((p) => p.tier === "A" || p.tier === "A+")).toBe(true);
  });

  it("the rest of the Bess List is coming soon", () => {
    expect(PRODUCTS.filter((p) => p.status === "coming_soon")).toHaveLength(10);
  });

  it("every product is marked DRAFT until rewritten; the set copy is the owner's", () => {
    expect(PRODUCTS.every((p) => p.draft)).toBe(true);
    expect(SETS.every((s) => !s.draft)).toBe(true);
  });

  it("ratings stay on a 1–5 scale", () => {
    const values = PRODUCTS.flatMap((p) => Object.values(p.ratings ?? {}));
    expect(values.length).toBeGreaterThan(0);
    expect(values.every((v) => Number.isInteger(v) && v >= 1 && v <= 5)).toBe(true);
  });

  it("the four launch sets", () => {
    expect(SETS.map((s) => s.name)).toEqual(["Fete Pack", "Date Night", "Office/School Days", "For Her"]);
  });

  it("curated sets hold three different live scents; any non-Tier-A scent needs a set price", () => {
    for (const s of SETS) {
      expect(new Set(s.productIds).size).toBe(3);
      for (const id of s.productIds) expect(byId.get(id)?.status).toBe("live");
      const allTierA = s.productIds.every((id) => byId.get(id)?.tier === "A");
      if (!allTierA) expect(s.price).toBeDefined();
    }
  });

  it("the Fete Pack is TT$175 / TT$300 because it has an A+ scent", () => {
    expect(SETS.find((s) => s.id === "fete-pack")?.price).toEqual({ 5: 175, 10: 300 });
  });

  it("demo bottles only belong to live scents", () => {
    for (const b of DEMO_BOTTLES) expect(byId.get(b.productId)?.status).toBe("live");
  });

  it("areas are unique, and Tobago is on the list", () => {
    expect(new Set(AREAS.map((a) => a.id)).size).toBe(AREAS.length);
    expect(AREAS.find((a) => a.zone === "tobago")).toBeDefined();
  });

  it("three Saturday pickup stops", () => {
    expect(SITE.pickupPoints.map((p) => p.time)).toEqual(["10:00am", "1:00pm", "5:00pm"]);
  });
});
