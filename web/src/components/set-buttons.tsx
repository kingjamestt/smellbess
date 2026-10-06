"use client";

import Link from "next/link";
import { useState } from "react";
import { cartActions } from "@/lib/cart-store";
import { formatTtd } from "@/lib/pricing";

export function SetButtons({
  setId,
  sizes,
  prices,
}: {
  setId: string;
  sizes: Record<5 | 10, boolean>;
  prices: Record<5 | 10, number>;
}) {
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
            3×{size}ml · {formatTtd(prices[size])}
          </button>
        ))}
      </div>
      <p role="status" aria-live="polite" className="min-h-5 text-sm">
        {added && (
          <>
            {added}{" "}
            <Link href="/cart" className="text-hibiscus underline">
              View cart
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
