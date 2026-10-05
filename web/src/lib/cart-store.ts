"use client";

import { useSyncExternalStore } from "react";
import type { Cart, CartLine, SizeMl } from "./types";

/**
 * Tiny cart store in the browser (localStorage). No prices are stored here:
 * prices always come from the tier table, and the server re-prices on order.
 */
const KEY = "smellbess.cart.v1";
const EMPTY: Cart = { lines: [] };

let state: Cart = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Cart;
      // Only lines: older carts may carry a free 5ml pick, which no longer exists.
      if (Array.isArray(parsed?.lines)) state = { lines: parsed.lines };
    }
  } catch {
    // Private mode or bad data: start empty.
  }
}

function emit(next: Cart) {
  state = next;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // Storage blocked: the cart still works for this page view.
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key !== KEY) return;
    loaded = false;
    state = EMPTY;
    load();
    listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function getSnapshot() {
  load();
  return state;
}

export function useCart(): Cart {
  return useSyncExternalStore(subscribe, getSnapshot, () => EMPTY);
}

const noop = () => () => {};
/** False during server render and hydration, true after. */
export function useHydrated(): boolean {
  return useSyncExternalStore(noop, () => true, () => false);
}

export function cartCount(cart: Cart): number {
  return cart.lines.reduce((n, l) => n + l.qty, 0);
}

const sameLine = (a: CartLine, b: CartLine) =>
  a.kind === b.kind &&
  a.size === b.size &&
  (a.kind === "single"
    ? a.productId === (b as typeof a).productId
    : a.setId === (b as typeof a).setId);

export const cartActions = {
  add(line: CartLine) {
    load();
    const existing = state.lines.findIndex((l) => sameLine(l, line));
    const lines =
      existing >= 0
        ? state.lines.map((l, i) => (i === existing ? { ...l, qty: Math.min(20, l.qty + line.qty) } : l))
        : [...state.lines, line];
    emit({ ...state, lines });
  },
  addSingle(productId: string, size: SizeMl, qty = 1) {
    cartActions.add({ kind: "single", productId, size, qty });
  },
  addSet(setId: string, size: 5 | 10) {
    cartActions.add({ kind: "set", setId, size, qty: 1 });
  },
  setQty(index: number, qty: number) {
    load();
    const lines =
      qty <= 0
        ? state.lines.filter((_, i) => i !== index)
        : state.lines.map((l, i) => (i === index ? { ...l, qty: Math.min(20, qty) } : l));
    emit({ ...state, lines });
  },
  clear() {
    emit(EMPTY);
  },
};

// ---- UTM capture (which channel brought the order) -----------------------
const UTM_KEY = "smellbess.utm.v1";

export function captureUtm(search: string) {
  try {
    const p = new URLSearchParams(search);
    const source = p.get("utm_source");
    if (!source) return;
    window.sessionStorage.setItem(
      UTM_KEY,
      JSON.stringify({ source, medium: p.get("utm_medium") ?? undefined, campaign: p.get("utm_campaign") ?? undefined }),
    );
  } catch {
    // ignore
  }
}

export function readUtm(): { source?: string; medium?: string; campaign?: string } | undefined {
  try {
    const raw = window.sessionStorage.getItem(UTM_KEY);
    return raw ? JSON.parse(raw) : undefined;
  } catch {
    return undefined;
  }
}
