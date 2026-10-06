import { describe, expect, it } from "vitest";
import { OFFER_RULES, priceCart, type OfferContext } from "./offers";
import { TIER_PRICES, formatTtd, priceFor } from "./pricing";
import type { Cart, CartLine, SizeMl, Tier } from "./types";

// Fixture catalog: A1–A6 Tier A, P1 Tier A+, D1 designer, N1 niche.
const ctx: OfferContext = {
  products: {
    A1: { tier: "A", label: "Alpha" },
    A2: { tier: "A", label: "Bravo" },
    A3: { tier: "A", label: "Charlie" },
    A4: { tier: "A", label: "Delta" },
    A5: { tier: "A", label: "Echo" },
    A6: { tier: "A", label: "Foxtrot" },
    P1: { tier: "A+", label: "Premium" },
    D1: { tier: "D1", label: "Designer" },
    N1: { tier: "N", label: "Niche" },
  },
  sets: {
    fete: { name: "Fete Pack", productIds: ["A1", "A2", "A3"] },
    office: { name: "Office Safe", productIds: ["A4", "A5", "A6"] },
    mixed: { name: "Mixed", productIds: ["A1", "A2", "P1"], price: { 5: 175, 10: 300 } },
  },
  freeSampleOptions: ["A1", "A2", "A3"],
};

const single = (productId: string, size: SizeMl, qty = 1): CartLine => ({
  kind: "single",
  productId,
  size,
  qty,
});
const set = (setId: string, size: 5 | 10, qty = 1): CartLine => ({ kind: "set", setId, size, qty });
const cart = (lines: CartLine[]): Cart => ({ lines });

describe("tier pricing", () => {
  it.each<[Tier, number, number, number]>([
    ["A", 60, 100, 150],
    ["A+", 70, 120, 175],
    ["D1", 75, 125, 185],
    ["D2", 120, 200, 275],
    ["N", 100, 180, 250],
  ])("tier %s is %i / %i / %i", (tier, p5, p10, p15) => {
    expect([priceFor(tier, 5), priceFor(tier, 10), priceFor(tier, 15)]).toEqual([p5, p10, p15]);
  });

  it("only sells 5, 10 and 15ml", () => {
    for (const tier of Object.keys(TIER_PRICES) as Tier[]) {
      expect(Object.keys(TIER_PRICES[tier]).sort()).toEqual(["10", "15", "5"]);
    }
  });

  it("formats TTD", () => {
    expect(formatTtd(350)).toBe("TT$350");
    expect(formatTtd(3901)).toBe("TT$3,901");
    expect(formatTtd(-20)).toBe("-TT$20");
  });

  it("prices single lines from the tier", () => {
    const q = priceCart(cart([single("D1", 15, 2), single("N1", 5)]), ctx);
    expect(q.subtotal).toBe(185 * 2 + 100);
    expect(q.offer).toBeNull();
    expect(q.itemsTotal).toBe(470);
  });
});

describe("no offer", () => {
  it("empty cart", () => {
    const q = priceCart(cart([]), ctx);
    expect(q).toMatchObject({ subtotal: 0, discount: 0, itemsTotal: 0, offer: null });
    expect(q.messages).toEqual([]);
  });

  it("two 10ml decants: nothing yet, hint toward the free 5ml", () => {
    const q = priceCart(cart([single("A1", 10, 2)]), ctx);
    expect(q.offer).toBeNull();
    expect(q.hints).toContain("Add 1 more 10ml or 15ml decant and get a free 5ml surprise.");
  });

  it("three 5ml singles are not a curated set and don't earn a free 5ml", () => {
    const q = priceCart(cart([single("A1", 5), single("A2", 5), single("A3", 5)]), ctx);
    expect(q.offer).toBeNull();
    expect(q.itemsTotal).toBe(180);
  });
});

describe("5×10ml bundle (TT$350)", () => {
  it("applies to 5 Tier A 10ml decants across lines", () => {
    const q = priceCart(
      cart([single("A1", 10, 2), single("A2", 10), single("A3", 10), single("A4", 10)]),
      ctx,
    );
    expect(q.offer?.id).toBe("bundle_5x10");
    expect(q.subtotal).toBe(500);
    expect(q.discount).toBe(150);
    expect(q.itemsTotal).toBe(OFFER_RULES.bundle.price);
    expect(q.messages[0]).toBe("5 Arabian 10ml decants for TT$350. You save TT$150.");
  });

  it("needs five: four 10ml decants don't qualify, and get a nudge", () => {
    const q = priceCart(cart([single("A1", 10, 4)]), ctx);
    expect(q.candidates.map((c) => c.id)).not.toContain("bundle_5x10");
    expect(q.hints).toContain("Add 1 more Arabian 10ml decant and get all 5 for TT$350.");
  });

  it("only counts 10ml: 5ml and 15ml don't fill a bundle", () => {
    const q = priceCart(cart([single("A1", 10, 3), single("A2", 15), single("A3", 5)]), ctx);
    expect(q.candidates.map((c) => c.id)).not.toContain("bundle_5x10");
  });

  it("excludes A+: 4 Tier A + 1 A+ is not a bundle", () => {
    const q = priceCart(cart([single("A1", 10, 4), single("P1", 10)]), ctx);
    expect(q.candidates.map((c) => c.id)).not.toContain("bundle_5x10");
    expect(q.messages.some((m) => m.includes("Premium 10ml") && m.includes("Tier A"))).toBe(true);
    // ...but it does count toward the free 5ml, which wins here.
    expect(q.offer?.id).toBe("free_5ml");
  });

  it("five A+ 10ml decants: no bundle, but they earn the free 5ml", () => {
    const q = priceCart(cart([single("P1", 10, 5)]), ctx);
    expect(q.candidates.map((c) => c.id)).toEqual(["free_5ml"]);
    expect(q.itemsTotal).toBe(600);
  });

  it("designer and niche 10ml decants never fill a bundle", () => {
    const q = priceCart(cart([single("D1", 10, 3), single("N1", 10, 2)]), ctx);
    expect(q.candidates.map((c) => c.id)).not.toContain("bundle_5x10");
  });

  it("six 10ml = one bundle + 1 at full price", () => {
    const q = priceCart(cart([single("A1", 10, 6)]), ctx);
    expect(q.offer?.id).toBe("bundle_5x10");
    expect(q.itemsTotal).toBe(350 + 100);
  });

  it("ten 10ml = two bundles (TT$700), still one offer", () => {
    const q = priceCart(cart([single("A1", 10, 10)]), ctx);
    expect(q.offer?.id).toBe("bundle_5x10");
    expect(q.offer?.label).toBe("2 × 5×10ml bundles, TT$350 each");
    expect(q.discount).toBe(300);
    expect(q.itemsTotal).toBe(700);
    expect(q.messages[0]).toBe("10 Arabian 10ml decants as 2 bundles of 5, TT$350 each. You save TT$300.");
  });

  it("thirteen 10ml = two bundles + 3 at full price, with a nudge toward a third", () => {
    const q = priceCart(cart([single("A1", 10, 13)]), ctx);
    expect(q.itemsTotal).toBe(700 + 300);
    expect(q.hints).toContain("Add 2 more Arabian 10ml decants and get another 5 for TT$350.");
  });

  it("A+ items alongside a bundle are charged at A+ prices", () => {
    const q = priceCart(cart([single("A1", 10, 5), single("P1", 10)]), ctx);
    expect(q.offer?.id).toBe("bundle_5x10");
    expect(q.itemsTotal).toBe(350 + 120);
  });
});

describe("curated sets (3×5ml TT$150, 3×10ml TT$280)", () => {
  it("3×5ml set is TT$150", () => {
    const q = priceCart(cart([set("fete", 5)]), ctx);
    expect(q.offer?.id).toBe("set");
    expect(q.subtotal).toBe(180);
    expect(q.discount).toBe(30);
    expect(q.itemsTotal).toBe(150);
    expect(q.lines[0].unit).toBe(150);
  });

  it("3×10ml set is TT$280", () => {
    const q = priceCart(cart([set("fete", 10)]), ctx);
    expect(q.itemsTotal).toBe(280);
    expect(q.discount).toBe(20);
  });

  it("set price covers every set in the order", () => {
    const q = priceCart(cart([set("fete", 5, 2), set("office", 10)]), ctx);
    expect(q.offer?.id).toBe("set");
    expect(q.itemsTotal).toBe(150 * 2 + 280);
  });

  it("a set with an A+ scent uses its own price (Fete Pack: TT$175 / TT$300)", () => {
    expect(priceCart(cart([set("mixed", 5)]), ctx)).toMatchObject({ subtotal: 190, itemsTotal: 175 });
    expect(priceCart(cart([set("mixed", 10)]), ctx)).toMatchObject({ subtotal: 320, itemsTotal: 300 });
  });

  it("set contents never count toward the bundle", () => {
    const q = priceCart(cart([set("fete", 10), single("A4", 10, 2)]), ctx);
    expect(q.candidates.map((c) => c.id)).toEqual(["set"]);
    expect(q.itemsTotal).toBe(280 + 200);
  });

  it("set contents never count toward the free 5ml", () => {
    const q = priceCart(cart([set("fete", 10)]), ctx);
    expect(q.candidates.map((c) => c.id)).not.toContain("free_5ml");
  });
});

describe("free 5ml surprise with 3+ single decants of 10ml or larger", () => {
  it("three 10ml decants: a surprise 5ml, nothing to choose", () => {
    const q = priceCart(cart([single("A1", 10, 3)]), ctx);
    expect(q.offer?.id).toBe("free_5ml");
    expect(q.offer?.label).toBe("Free 5ml surprise");
    expect(q.discount).toBe(0);
    expect(q.itemsTotal).toBe(300);
    expect(q.freeSample).toEqual({ value: 60 });
    expect(q.messages[0]).toBe(
      "You've got 3 decants of 10ml or bigger, so a free 5ml surprise is going in your bag. We pick it (worth TT$60).",
    );
  });

  it("15ml decants count, and sizes can be mixed", () => {
    expect(priceCart(cart([single("A1", 15, 3)]), ctx).offer?.id).toBe("free_5ml");
    expect(priceCart(cart([single("A1", 10, 2), single("A2", 15)]), ctx).offer?.id).toBe("free_5ml");
  });

  it("5ml decants don't count toward the three", () => {
    const q = priceCart(cart([single("A1", 10, 2), single("A2", 5, 4)]), ctx);
    expect(q.offer).toBeNull();
  });

  it("any tier counts toward the three: A+, designer and niche too", () => {
    expect(priceCart(cart([single("A1", 10, 2), single("P1", 10)]), ctx).offer?.id).toBe("free_5ml");
    expect(priceCart(cart([single("D1", 15), single("N1", 10), single("P1", 10)]), ctx).offer?.id).toBe(
      "free_5ml",
    );
  });

  it("isn't offered when no Tier A scent has 5ml to spare", () => {
    const q = priceCart(cart([single("A1", 10, 3)]), { ...ctx, freeSampleOptions: [] });
    expect(q.offer).toBeNull();
  });

  it("an A+ scent alone can't be packed as the free 5ml", () => {
    const q = priceCart(cart([single("A1", 10, 3)]), { ...ctx, freeSampleOptions: ["P1"] });
    expect(q.offer).toBeNull();
  });

  it("only one free 5ml, even with six qualifying decants", () => {
    const q = priceCart(cart([single("A1", 15, 6)]), ctx);
    expect(q.offer?.value).toBe(60);
  });

  it("nudges at two qualifying decants", () => {
    const q = priceCart(cart([single("P1", 10, 2)]), ctx);
    expect(q.hints).toContain("Add 1 more 10ml or 15ml decant and get a free 5ml surprise.");
  });
});

describe("exactly one offer per order (best one wins)", () => {
  it("bundle beats free 5ml with five 10ml decants", () => {
    const q = priceCart(cart([single("A1", 10, 5)]), ctx);
    expect(q.candidates.map((c) => c.id).sort()).toEqual(["bundle_5x10", "free_5ml"]);
    expect(q.offer?.id).toBe("bundle_5x10");
    expect(q.freeSample).toBeNull();
    expect(q.messages[1]).toBe(
      "Only one offer per order, so we picked the one that saves you the most. It beats the free 5ml (worth TT$60).",
    );
  });

  it("free 5ml beats a set discount; the set is charged at regular prices", () => {
    const q = priceCart(cart([set("fete", 10), single("A4", 10, 3)]), ctx);
    expect(q.offer?.id).toBe("free_5ml");
    expect(q.discount).toBe(0);
    expect(q.lines[0].unit).toBe(300);
    expect(q.itemsTotal).toBe(600);
    expect(q.messages[1]).toContain("so your sets are charged at regular prices");
  });

  it("bundle beats a set: set at regular price, bundle applied", () => {
    const q = priceCart(cart([set("fete", 5), single("A4", 10, 5)]), ctx);
    expect(q.offer?.id).toBe("bundle_5x10");
    expect(q.itemsTotal).toBe(180 + 350);
  });

  it("bigger set saving beats the free 5ml", () => {
    // Three 3×5ml sets save TT$90 > TT$60 free 5ml.
    const q = priceCart(cart([set("fete", 5, 3), single("A4", 10, 3)]), ctx);
    expect(q.offer?.id).toBe("set");
    expect(q.discount).toBe(90);
    expect(q.freeSample).toBeNull();
  });

  it("ties go to the set over the free 5ml", () => {
    // Two 3×5ml sets save TT$60 = free 5ml value TT$60.
    const q = priceCart(cart([set("fete", 5, 2), single("A4", 10, 3)]), ctx);
    expect(q.offer?.id).toBe("set");
  });

  it("never discounts more than the single best candidate", () => {
    const q = priceCart(cart([set("fete", 5, 4), single("A4", 10, 5)]), ctx);
    const best = Math.max(...q.candidates.map((c) => c.value));
    expect(q.offer?.value).toBe(best);
    expect(q.discount).toBe(best);
  });

  it("no hint when the current offer already beats it", () => {
    const q = priceCart(cart([set("fete", 5, 3), single("A4", 10, 2)]), ctx);
    expect(q.offer?.id).toBe("set");
    expect(q.hints).toEqual([]);
  });
});

describe("bad input", () => {
  it("flags unknown products and sets", () => {
    const q = priceCart(cart([single("nope", 10), set("nope", 5)]), ctx);
    expect(q.problems).toHaveLength(2);
    expect(q.subtotal).toBe(0);
  });

  it("flags zero or fractional quantities", () => {
    expect(priceCart(cart([single("A1", 10, 0)]), ctx).problems).toHaveLength(1);
    expect(priceCart(cart([single("A1", 10, 1.5)]), ctx).problems).toHaveLength(1);
  });
});

describe("sealed bottles", () => {
  const withBottle: OfferContext = {
    ...ctx,
    products: { ...ctx.products, A1: { ...ctx.products.A1, bottle: { sizeMl: 100, price: 550 } } },
  };
  const bottle: CartLine = { kind: "bottle", productId: "A1", qty: 1 };

  it("are priced on their own, at the product's bottle price", () => {
    const q = priceCart(cart([bottle]), withBottle);
    expect(q.subtotal).toBe(550);
    expect(q.lines[0].label).toBe("Alpha, sealed 100ml bottle");
    expect(q.offer).toBeNull();
  });

  it("don't count toward the free 5ml, and sit alongside a decant offer untouched", () => {
    const q = priceCart(cart([bottle, single("A2", 10), single("A3", 10)]), withBottle);
    expect(q.offer).toBeNull();
    const withThree = priceCart(cart([bottle, single("A2", 10), single("A3", 10), single("A4", 10)]), withBottle);
    expect(withThree.offer?.id).toBe("free_5ml");
    expect(withThree.itemsTotal).toBe(550 + 300);
  });

  it("are a problem when the scent has no bottle price", () => {
    expect(priceCart(cart([{ kind: "bottle", productId: "A2", qty: 1 }]), withBottle).problems).toHaveLength(1);
  });
});
