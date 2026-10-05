"use client";

import Link from "next/link";
import { useState } from "react";
import { cartActions } from "@/lib/cart-store";
import { OFFER_RULES } from "@/lib/offers";
import { formatTtd } from "@/lib/pricing";

export function SetButtons({ setId, sizes }: { setId: string; sizes: Record<5 | 10, boolean> }) {
  const [added, setAdded] = useState<string | null>(null);
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-2">
        {([5, 10] as const).map((size) => (
          <button
            key={size}
            type="button"
            className={size === 10 ? "btn-primary" : "btn-secondary"}
            disabled={!sizes[size]}
            onClick={() => {
              cartActions.addSet(setId, size);
              setAdded(`3×${size}ml set added.`);
            }}
          >
            3×{size}ml · {formatTtd(OFFER_RULES.sets[size])}
          </button>
        ))}
      </div>
      <p role="status" aria-live="polite" className="min-h-5 text-sm font-semibold text-sea">
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
