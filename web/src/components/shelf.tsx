"use client";

import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import type { ProductView } from "@/lib/catalog";
import { cartActions } from "@/lib/cart-store";
import { STOCK_LABELS } from "@/lib/stock";
import { formatTtd, priceFor } from "@/lib/pricing";
import {
  DEALS,
  decantPrices,
  groupByTime,
  matchesShelf,
  timeOfDayTT,
  WEAR_TIMES,
  WEATHERS,
  type DealFilter,
  type ShelfFilter,
} from "@/lib/shelf";
import type { Gender, SizeMl } from "@/lib/types";
import { ScentPhoto } from "./scent-photo";

const GENDERS: { id: Gender; label: string }[] = [
  { id: "him", label: "Him" },
  { id: "her", label: "Her" },
  { id: "unisex", label: "Unisex" },
];

const noop = () => () => {};
/** Daytime or nighttime right now in Trinidad. Null on the server, so the marker never mismatches. */
function useNow() {
  return useSyncExternalStore(noop, () => timeOfDayTT(), () => null);
}

function bottleLine(p: ProductView): { text: string; on: boolean } {
  if (p.stock !== "in_stock") return { text: STOCK_LABELS[p.stock], on: false };
  if (p.sealed) return { text: `Sealed bottle ${formatTtd(p.sealed.price)}`, on: true };
  if (p.bottle) return { text: "Bottle sold · decants only", on: false };
  return { text: "Decants only", on: false };
}

// ------------------------------------------------------------------ filters

function Toggle({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" aria-pressed={on} onClick={onClick} className={`chip label-caps min-h-10 shrink-0 justify-center px-2 tracking-[0.14em] ${on ? "chip-on" : ""}`}>
      {children}
    </button>
  );
}

export function ShelfFilters({
  filter,
  onChange,
  full = false,
}: {
  filter: ShelfFilter;
  onChange: (f: ShelfFilter) => void;
  /** The scents page also filters by who's wearing it, deal and search. */
  full?: boolean;
}) {
  const set = (patch: Partial<ShelfFilter>) => onChange({ ...filter, ...patch });
  const active = Object.values(filter).some((v) => v);
  return (
    <div className="space-y-3">
      {full && (
        <label className="block">
          <span className="sr-only">Search scents</span>
          <input
            type="search"
            value={filter.query ?? ""}
            onChange={(e) => set({ query: e.target.value || undefined })}
            placeholder="Search a name, a note, or what it smells like"
            className="field"
          />
        </label>
      )}
      <div role="group" aria-label="When you'd wear it" className="grid grid-cols-4 gap-2">
        <Toggle on={!filter.time} onClick={() => set({ time: undefined })}>
          All
        </Toggle>
        {WEAR_TIMES.map((t) => (
          <Toggle key={t.id} on={filter.time === t.id} onClick={() => set({ time: filter.time === t.id ? undefined : t.id })}>
            {t.short}
          </Toggle>
        ))}
      </div>
      <div role="group" aria-label="Weather" className="grid grid-cols-2 gap-2">
        {WEATHERS.map((w) => (
          <Toggle key={w.id} on={filter.weather === w.id} onClick={() => set({ weather: filter.weather === w.id ? undefined : w.id })}>
            {w.short}
          </Toggle>
        ))}
      </div>
      {full && (
        <div className="flex flex-wrap gap-2">
          {GENDERS.map((g) => (
            <Toggle key={g.id} on={filter.gender === g.id} onClick={() => set({ gender: filter.gender === g.id ? undefined : g.id })}>
              {g.label}
            </Toggle>
          ))}
          <span aria-hidden className="mx-1 w-px shrink-0 self-stretch bg-line" />
          {(Object.keys(DEALS) as DealFilter[]).map((d) => (
            <Toggle key={d} on={filter.deal === d} onClick={() => set({ deal: filter.deal === d ? undefined : d })}>
              {DEALS[d].short}
            </Toggle>
          ))}
        </div>
      )}
      {full && active && (
        <button type="button" className="text-sm text-muted underline underline-offset-4 hover:text-ink" onClick={() => onChange({})}>
          Clear filters
        </button>
      )}
    </div>
  );
}

// ------------------------------------------------------------------ phone row

export function ScentRow({ product: p, priority = false }: { product: ProductView; priority?: boolean }) {
  const bottle = bottleLine(p);
  const live = p.status === "live";
  return (
    <Link href={`/scents/${p.id}`} className="group grid grid-cols-[4.75rem_minmax(0,1fr)] gap-4 py-3">
      <ScentPhoto product={p} sizes="76px" priority={priority} className="aspect-[5/6] w-[4.75rem]" />
      <div className="flex min-w-0 flex-col gap-1 py-0.5">
        <div className="flex items-baseline justify-between gap-3">
          <span className="truncate text-[1.0625rem] font-medium group-hover:text-hibiscus">{p.name}</span>
          <span className="shrink-0 text-xs text-muted">{p.house}</span>
        </div>
        <span className="line-clamp-2 text-sm leading-snug text-muted">{p.blurb}</span>
        {live ? (
          <>
            <span className="label-caps mt-1 text-[0.625rem] tracking-[0.14em] tabular-nums">
              Decants <span className="text-hibiscus">{decantPrices(p)}</span>
            </span>
            <span className={`label-caps text-[0.625rem] tracking-[0.14em] ${bottle.on ? "text-ink" : "text-muted"}`}>{bottle.text}</span>
          </>
        ) : (
          <span className="label-caps mt-1 text-[0.625rem] tracking-[0.14em] text-muted">Coming soon</span>
        )}
      </div>
    </Link>
  );
}

// ------------------------------------------------------------------ tray case

/**
 * A tester on the tray. The front is the bottle; "Sizes" turns it over to the
 * prices with one-tap add buttons, the way you'd turn a tester to read its base.
 */
export function ScentCase({ product: p, priority = false }: { product: ProductView; priority?: boolean }) {
  const [flipped, setFlipped] = useState(false);
  const [added, setAdded] = useState<string | null>(null);
  const live = p.status === "live" && p.stock === "in_stock";
  const add = (label: string, fn: () => void) => {
    fn();
    setAdded(label);
  };
  return (
    <div className="case-flip relative h-[19rem] lg:h-[20rem]" data-flipped={flipped}>
      <div className="case-face case-front absolute inset-0 flex flex-col overflow-hidden rounded-md bg-ink text-paper" inert={flipped}>
        <Link href={`/scents/${p.id}`} className="group relative block min-h-0 flex-1" aria-label={`${p.house} ${p.name}`}>
          <ScentPhoto product={p} sizes="(min-width: 1024px) 22vw, 30vw" priority={priority} fill inset="p-[10%]" />
        </Link>
        <div className="space-y-2 px-4 pb-4">
          <p className="truncate text-[0.9375rem] font-medium leading-tight">{p.name}</p>
          <div className="flex items-center justify-between gap-2">
            <p className="label-caps text-[0.625rem] tracking-[0.14em] text-pearl-ink-quiet tabular-nums">
              <span className="block whitespace-nowrap">{live ? `From ${formatTtd(priceFor(p.tier, 5))}` : STOCK_LABELS[p.stock]}</span>
              {live && p.sealed && <span className="block whitespace-nowrap">Bottle too</span>}
            </p>
            {live && (
              <button
                type="button"
                aria-expanded={flipped}
                aria-label={`Sizes and prices for ${p.name}`}
                onClick={() => setFlipped(true)}
                className="label-caps min-h-11 shrink-0 rounded-md border border-paper/25 px-3 text-[0.625rem] text-paper hover:border-paper"
              >
                Sizes
              </button>
            )}
          </div>
        </div>
      </div>

      {live && (
        <div className="case-face case-back absolute inset-0 flex flex-col justify-between rounded-md border border-hibiscus bg-paper p-5" inert={!flipped}>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-lg font-medium leading-tight">{p.name}</p>
              <p className="text-sm text-muted">{p.house}</p>
            </div>
            <button
              type="button"
              onClick={() => setFlipped(false)}
              aria-label={`Turn ${p.name} back over`}
              className="grid h-11 w-11 shrink-0 place-items-center rounded-md text-muted hover:text-ink"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M3 3l10 10M13 3L3 13" />
              </svg>
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {p.sizes.map((s) => (
              <button
                key={s.size}
                type="button"
                disabled={!s.available}
                onClick={() => add(`${s.size}ml`, () => cartActions.addSingle(p.id, s.size as SizeMl))}
                className="flex min-h-14 flex-col items-start justify-center rounded-md border border-line px-3 text-left hover:border-ink disabled:opacity-40"
              >
                <span className="label-caps text-[0.625rem]">{s.size}ml</span>
                <span className="wide text-sm text-hibiscus tabular-nums">{formatTtd(priceFor(p.tier, s.size as SizeMl))}</span>
              </button>
            ))}
            {p.sealed ? (
              <button
                type="button"
                onClick={() => add("the bottle", () => cartActions.addBottle(p.id))}
                className="flex min-h-14 flex-col items-start justify-center rounded-md border border-line px-3 text-left hover:border-ink"
              >
                <span className="label-caps text-[0.625rem]">Bottle</span>
                <span className="wide text-sm text-hibiscus tabular-nums">{formatTtd(p.sealed.price)}</span>
              </button>
            ) : (
              <span className="flex min-h-14 flex-col justify-center rounded-md border border-dashed border-line px-3">
                <span className="label-caps text-[0.625rem] text-muted">Bottle</span>
                <span className="text-xs text-muted">Decants only</span>
              </span>
            )}
          </div>
          <p role="status" aria-live="polite" className="flex min-h-5 items-center justify-between text-sm">
            {added ? (
              <>
                <span>Added {added}.</span>
                <Link href="/cart" className="underline underline-offset-4">
                  View cart
                </Link>
              </>
            ) : (
              <Link href={`/scents/${p.id}`} className="text-muted underline underline-offset-4 hover:text-ink">
                Notes, ratings and our take
              </Link>
            )}
          </p>
        </div>
      )}
    </div>
  );
}

// ------------------------------------------------------------------ shelf

/** The shop's shelf: a list grouped by time of day on phones, the tester tray from tablet up. */
export function Shelf({
  products,
  initial = {},
  full = false,
  emptyHint = "Nothing matches that. Try another filter.",
  intro,
  deals,
}: {
  products: ProductView[];
  initial?: ShelfFilter;
  full?: boolean;
  emptyHint?: string;
  /**
   * Homepage layout: on desktop the filters sit in the left column between
   * the intro and the deals; on phones the deals come first, then filters.
   */
  intro?: React.ReactNode;
  deals?: React.ReactNode;
}) {
  const [filter, setFilter] = useState<ShelfFilter>(initial);
  const filters = <ShelfFilters filter={filter} onChange={setFilter} full={full} />;
  if (intro || deals) {
    return (
      <div className="grid gap-8 md:grid-cols-[19rem_minmax(0,1fr)] md:gap-10 lg:grid-cols-[22rem_minmax(0,1fr)] lg:gap-14">
        <aside className="space-y-7 md:sticky md:top-20 md:self-start">
          {intro}
          <div className="hidden md:block">{filters}</div>
          {deals}
        </aside>
        <section aria-label="The scents" className="min-w-0 space-y-6">
          <div className="md:hidden">{filters}</div>
          <ShelfResults products={products} filter={filter} emptyHint={emptyHint} />
        </section>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      {filters}
      <ShelfResults products={products} filter={filter} emptyHint={emptyHint} />
    </div>
  );
}

function ShelfResults({ products, filter, emptyHint }: { products: ProductView[]; filter: ShelfFilter; emptyHint: string }) {
  const now = useNow();
  const shown = products.filter((p) => matchesShelf(p, filter));
  const groups = groupByTime(shown);

  return (
    <>
      <p className="sr-only" role="status" aria-live="polite">
        {shown.length} scent{shown.length === 1 ? "" : "s"}
      </p>
      {shown.length === 0 ? (
        <p className="py-10 text-muted">{emptyHint}</p>
      ) : (
        <>
          <div className="space-y-6 md:hidden">
            {groups.map((g, gi) => (
              <section key={g.time} aria-labelledby={`shelf-${g.time}`}>
                <div className="flex items-center gap-3">
                  <h3 id={`shelf-${g.time}`} className="label-caps text-muted">
                    {g.label}
                  </h3>
                  {now && g.time === now && <span className="label-caps text-[0.625rem] text-hibiscus">Now</span>}
                  <span aria-hidden className={`h-px flex-1 ${now && g.time === now ? "bg-hibiscus" : "bg-line"}`} />
                </div>
                <ul className="divide-y divide-mist">
                  {g.items.map((p, i) => (
                    <li key={p.id}>
                      <ScentRow product={p} priority={gi === 0 && i < 2} />
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
          <ul className="hidden grid-cols-3 gap-3 rounded-xl bg-mist p-3 md:grid lg:gap-4 lg:p-4">
            {shown.map((p, i) => (
              <li key={p.id}>
                <ScentCase product={p} priority={i < 3} />
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
}
