import { describe, expect, it } from "vitest";
import { SITE } from "@/config/site";
import { AREAS, DEMO_BOTTLES, PRODUCTS, SETS } from "./seed";

const byId = new Map(PRODUCTS.map((p) => [p.id, p]));

describe("seed catalog (from scent-lists.md)", () => {
  it("has the 23 approved Bess List scents with unique ids", () => {
    expect(PRODUCTS).toHaveLength(23);
    expect(byId.size).toBe(23);
  });

  it("launches with exactly the 10 locked scents", () => {
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
      ].sort(),
    );
  });

  it("Supremacy CE is the only A+ at launch; the other nine are Tier A", () => {
    const live = PRODUCTS.filter((p) => p.status === "live");
    expect(live.filter((p) => p.tier === "A+").map((p) => p.id)).toEqual(["supremacy-collectors-edition"]);
    expect(live.filter((p) => p.tier === "A")).toHaveLength(9);
  });

  it("the rest of the Bess List is coming soon", () => {
    expect(PRODUCTS.filter((p) => p.status === "coming_soon")).toHaveLength(13);
  });

  it("every product is marked DRAFT until rewritten", () => {
    expect(PRODUCTS.every((p) => p.draft)).toBe(true);
    expect(SETS.every((s) => s.draft)).toBe(true);
  });

  it("ratings stay on a 1–5 scale", () => {
    const values = PRODUCTS.flatMap((p) => Object.values(p.ratings ?? {}));
    expect(values.length).toBeGreaterThan(0);
    expect(values.every((v) => Number.isInteger(v) && v >= 1 && v <= 5)).toBe(true);
  });

  it("curated sets hold three different live Tier A scents", () => {
    for (const s of SETS) {
      expect(new Set(s.productIds).size).toBe(3);
      for (const id of s.productIds) {
        expect(byId.get(id)).toMatchObject({ status: "live", tier: "A" });
      }
    }
  });

  it("demo bottles only belong to live scents", () => {
    for (const b of DEMO_BOTTLES) expect(byId.get(b.productId)?.status).toBe("live");
  });

  it("areas are unique and own drop-off areas exist", () => {
    expect(new Set(AREAS.map((a) => a.id)).size).toBe(AREAS.length);
    for (const id of SITE.ownDropoffAreaIds) expect(AREAS.some((a) => a.id === id)).toBe(true);
  });

  it("three Saturday pickup stops", () => {
    expect(SITE.pickupPoints.map((p) => p.time)).toEqual(["10:00am", "1:00pm", "5:00pm"]);
  });
});
