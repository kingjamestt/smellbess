"use client";

import { useMemo, useState } from "react";
import type { ProductView } from "@/lib/catalog";
import type { Gender, Occasion, Vibe } from "@/lib/types";
import { ScentTile } from "./scent-tile";

const GENDERS: { id: Gender | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "him", label: "Him" },
  { id: "her", label: "Her" },
  { id: "unisex", label: "Unisex" },
];
const OCCASIONS: { id: Occasion; label: string }[] = [
  { id: "fete", label: "Fete" },
  { id: "lime", label: "Lime" },
  { id: "office", label: "Office" },
  { id: "date", label: "Date" },
];

function toggle<T>(list: T[], item: T): T[] {
  return list.includes(item) ? list.filter((i) => i !== item) : [...list, item];
}

export function CatalogBrowser({ products }: { products: ProductView[] }) {
  const [gender, setGender] = useState<Gender | "all">("all");
  const [occasions, setOccasions] = useState<Occasion[]>([]);
  const [vibes, setVibes] = useState<Vibe[]>([]);
  const [query, setQuery] = useState("");

  const allVibes = useMemo(
    () => [...new Set(products.flatMap((p) => p.vibes))].sort() as Vibe[],
    [products],
  );

  const q = query.trim().toLowerCase();
  const matches = products.filter((p) => {
    if (gender !== "all" && p.gender !== gender) return false;
    if (occasions.length && !occasions.some((o) => p.occasions.includes(o))) return false;
    if (vibes.length && !vibes.some((v) => p.vibes.includes(v))) return false;
    if (q) {
      const haystack = [
        p.house,
        p.name,
        p.variant,
        ...p.smellsLike,
        ...p.notes.top,
        ...p.notes.heart,
        ...p.notes.base,
        ...p.vibes,
      ]
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });
  const shop = matches.filter((p) => p.status === "live");
  const soon = matches.filter((p) => p.status === "coming_soon");
  const filtered = gender !== "all" || occasions.length > 0 || vibes.length > 0 || q !== "";

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <label className="block">
          <span className="label">Search by name, note or &ldquo;smells like&rdquo;</span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. Angels' Share, vanilla, Khamrah"
            className="field"
          />
        </label>
        <fieldset>
          <legend className="label">Who&apos;s wearing it</legend>
          <div className="flex flex-wrap gap-2">
            {GENDERS.map((g) => (
              <button
                key={g.id}
                type="button"
                aria-pressed={gender === g.id}
                onClick={() => setGender(g.id)}
                className={`chip ${gender === g.id ? "chip-on" : ""}`}
              >
                {g.label}
              </button>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend className="label">Where you&apos;re going</legend>
          <div className="flex flex-wrap gap-2">
            {OCCASIONS.map((o) => (
              <button
                key={o.id}
                type="button"
                aria-pressed={occasions.includes(o.id)}
                onClick={() => setOccasions(toggle(occasions, o.id))}
                className={`chip ${occasions.includes(o.id) ? "chip-on" : ""}`}
              >
                {o.label}
              </button>
            ))}
          </div>
        </fieldset>
        <details className="group">
          <summary className="label cursor-pointer select-none">
            Vibe {vibes.length > 0 ? `(${vibes.length})` : ""}
            <span className="ml-1 font-normal text-muted group-open:hidden">· show</span>
          </summary>
          <div className="flex flex-wrap gap-2 pt-1">
            {allVibes.map((v) => (
              <button
                key={v}
                type="button"
                aria-pressed={vibes.includes(v)}
                onClick={() => setVibes(toggle(vibes, v))}
                className={`chip capitalize ${vibes.includes(v) ? "chip-on" : ""}`}
              >
                {v}
              </button>
            ))}
          </div>
        </details>
        {filtered && (
          <button
            type="button"
            className="text-sm font-semibold text-hibiscus underline"
            onClick={() => {
              setGender("all");
              setOccasions([]);
              setVibes([]);
              setQuery("");
            }}
          >
            Clear filters
          </button>
        )}
      </div>

      <section aria-labelledby="shop-now">
        <h2 id="shop-now" className="mb-3 text-2xl font-extrabold">
          Shop now <span className="text-base font-semibold text-muted">({shop.length})</span>
        </h2>
        {shop.length === 0 ? (
          <p className="text-muted">Nothing matches that yet. Try fewer filters.</p>
        ) : (
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {shop.map((p) => (
              <li key={p.id} className="flex">
                <ScentTile product={p} />
              </li>
            ))}
          </ul>
        )}
      </section>

      {soon.length > 0 && (
        <section aria-labelledby="coming-soon">
          <h2 id="coming-soon" className="mb-1 text-2xl font-extrabold">
            Coming soon
          </h2>
          <p className="mb-3 text-sm text-muted">Approved for the Bess List and on the way in a future drop.</p>
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {soon.map((p) => (
              <li key={p.id} className="flex">
                <ScentTile product={p} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
