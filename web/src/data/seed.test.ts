import { describe, expect, it } from "vitest";
import { AREAS, DEFAULT_SETTINGS, DEMO_BOTTLES, OWNER_SHELF_BOTTLES, PRODUCTS, SETS } from "./seed";

const byId = new Map(PRODUCTS.map((p) => [p.id, p]));

describe("seed catalog (from scent-lists.md)", () => {
  it("has the 23 approved Bess List scents, plus the dropped Elixir as retired", () => {
    expect(PRODUCTS).toHaveLength(24);
    expect(byId.size).toBe(24);
    expect(PRODUCTS.filter((p) => p.status === "retired").map((p) => p.id)).toEqual(["rayhaan-elixir"]);
  });

  it("launches with the 7 bought scents plus 2 from the owner's shelf", () => {
    const live = PRODUCTS.filter((p) => p.status === "live").map((p) => p.name);
    expect(live.sort()).toEqual(
      [
        "Liquid Brun",
        "Hawas Ice",
        "Hawas Diva",
        "Angham",
        "Pride Nebras",
        "Musamam Black Intense",
        "Aquatica",
        "Amber Oud Gold Edition",
        "Marwa",
      ].sort(),
    );
  });

  it("Arabians only at launch: 2 A+ (Musamam, Amber Oud Gold), the other 7 Tier A", () => {
    const live = PRODUCTS.filter((p) => p.status === "live");
    expect(live.filter((p) => p.tier === "A+").map((p) => p.id).sort()).toEqual([
      "amber-oud-gold",
      "musamam-black-intense",
    ]);
    expect(live.filter((p) => p.tier === "A")).toHaveLength(7);
  });

  it("the 7 bought scents have a sealed bottle at the market price; shelf scents are decants only", () => {
    const prices = Object.fromEntries(PRODUCTS.filter((p) => p.bottle).map((p) => [p.id, p.bottle!.price]));
    expect(prices).toEqual({
      "liquid-brun": 499,
      "hawas-ice": 499,
      "hawas-diva": 450,
      angham: 475,
      "pride-nebras": 425,
      "musamam-black-intense": 599,
      "rayhaan-aquatica": 450,
    });
    expect(byId.get("amber-oud-gold")?.bottle).toBeUndefined();
    expect(byId.get("marwa")?.bottle).toBeUndefined();
  });

  it("the next order (Khamrah, Qahwa, Yara, Supremacy, Asad Bourbon) is coming soon", () => {
    for (const id of ["khamrah", "khamrah-qahwa", "yara", "supremacy-collectors-edition", "asad-bourbon"]) {
      expect(byId.get(id)?.status).toBe("coming_soon");
    }
    expect(PRODUCTS.filter((p) => p.status === "coming_soon")).toHaveLength(14);
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
    expect(SETS.map((s) => s.name)).toEqual(["Fete Pack", "For Her", "Date Night", "Office/School Days"]);
  });

  it("curated sets hold three different live scents; any non-Tier-A scent needs a set price", () => {
    for (const s of SETS) {
      expect(new Set(s.productIds).size).toBe(3);
      for (const id of s.productIds) expect(byId.get(id)?.status).toBe("live");
      const allTierA = s.productIds.every((id) => byId.get(id)?.tier === "A");
      if (!allTierA) expect(s.price).toBeDefined();
    }
  });

  it("the Fete Pack and Date Night are TT$175 / TT$300 because each has an A+ scent", () => {
    expect(SETS.find((s) => s.id === "fete-pack")?.price).toEqual({ 5: 175, 10: 300 });
    expect(SETS.find((s) => s.id === "date-night")?.price).toEqual({ 5: 175, 10: 300 });
  });

  it("the owner's shelf bottles are real: Amber Oud Gold 50ml, Marwa 80ml", () => {
    expect(OWNER_SHELF_BOTTLES.map((b) => [b.productId, b.mlRemaining])).toEqual([
      ["amber-oud-gold", 50],
      ["marwa", 80],
    ]);
  });

  it("demo bottles only belong to live scents, and sealed ones to scents with a bottle price", () => {
    for (const b of DEMO_BOTTLES) {
      expect(byId.get(b.productId)?.status).toBe("live");
      if (b.sealed) expect(byId.get(b.productId)?.bottle).toBeDefined();
    }
  });

  it("areas are unique, and Tobago is on the list", () => {
    expect(new Set(AREAS.map((a) => a.id)).size).toBe(AREAS.length);
    expect(AREAS.find((a) => a.zone === "tobago")).toBeDefined();
  });

  it("three Saturday pickup stops", () => {
    expect(DEFAULT_SETTINGS.pickupPoints.map((p) => p.time)).toEqual(["10:00am", "1:00pm", "5:00pm"]);
  });
});
