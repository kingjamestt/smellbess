import Link from "next/link";
import type { ProductView } from "@/lib/catalog";
import { OFFER_RULES, setPrice } from "@/lib/offers";
import { formatTtd } from "@/lib/pricing";
import { countsToward } from "@/lib/shelf";

/**
 * The offers, shown under the shelf on the homepage. Each one links to the scents that count toward it.
 */
export function Deals({
  products,
  setCount,
  setFrom,
  layout = "stack",
}: {
  products: ProductView[];
  setCount: number;
  setFrom: number;
  layout?: "stack" | "row";
}) {
  const bundle = products.filter((p) => countsToward(p, "bundle")).length;
  const free = products.filter((p) => countsToward(p, "free-5ml")).length;
  const rows = [
    {
      figure: `${OFFER_RULES.bundle.count} for ${OFFER_RULES.bundle.price}`,
      text: `${OFFER_RULES.bundle.count} selected 10ml decants for ${formatTtd(OFFER_RULES.bundle.price)}.`,
      href: "/scents?deal=bundle",
      link: `The ${bundle} that count`,
    },
    {
      figure: "+5ml",
      text: "Grab three decants of 10ml or more and we throw in a 5ml of our choosing.",
      href: "/scents?deal=free-5ml",
      link: `The ${free} that count`,
    },
    {
      figure: "Sets",
      text: `${setCount} curated sets in a gift box, from ${formatTtd(setFrom)}.`,
      href: "/sets",
      link: "See the sets",
    },
  ];
  return (
    <section aria-labelledby="deals-title" className="rounded-xl border border-line">
      <h2 id="deals-title" className="sr-only">
        Deals
      </h2>
      <ul className={layout === "row" ? "grid divide-y divide-line md:grid-cols-3 md:divide-x md:divide-y-0" : "divide-y divide-line"}>
        {rows.map((r, i) => (
          <li key={r.href} className={i === 2 && layout === "stack" ? "hidden md:block" : undefined}>
            <Link href={r.href} className="group flex items-start gap-4 px-4 py-3.5 hover:bg-mist">
              <span className="wide w-[4.75rem] shrink-0 pt-0.5 text-base font-light uppercase tracking-[0.06em] text-ink">{r.figure}</span>
              <span className="flex min-w-0 flex-col gap-1">
                <span className="text-[0.9375rem] leading-snug">{r.text}</span>
                <span className="text-sm text-hibiscus underline underline-offset-4 group-hover:no-underline">{r.link}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <p className="border-t border-line px-4 py-3 text-xs text-muted">One offer per order. The cart picks the best one for you.</p>
    </section>
  );
}

/** The cheapest way into a set: the lowest 3×5ml price. */
export const setsFrom = (sets: { price?: Record<5 | 10, number> }[]) =>
  sets.length ? Math.min(...sets.map((s) => setPrice(s, 5))) : OFFER_RULES.sets[5];
