import { formatTtd, priceFor } from "./pricing";
import type { Cart, CartLine, OfferId, SizeMl, Tier } from "./types";

/**
 * Offer rules. Source: business-plan.md §2.3b (owner decisions, 5 Oct 2026).
 *
 * - Exactly ONE offer per order. They never stack.
 * - 5×10ml bundle: Tier A 10ml singles only. Every full group of 5 is
 *   TT$350, so 10×10ml is two bundles (TT$700). Still one offer.
 * - Curated sets: TT$150 / TT$280, or the set's own price (the Fete Pack has
 *   an A+ scent, so it's TT$175 / TT$300).
 * - Free 5ml: 3+ single decants of 10ml or bigger, any tier. It's a surprise:
 *   the customer doesn't choose, we pack a Tier A 5ml (often a slow seller).
 * - Sealed full bottles are priced on their own and never part of an offer:
 *   they don't count toward the bundle or the free 5ml.
 * - No vouchers, no free delivery.
 */
export const OFFER_RULES = {
  bundle: { tier: "A" as Tier, size: 10 as SizeMl, count: 5, price: 350 },
  sets: { 5: 150, 10: 280 } as Record<5 | 10, number>,
  freeSample: { minQualifying: 3, minSize: 10, size: 5 as SizeMl, tier: "A" as Tier },
} as const;

/** Tie-break when two offers are worth the same: earlier wins. */
const PRIORITY: OfferId[] = ["bundle_5x10", "set", "free_5ml"];

export interface OfferContext {
  products: Record<string, { tier: Tier; label: string; bottle?: { sizeMl: number; price: number } }>;
  sets: Record<
    string,
    { name: string; productIds: readonly string[]; price?: Record<5 | 10, number> }
  >;
  /** Tier A products we could pack as the free 5ml right now. */
  freeSampleOptions: string[];
}

export interface Candidate {
  id: OfferId;
  label: string;
  /** Money value to the customer, used to pick the best offer. */
  value: number;
  /** Amount taken off the subtotal (0 for the free 5ml: it's an extra item). */
  discount: number;
}

export interface PricedLine {
  index: number;
  line: CartLine;
  label: string;
  regularUnit: number;
  regularTotal: number;
  /** Unit price after the applied offer (only curated sets change per line). */
  unit: number;
  total: number;
}

/** The free 5ml surprise. No scent here: we choose it when packing. */
export interface FreeSampleState {
  value: number;
}

export interface Quote {
  lines: PricedLine[];
  /** Everything at regular prices. */
  subtotal: number;
  discount: number;
  /** subtotal − discount, before delivery. */
  itemsTotal: number;
  offer: (Candidate & { explanation: string }) | null;
  candidates: Candidate[];
  freeSample: FreeSampleState | null;
  /** Plain-words explanation of what happened. */
  messages: string[];
  /** Nudges toward an offer that would beat the current one. */
  hints: string[];
  /** Problems with the cart itself (unknown product/set, bad qty). */
  problems: string[];
}

export const setPrice = (set: { price?: Record<5 | 10, number> }, size: 5 | 10) =>
  set.price?.[size] ?? OFFER_RULES.sets[size];

function plural(n: number, word: string) {
  return `${n} ${word}${n === 1 ? "" : "s"}`;
}

/**
 * Price a cart and pick the single best offer. Pure: same input, same output.
 * The cart UI uses it for display and the server re-runs it on checkout.
 */
export function priceCart(cart: Cart, ctx: OfferContext): Quote {
  const problems: string[] = [];
  const lines: PricedLine[] = [];

  cart.lines.forEach((line, index) => {
    if (!Number.isInteger(line.qty) || line.qty < 1) {
      problems.push(`Line ${index + 1} has an invalid quantity.`);
      return;
    }
    if (line.kind === "bottle") {
      const product = ctx.products[line.productId];
      if (!product?.bottle) {
        problems.push(`We couldn't find one of the bottles in your cart.`);
        return;
      }
      const unit = product.bottle.price;
      lines.push({
        index,
        line,
        label: `${product.label}, full ${product.bottle.sizeMl}ml bottle`,
        regularUnit: unit,
        regularTotal: unit * line.qty,
        unit,
        total: unit * line.qty,
      });
    } else if (line.kind === "single") {
      const product = ctx.products[line.productId];
      if (!product) {
        problems.push(`We couldn't find one of the scents in your cart.`);
        return;
      }
      const unit = priceFor(product.tier, line.size);
      lines.push({
        index,
        line,
        label: `${product.label} ${line.size}ml`,
        regularUnit: unit,
        regularTotal: unit * line.qty,
        unit,
        total: unit * line.qty,
      });
    } else {
      const set = ctx.sets[line.setId];
      const tiers = set?.productIds.map((id) => ctx.products[id]?.tier);
      if (!set || !tiers || tiers.some((t) => t === undefined)) {
        problems.push(`We couldn't find one of the sets in your cart.`);
        return;
      }
      const unit = (tiers as Tier[]).reduce((sum, t) => sum + priceFor(t, line.size), 0);
      lines.push({
        index,
        line,
        label: `${set.name} (3×${line.size}ml)`,
        regularUnit: unit,
        regularTotal: unit * line.qty,
        unit,
        total: unit * line.qty,
      });
    }
  });

  const subtotal = lines.reduce((sum, l) => sum + l.regularTotal, 0);

  // ---- Candidates ----------------------------------------------------------
  const candidates: Candidate[] = [];
  const tierOf = (l: PricedLine) =>
    l.line.kind === "single" ? ctx.products[l.line.productId]?.tier : undefined;

  // Bundle: Tier A 10ml singles only (set contents never count). Every full
  // group of 5 is one bundle.
  const { tier: bundleTier, size: bundleMl, count: bundleSize, price: bundlePrice } =
    OFFER_RULES.bundle;
  const bundleUnits: number[] = [];
  for (const l of lines) {
    if (l.line.kind === "single" && l.line.size === bundleMl && tierOf(l) === bundleTier) {
      for (let i = 0; i < l.line.qty; i++) bundleUnits.push(l.regularUnit);
    }
  }
  const bundles = Math.floor(bundleUnits.length / bundleSize);
  if (bundles > 0) {
    const used = [...bundleUnits].sort((a, b) => b - a).slice(0, bundles * bundleSize);
    const saving = used.reduce((s, p) => s + p, 0) - bundles * bundlePrice;
    if (saving > 0) {
      candidates.push({
        id: "bundle_5x10",
        label:
          bundles === 1
            ? `5×10ml bundle for ${formatTtd(bundlePrice)}`
            : `${bundles} × 5×10ml bundles, ${formatTtd(bundlePrice)} each`,
        value: saving,
        discount: saving,
      });
    }
  }

  // Curated sets: each set line drops to its set price.
  let setSaving = 0;
  const setNames: string[] = [];
  for (const l of lines) {
    if (l.line.kind !== "set") continue;
    const target = setPrice(ctx.sets[l.line.setId], l.line.size);
    if (l.regularUnit > target) {
      setSaving += (l.regularUnit - target) * l.line.qty;
      setNames.push(l.label);
    }
  }
  if (setSaving > 0) {
    candidates.push({
      id: "set",
      label: "Curated set price",
      value: setSaving,
      discount: setSaving,
    });
  }

  // Free 5ml surprise: 3+ single decants of 10ml or bigger, any tier. Only
  // offered while we have a Tier A scent with 5ml to spare.
  const qualifying = lines
    .filter((l) => l.line.kind === "single" && l.line.size >= OFFER_RULES.freeSample.minSize)
    .reduce((n, l) => n + l.line.qty, 0);
  const freeValue = priceFor(OFFER_RULES.freeSample.tier, OFFER_RULES.freeSample.size);
  const canPackFree = ctx.freeSampleOptions.some(
    (id) => ctx.products[id]?.tier === OFFER_RULES.freeSample.tier,
  );
  if (qualifying >= OFFER_RULES.freeSample.minQualifying && canPackFree) {
    candidates.push({
      id: "free_5ml",
      label: "Free 5ml surprise",
      value: freeValue,
      discount: 0,
    });
  }

  // ---- Pick exactly one ----------------------------------------------------
  const best =
    [...candidates].sort(
      (a, b) => b.value - a.value || PRIORITY.indexOf(a.id) - PRIORITY.indexOf(b.id),
    )[0] ?? null;

  const messages: string[] = [];
  let freeSample: FreeSampleState | null = null;
  let explanation = "";

  if (best?.id === "bundle_5x10") {
    explanation =
      bundles === 1
        ? `5 Arabian 10ml decants for ${formatTtd(bundlePrice)}. You save ${formatTtd(best.value)}.`
        : `${bundles * bundleSize} Arabian 10ml decants as ${bundles} bundles of 5, ${formatTtd(bundlePrice)} each. You save ${formatTtd(best.value)}.`;
  } else if (best?.id === "set") {
    explanation = `Set price on ${setNames.join(", ")}. You save ${formatTtd(best.value)}.`;
    for (const l of lines) {
      if (l.line.kind === "set") {
        l.unit = Math.min(l.regularUnit, setPrice(ctx.sets[l.line.setId], l.line.size));
        l.total = l.unit * l.line.qty;
      }
    }
  } else if (best?.id === "free_5ml") {
    freeSample = { value: freeValue };
    explanation = `You've got ${qualifying} decants of 10ml or bigger, so a free 5ml surprise is going in your bag. We pick it (worth ${formatTtd(freeValue)}).`;
  }
  if (best) messages.push(explanation);

  const others = candidates.filter((c) => c !== best);
  if (best && others.length > 0) {
    const otherText = others
      .map((c) =>
        c.id === "free_5ml"
          ? `the free 5ml (worth ${formatTtd(c.value)})`
          : c.id === "set"
            ? `the set price (saves ${formatTtd(c.value)}, so your sets are charged at regular prices)`
            : `the 5×10ml bundle (saves ${formatTtd(c.value)})`,
      )
      .join(" and ");
    messages.push(
      `Only one offer per order, so we picked the one that saves you the most. It beats ${otherText}.`,
    );
  }

  const notBundle = lines.filter(
    (l) => l.line.kind === "single" && l.line.size === bundleMl && tierOf(l) !== bundleTier,
  );
  // Only worth saying when they have 5+ 10ml decants and might expect the bundle.
  const notBundleQty = notBundle.reduce((n, l) => n + l.line.qty, 0);
  if (notBundleQty > 0 && bundleUnits.length > 0 && bundleUnits.length + notBundleQty >= bundleSize) {
    messages.push(
      `The 5×10ml bundle is for Tier A Arabians only, so ${notBundle.map((l) => l.label).join(", ")} ${notBundle.length === 1 ? "doesn't" : "don't"} count toward it.`,
    );
  }

  // ---- Hints ---------------------------------------------------------------
  const hints: string[] = [];
  const bestValue = best?.value ?? 0;
  const tenMls = bundleUnits.length;
  const toNext = bundleSize - (tenMls % bundleSize);
  if (bundles === 0 && tenMls >= 3) {
    const potential = priceFor(bundleTier, bundleMl) * bundleSize - bundlePrice;
    if (potential > bestValue) {
      hints.push(
        `Add ${plural(toNext, "more Arabian 10ml decant")} and get all 5 for ${formatTtd(bundlePrice)}.`,
      );
    }
  } else if (bundles > 0 && best?.id === "bundle_5x10" && toNext <= 2) {
    hints.push(
      `Add ${plural(toNext, "more Arabian 10ml decant")} and get another 5 for ${formatTtd(bundlePrice)}.`,
    );
  }
  if (
    qualifying === OFFER_RULES.freeSample.minQualifying - 1 &&
    freeValue > bestValue &&
    canPackFree
  ) {
    hints.push(`Add 1 more 10ml or 15ml decant and get a free 5ml surprise.`);
  }

  const discount = best?.discount ?? 0;
  return {
    lines,
    subtotal,
    discount,
    itemsTotal: subtotal - discount,
    offer: best ? { ...best, explanation } : null,
    candidates,
    freeSample,
    messages,
    hints,
    problems,
  };
}
