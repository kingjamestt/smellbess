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
  genderShort,
  groupByTime,
  matchesShelf,
  timeOfDayTT,
  WEAR_TIMES,
  WEATHERS,
  type DealFilter,
  type ShelfFilter,
} from "@/lib/shelf";
import type { Gender, SizeMl } from "@/lib/types";
import {
  IconAll,
  IconAnytime,
  IconAnyWeather,
  IconBottle,
  IconBundle,
  IconCold,
  IconDay,
  IconGift,
  IconNight,
  IconWarm,
} from "./icons";
import { ScentPhoto } from "./scent-photo";

/** Unisex scents also show under Him and Her (see matchesShelf). */
const GENDERS: { id: Gender; label: string; title: string }[] = [
  { id: "him", label: "Him", title: "For him, unisex included" },
  { id: "her", label: "Her", title: "For her, unisex included" },
  { id: "unisex", label: "Unisex", title: "Unisex only" },
];

function GenderTag({ product, className = "" }: { product: ProductView; className?: string }) {
  return (
    <span className={`label-caps inline-flex h-5 shrink-0 items-center rounded-[0.25rem] border px-1.5 text-[0.5625rem] tracking-[0.16em] ${className}`}>
      {genderShort(product)}
    </span>
  );
}

const noop = () => () => {};
/** Daytime or nighttime right now in Trinidad. Null on the server, so the marker never mismatches. */
function useNow() {
  return useSyncExternalStore(noop, () => timeOfDayTT(), () => null);
}

function bottleLine(p: ProductView): { text: string; on: boolean } {
  if (p.stock !== "in_stock") return { text: STOCK_LABELS[p.stock], on: false };
  if (p.sealed) return { text: `Full bottle ${formatTtd(p.sealed.price)}`, on: true };
  if (p.bottle) return { text: "Bottle sold · decants only", on: false };
  return { text: "Decants only", on: false };
}

// ------------------------------------------------------------------ filters

type Option<T extends string> = { id: T; label: string; icon?: React.ReactNode; title?: string };

/**
 * A tray of options with one Amber-edged thumb that slides to the choice.
 * Radio semantics: arrow keys move the choice, Tab leaves the group.
 */
function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: Option<T>[];
  onChange: (v: T) => void;
}) {
  const n = options.length;
  const index = Math.max(0, options.findIndex((o) => o.id === value));
  const move = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const step = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0;
    if (!step) return;
    e.preventDefault();
    const next = (index + step + n) % n;
    onChange(options[next].id);
    (e.currentTarget.querySelectorAll<HTMLButtonElement>("[role=radio]")[next])?.focus();
  };
  return (
    <div className="space-y-2">
      <p className="label-caps text-[0.625rem] text-muted">{label}</p>
      <div
        role="radiogroup"
        aria-label={label}
        onKeyDown={move}
        className="relative grid rounded-md border border-line bg-mist p-1"
        style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}
      >
        <span
          aria-hidden
          className="seg-thumb absolute inset-y-1 left-1 rounded-[0.3rem] bg-inverse"
          style={{ width: `calc((100% - 0.5rem) / ${n})`, transform: `translateX(${index * 100}%)` }}
        >
          <span className="absolute inset-x-3 bottom-1 h-0.5 bg-hibiscus" />
        </span>
        {options.map((o, i) => {
          const on = i === index;
          return (
            <button
              key={o.id}
              type="button"
              role="radio"
              aria-checked={on}
              aria-label={o.title}
              tabIndex={on ? 0 : -1}
              onClick={() => onChange(o.id)}
              className={`relative z-10 flex ${o.icon ? "min-h-[3.25rem]" : "min-h-10"} flex-col items-center justify-center gap-1 rounded-[0.3rem] px-1 transition-colors duration-300 ${
                on ? "text-on-inverse" : "text-muted hover:text-ink"
              }`}
            >
              {o.icon}
              <span className="label-caps text-[0.5625rem] tracking-[0.16em]">{o.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

const TIME_ICONS = { day: <IconDay />, night: <IconNight />, any: <IconAnytime /> } as const;
const WEATHER_ICONS = { warm: <IconWarm />, cold: <IconCold /> } as const;
const DEAL_ICONS: Record<DealFilter, React.ReactNode> = { bundle: <IconBundle />, "free-5ml": <IconGift /> };
const DEAL_SHORT: Record<DealFilter, string> = { bundle: "5×10ml", "free-5ml": "Free 5ml" };

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
  const time = (
    <Segmented
      label="When"
      value={filter.time ?? "all"}
      onChange={(v) => set({ time: v === "all" ? undefined : v })}
      options={[
        { id: "all" as const, label: "All", icon: <IconAll />, title: "Any time of day" },
        ...WEAR_TIMES.map((t) => ({ id: t.id, label: t.short, icon: TIME_ICONS[t.id], title: t.label })),
      ]}
    />
  );
  const weather = (
    <Segmented
      label="Weather"
      value={filter.weather ?? "all"}
      onChange={(v) => set({ weather: v === "all" ? undefined : v })}
      options={[
        { id: "all" as const, label: "Any", icon: <IconAnyWeather />, title: "Any weather" },
        ...WEATHERS.map((w) => ({ id: w.id, label: w.id === "warm" ? "Warm" : "Cold", icon: WEATHER_ICONS[w.id], title: w.label })),
      ]}
    />
  );

  const gender = (
    <Segmented
      label="For"
      value={filter.gender ?? "all"}
      onChange={(v) => set({ gender: v === "all" ? undefined : v })}
      options={[{ id: "all" as const, label: "All", title: "Everyone" }, ...GENDERS.map((g) => ({ id: g.id, label: g.label, title: g.title }))]}
    />
  );

  if (!full) {
    return (
      <div className="space-y-4">
        {gender}
        {time}
        {weather}
      </div>
    );
  }

  return (
    <div className="space-y-5">
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
      <div className="grid gap-4 md:grid-cols-[minmax(0,4fr)_minmax(0,3fr)]">
        {time}
        {weather}
      </div>
      <div className="flex flex-wrap items-end gap-x-6 gap-y-4">
        <div className="w-full sm:w-80">{gender}</div>
        <div className="space-y-2">
          <p className="label-caps text-[0.625rem] text-muted">Counts toward</p>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(DEALS) as DealFilter[]).map((d) => {
              const on = filter.deal === d;
              return (
                <button
                  key={d}
                  type="button"
                  aria-pressed={on}
                  aria-label={DEALS[d].short}
                  onClick={() => set({ deal: on ? undefined : d })}
                  className={`flex min-h-12 items-center gap-2 rounded-md border px-3.5 transition-colors duration-300 ${
                    on ? "border-hibiscus text-hibiscus" : "border-line text-muted hover:border-ink hover:text-ink"
                  }`}
                >
                  {DEAL_ICONS[d]}
                  <span className="label-caps text-[0.5625rem] tracking-[0.16em]">{DEAL_SHORT[d]}</span>
                </button>
              );
            })}
          </div>
        </div>
        {active && (
          <button type="button" className="min-h-12 text-sm text-muted underline underline-offset-4 hover:text-ink" onClick={() => onChange({})}>
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
}

/**
 * Phones: every filter as one swipeable row of chips, so the scents start
 * near the top of the screen. Tap a chip to filter, tap it again to clear.
 * Desktop keeps the labelled trays above.
 */
function FilterChips({ filter, onChange, full }: { filter: ShelfFilter; onChange: (f: ShelfFilter) => void; full: boolean }) {
  type Chip = { key: string; label: string; icon?: React.ReactNode; on: boolean; toggle: () => void };
  const chip = <K extends keyof ShelfFilter>(field: K, value: NonNullable<ShelfFilter[K]>, label: string, icon?: React.ReactNode): Chip => ({
    key: `${field}-${value}`,
    label,
    icon,
    on: filter[field] === value,
    toggle: () => onChange({ ...filter, [field]: filter[field] === value ? undefined : value }),
  });
  const groups: Chip[][] = [
    GENDERS.map((g) => chip("gender", g.id, g.label)),
    WEAR_TIMES.map((t) => chip("time", t.id, t.short, TIME_ICONS[t.id])),
    WEATHERS.map((w) => chip("weather", w.id, w.id === "warm" ? "Warm" : "Cold", WEATHER_ICONS[w.id])),
    ...(full ? [(Object.keys(DEALS) as DealFilter[]).map((d) => chip("deal", d, DEAL_SHORT[d], DEAL_ICONS[d]))] : []),
  ];
  const active = Object.entries(filter).some(([k, v]) => v && k !== "query");
  return (
    <div role="group" aria-label="Filter scents" className="no-scrollbar -mx-4 flex items-center gap-2 overflow-x-auto px-4 pb-1">
      {groups.map((g, gi) => (
        <div key={gi} className="flex shrink-0 items-center gap-2">
          {gi > 0 && <span aria-hidden className="mx-1 h-5 w-px bg-line" />}
          {g.map((c) => (
            <button
              key={c.key}
              type="button"
              aria-pressed={c.on}
              onClick={c.toggle}
              className={`flex h-9 shrink-0 items-center gap-1.5 rounded-full border px-3.5 transition-colors duration-300 [&_svg]:h-4 [&_svg]:w-4 ${
                c.on ? "border-inverse bg-inverse text-on-inverse" : "border-line text-muted hover:border-ink hover:text-ink"
              }`}
            >
              {c.icon}
              <span className="label-caps text-[0.625rem] tracking-[0.14em]">{c.label}</span>
            </button>
          ))}
        </div>
      ))}
      {active && (
        <button type="button" onClick={() => onChange({ query: filter.query })} className="ml-1 h-9 shrink-0 px-2 text-sm text-muted underline underline-offset-4">
          Clear
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
          <GenderTag product={p} className="border-line text-ink" />
        </div>
        <span className="line-clamp-2 text-sm leading-snug text-muted">
          <span className="text-ink/80">{p.house}.</span> {p.blurb}
        </span>
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
          <GenderTag product={p} className="absolute left-3 top-3 border-paper/25 text-paper/80" />
        </Link>
        <div className="space-y-2 px-4 pb-4">
          <p className="truncate text-[0.9375rem] font-medium leading-tight">{p.name}</p>
          <div className="flex items-center justify-between gap-2">
            <p className="label-caps min-w-0 text-[0.625rem] tracking-[0.1em] text-pearl-ink-quiet tabular-nums">
              <span className="block whitespace-nowrap">{live ? `From ${formatTtd(priceFor(p.tier, 5))}` : STOCK_LABELS[p.stock]}</span>
              {live && p.sealed && (
                <span className="mt-0.5 flex items-center gap-1 whitespace-nowrap text-paper">
                  <IconBottle size={12} />
                  Bottle {formatTtd(p.sealed.price)}
                </span>
              )}
            </p>
            {live && (
              <button
                type="button"
                aria-expanded={flipped}
                aria-label={`Sizes and prices for ${p.name}`}
                onClick={() => setFlipped(true)}
                className="label-caps min-h-11 shrink-0 rounded-md border border-paper/25 px-2.5 text-[0.625rem] tracking-[0.16em] text-paper hover:border-paper"
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
   * the intro and the deals; on phones the chip row sits above the scents.
   */
  intro?: React.ReactNode;
  deals?: React.ReactNode;
}) {
  const [filter, setFilter] = useState<ShelfFilter>(initial);
  const filters = <ShelfFilters filter={filter} onChange={setFilter} full={full} />;
  const chips = <FilterChips filter={filter} onChange={setFilter} full={full} />;
  const search = (
    <label className="block">
      <span className="sr-only">Search scents</span>
      <input
        type="search"
        value={filter.query ?? ""}
        onChange={(e) => setFilter({ ...filter, query: e.target.value || undefined })}
        placeholder="Search a name, a note, or a vibe"
        className="field"
      />
    </label>
  );
  if (intro || deals) {
    return (
      <div className="grid grid-cols-[minmax(0,1fr)] gap-8 md:grid-cols-[19rem_minmax(0,1fr)] md:gap-10 lg:grid-cols-[22rem_minmax(0,1fr)] lg:gap-14">
        <aside className="space-y-7 md:sticky md:top-20 md:self-start">
          {intro}
          <div className="hidden md:block">{filters}</div>
          {deals}
        </aside>
        <section aria-label="The scents" className="min-w-0 space-y-6">
          <div className="space-y-3 md:hidden">
            {search}
            {chips}
          </div>
          <ShelfResults products={products} filter={filter} emptyHint={emptyHint} />
        </section>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      <div className="hidden md:block">{filters}</div>
      <div className="space-y-3 md:hidden">
        {search}
        {chips}
      </div>
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
