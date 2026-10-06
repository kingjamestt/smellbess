"use client";

import Link from "next/link";
import { useState } from "react";
import type { ProductView } from "@/lib/catalog";
import { cartActions } from "@/lib/cart-store";
import { OFFER_RULES } from "@/lib/offers";
import { formatTtd, priceFor } from "@/lib/pricing";
import type { SizeMl } from "@/lib/types";

type Choice = SizeMl | "bottle";

/**
 * The buy box: 5, 10 and 15ml decants and the sealed bottle as one choice.
 * Never says how much is left; a size is simply available or not.
 */
export function Purchase({ product: p }: { product: ProductView }) {
  const sizes = p.sizes.filter((s) => s.available).map((s) => s.size as SizeMl);
  const initial: Choice | null = sizes.includes(10) ? 10 : (sizes[0] ?? (p.sealed ? "bottle" : null));
  const [choice, setChoice] = useState<Choice | null>(initial);
  const [added, setAdded] = useState<string | null>(null);

  const price = (c: Choice) => (c === "bottle" ? p.sealed!.price : priceFor(p.tier, c));
  const split = choice === 15 && p.sizes.find((s) => s.size === 15)?.shipsAsSplit;
  const note =
    choice === "bottle"
      ? "Brand new, boxed and in cellophane. Full bottles aren't part of our offers."
      : choice && choice >= 10
        ? p.tier === OFFER_RULES.bundle.tier && choice === 10
          ? "Counts toward 5 Arabian 10ml for TT$350, or a free 5ml with any three 10ml+ decants."
          : "Counts toward a free 5ml when you get three decants of 10ml or more."
        : choice === 5
          ? "Enough for a few outings, to know if it's yours."
          : null;

  const option = (c: Choice, label: string, sub: string, enabled: boolean) => (
    <button
      key={String(c)}
      type="button"
      disabled={!enabled}
      aria-pressed={choice === c}
      onClick={() => {
        setChoice(c);
        setAdded(null);
      }}
      className={`flex min-h-[4.5rem] flex-col justify-center gap-1 rounded-md border px-3 text-left transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
        choice === c ? "border-ink bg-mist" : "border-line hover:border-muted"
      }`}
    >
      <span className="label-caps">{label}</span>
      <span className="wide text-[0.9375rem] text-hibiscus tabular-nums">{sub}</span>
    </button>
  );

  return (
    <div className="space-y-4">
      <fieldset>
        <legend className="mb-2 text-sm text-muted">Choose a size</legend>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {p.sizes.map((s) =>
            option(s.size as SizeMl, `${s.size}ml`, s.available ? formatTtd(priceFor(p.tier, s.size as SizeMl)) : "Sold out", s.available),
          )}
          {p.sealed
            ? option("bottle", `Full bottle ${p.sealed.sizeMl}ml`, formatTtd(p.sealed.price), true)
            : option("bottle", "Bottle", p.bottle ? "Sold" : "Decants only", false)}
        </div>
      </fieldset>
      {split && <p className="text-sm text-muted">15ml ships as a 10ml and a 5ml right now. Same juice, same price.</p>}
      <button
        type="button"
        className="btn-primary w-full"
        disabled={!choice}
        onClick={() => {
          if (!choice) return;
          if (choice === "bottle") cartActions.addBottle(p.id);
          else cartActions.addSingle(p.id, choice);
          setAdded(choice === "bottle" ? "The bottle" : `${choice}ml`);
        }}
      >
        {choice ? `Add ${choice === "bottle" ? "the bottle" : `${choice}ml`} · ${formatTtd(price(choice))}` : "Sold out for now"}
      </button>
      <p role="status" aria-live="polite" className="min-h-5 text-sm">
        {added ? (
          <>
            {added} is in your cart.{" "}
            <Link href="/cart" className="text-hibiscus underline">
              View cart
            </Link>
          </>
        ) : (
          note && <span className="text-muted">{note}</span>
        )}
      </p>
    </div>
  );
}
