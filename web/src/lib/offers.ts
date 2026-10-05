import { formatTtd, priceFor } from "./pricing";
import type { Cart, CartLine, OfferId, SizeMl, Tier } from "./types";

/**
 * Offer rules. Source: CLAUDE.md "Offers (one per order, Tier A only)" and
 * business-plan.md §2.3b.
 *
 * - Exactly ONE offer per order. They never stack.
 * - Tier A only. A+, D1, D2 and N never count toward an offer and are never
 *   given free.
 * - No vouchers, no free delivery.
 */
export const OFFER_RULES = {
  eligibleTiers: ["A"] as readonly Tier[],
  bundle: { size: 10 as SizeMl, count: 5, price: 350, maxPerOrder: 1 },
  sets: { 5: 150, 10: 280 } as Record<5 | 10, number>,
  freeSample: { minQualifying: 3, minSize: 10, size: 5 as SizeMl, tier: "A" as Tier },
} as const;

/** Tie-break when two offers are worth the same: earlier wins. */
const PRIORITY: OfferId[] = ["bundle_5x10", "set", "free_5ml"];

export interface OfferContext {
  products: Record<string, { tier: Tier; label: string }>;
  sets: Record<string, { name: string; productIds: readonly string[] }>;
  /** Tier A products that can be given as a free 5ml right now. */
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
  /** Whether this line can count toward an offer. */
  offerEligible: boolean;
}

export interface FreeSampleState {
  options: string[];
  productId: string | null;
  needsChoice: boolean;
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

const isEligibleTier = (tier: Tier | undefined) =>
  tier !== undefined && OFFER_RULES.eligibleTiers.includes(tier);

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
    if (line.kind === "single") {
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
        offerEligible: isEligibleTier(product.tier),
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
        offerEligible: (tiers as Tier[]).every(isEligibleTier),
      });
    }
  });

  const subtotal = lines.reduce((sum, l) => sum + l.regularTotal, 0);

  // ---- Candidates ----------------------------------------------------------
  const candidates: Candidate[] = [];

  // Bundle: Tier A 10ml singles only (set contents never count).
  const bundleUnits: number[] = [];
  for (const l of lines) {
    if (l.line.kind === "single" && l.offerEligible && l.line.size === OFFER_RULES.bundle.size) {
      for (let i = 0; i < l.line.qty; i++) bundleUnits.push(l.regularUnit);
    }
  }
  const { count: bundleSize, price: bundlePrice, maxPerOrder } = OFFER_RULES.bundle;
  const bundles = Math.min(maxPerOrder, Math.floor(bundleUnits.length / bundleSize));
  if (bundles > 0) {
    const used = [...bundleUnits].sort((a, b) => b - a).slice(0, bundles * bundleSize);
    const saving = used.reduce((s, p) => s + p, 0) - bundles * bundlePrice;
    if (saving > 0) {
      candidates.push({
        id: "bundle_5x10",
        label: `5×10ml bundle for ${formatTtd(bundlePrice)}`,
        value: saving,
        discount: saving,
      });
    }
  }

  // Curated sets: the set price covers every eligible set line.
  let setSaving = 0;
  const setNames: string[] = [];
  for (const l of lines) {
    if (l.line.kind !== "set" || !l.offerEligible) continue;
    const setUnit = OFFER_RULES.sets[l.line.size];
    if (l.regularUnit > setUnit) {
      setSaving += (l.regularUnit - setUnit) * l.line.qty;
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

  // Free 5ml: 3+ Tier A single decants of 10ml or larger.
  const qualifying = lines
    .filter(
      (l) =>
        l.line.kind === "single" &&
        l.offerEligible &&
        l.line.size >= OFFER_RULES.freeSample.minSize,
    )
    .reduce((n, l) => n + l.line.qty, 0);
  const freeValue = priceFor(OFFER_RULES.freeSample.tier, OFFER_RULES.freeSample.size);
  const freeOptions = ctx.freeSampleOptions.filter((id) =>
    isEligibleTier(ctx.products[id]?.tier),
  );
  if (qualifying >= OFFER_RULES.freeSample.minQualifying && freeOptions.length > 0) {
    candidates.push({
      id: "free_5ml",
      label: "Free 5ml",
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
    explanation = `5 Arabian 10ml decants for ${formatTtd(bundlePrice)}. You save ${formatTtd(best.value)}.`;
  } else if (best?.id === "set") {
    explanation = `Set price on ${setNames.join(", ")}: 3×5ml for ${formatTtd(OFFER_RULES.sets[5])}, 3×10ml for ${formatTtd(OFFER_RULES.sets[10])}. You save ${formatTtd(best.value)}.`;
    for (const l of lines) {
      if (l.line.kind === "set" && l.offerEligible) {
        l.unit = Math.min(l.regularUnit, OFFER_RULES.sets[l.line.size]);
        l.total = l.unit * l.line.qty;
      }
    }
  } else if (best?.id === "free_5ml") {
    const chosen =
      cart.freeSampleProductId && freeOptions.includes(cart.freeSampleProductId)
        ? cart.freeSampleProductId
        : null;
    freeSample = { options: freeOptions, productId: chosen, needsChoice: !chosen, value: freeValue };
    explanation = chosen
      ? `Your free 5ml: ${ctx.products[chosen].label}. On us (worth ${formatTtd(freeValue)}).`
      : `You've got ${qualifying} Arabian decants of 10ml or bigger, so pick your free 5ml.`;
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

  const excluded = lines.filter((l) => !l.offerEligible);
  if (excluded.length > 0 && lines.some((l) => l.offerEligible)) {
    messages.push(
      `Offers cover Tier A Arabians only, so ${excluded.map((l) => l.label).join(", ")} ${excluded.length === 1 ? "doesn't" : "don't"} count toward them.`,
    );
  }

  // ---- Hints ---------------------------------------------------------------
  const hints: string[] = [];
  const bestValue = best?.value ?? 0;
  const tenMls = bundleUnits.length;
  if (bundles === 0 && tenMls >= 3 && tenMls < bundleSize) {
    const potential = priceFor("A", 10) * bundleSize - bundlePrice;
    if (potential > bestValue) {
      hints.push(
        `Add ${plural(bundleSize - tenMls, "more Arabian 10ml")} and get all 5 for ${formatTtd(bundlePrice)}.`,
      );
    }
  }
  if (
    qualifying === OFFER_RULES.freeSample.minQualifying - 1 &&
    freeValue > bestValue &&
    freeOptions.length > 0
  ) {
    hints.push(`Add 1 more Arabian 10ml or 15ml and get a free 5ml.`);
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
