"use client";

import Link from "next/link";
import { useEffect } from "react";
import { captureUtm, cartCount, useCart, useHydrated } from "@/lib/cart-store";

export function CartLink() {
  const cart = useCart();
  const hydrated = useHydrated();
  const count = hydrated ? cartCount(cart) : 0;
  return (
    <Link
      href="/cart"
      className="inline-flex min-h-10 items-center gap-2 rounded-md border border-line px-3 text-ink hover:border-ink"
      aria-label={`Cart, ${count} item${count === 1 ? "" : "s"}`}
    >
      Cart
      <span className="inline-flex min-w-5 justify-center rounded-sm bg-hibiscus px-1 text-[0.7rem] font-semibold tracking-normal text-on-hibiscus">
        {count}
      </span>
    </Link>
  );
}

/** Remembers utm_source/medium/campaign from the landing URL for the order. */
export function UtmCapture() {
  useEffect(() => {
    captureUtm(window.location.search);
  }, []);
  return null;
}
