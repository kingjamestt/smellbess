"use client";

import Link from "next/link";
import { useState } from "react";
import { cartActions } from "@/lib/cart-store";
import type { SizeAvailability } from "@/lib/stock";
import { formatTtd, priceFor } from "@/lib/pricing";
import type { SizeMl, Tier } from "@/lib/types";

export function SizePicker({
  productId,
  tier,
  sizes,
}: {
  productId: string;
  tier: Tier;
  sizes: SizeAvailability[];
}) {
  const firstAvailable = sizes.find((s) => s.available)?.size ?? null;
  const [size, setSize] = useState<SizeMl | null>(
    sizes.find((s) => s.size === 10 && s.available) ? 10 : firstAvailable,
  );
  const [added, setAdded] = useState<string | null>(null);
  const chosen = sizes.find((s) => s.size === size);

  return (
    <div className="space-y-3">
      <fieldset>
        <legend className="label">Pick a size</legend>
        <div className="grid grid-cols-3 gap-2">
          {sizes.map((s) => {
            const on = size === s.size;
            return (
              <button
                key={s.size}
                type="button"
                disabled={!s.available}
                aria-pressed={on}
                onClick={() => {
                  setSize(s.size);
                  setAdded(null);
                }}
                className={`flex min-h-20 flex-col items-center justify-center rounded-xl border-2 p-2 text-center disabled:cursor-not-allowed disabled:opacity-40 ${
                  on ? "border-hibiscus bg-hibiscus/5" : "border-line bg-paper"
                }`}
              >
                <span className="text-lg font-extrabold">{s.size}ml</span>
                <span className="text-sm font-semibold">{formatTtd(priceFor(tier, s.size))}</span>
                <span className="text-[11px] leading-tight text-muted">
                  {!s.available ? "Sold out" : s.badge ?? "In stock"}
                </span>
              </button>
            );
          })}
        </div>
      </fieldset>
      {chosen?.shipsAsSplit && (
        <p className="rounded-xl bg-sun/40 px-3 py-2 text-sm">
          Heads up: 15ml ships as a 10ml + a 5ml right now. Same 15ml of juice, same price.
        </p>
      )}
      <button
        type="button"
        className="btn-primary w-full"
        disabled={!size}
        onClick={() => {
          if (!size) return;
          cartActions.addSingle(productId, size);
          setAdded(`${size}ml added to your cart.`);
        }}
      >
        {size ? `Add ${size}ml · ${formatTtd(priceFor(tier, size))}` : "Sold out for now"}
      </button>
      <p role="status" aria-live="polite" className="min-h-6 text-sm font-semibold text-sea">
        {added && (
          <>
            {added}{" "}
            <Link href="/cart" className="underline">
              View cart
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
