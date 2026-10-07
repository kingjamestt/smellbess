import type { Metadata } from "next";
import { pageOpenGraph } from "@/config/site";
import Link from "next/link";
import { DraftBadge } from "@/components/badges";
import { ScentPhoto } from "@/components/scent-photo";
import { SetButtons } from "@/components/set-buttons";
import { formatTtd } from "@/lib/pricing";
import { OFFER_RULES, setPrice } from "@/lib/offers";
import { getCatalog } from "@/lib/server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Perfume Gift Sets",
  description:
    "Can't decide? We did the picking. Perfume gift sets in Trinidad: 3 scents for the fete, date night or the office, from TT$150. Gift box and card included.",
  alternates: { canonical: "/sets" },
  openGraph: pageOpenGraph("/sets"),
};

export default async function SetsPage() {
  const { sets, products } = await getCatalog();
  const byId = new Map(products.map((p) => [p.id, p]));

  return (
    <div className="container-page pb-6 pt-8 md:pt-12">
      <div className="max-w-2xl space-y-4">
        <h1 className="wordmark text-[1.75rem] leading-tight lg:text-[2.25rem]">The sets</h1>
        <span aria-hidden className="block h-0.5 w-14 bg-hibiscus" />
        <p className="text-muted">
          Can&apos;t decide? We did the picking for you. Three scents for the occasion, in a gift box with a card for each. 3×5ml from{" "}
          {formatTtd(OFFER_RULES.sets[5])} or 3×10ml from {formatTtd(OFFER_RULES.sets[10])}, less than buying them
          one by one. A set is the order&apos;s one offer.
        </p>
      </div>

      <ul className="mt-10 space-y-6">
        {sets.map((set) => (
          <li key={set.id} id={set.id} className="scroll-mt-24 border-t border-line pt-6 md:grid md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:gap-10 lg:gap-14">
            <ul className="grid grid-cols-3 gap-2 rounded-xl bg-mist p-2 sm:gap-3 sm:p-3" aria-label={`In the ${set.name}`}>
              {set.productIds.map((id) => {
                const p = byId.get(id);
                if (!p) return null;
                return (
                  <li key={id}>
                    <Link href={`/scents/${id}`} className="group block space-y-2">
                      <ScentPhoto product={p} sizes="(min-width: 768px) 16vw, 30vw" className="aspect-[4/5] w-full" />
                      <span className="block px-1 text-center leading-tight">
                        <span className="block text-xs text-muted">{p.house}</span>
                        <span className="block text-sm group-hover:text-hibiscus">{p.name}</span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
            <div className="mt-5 space-y-4 md:mt-0">
              <h2 className="flex items-center gap-3 text-2xl font-medium">
                {set.name} {set.draft && <DraftBadge />}
              </h2>
              <p className="leading-relaxed text-muted">{set.description}</p>
              {set.sizes[5] || set.sizes[10] ? (
                <SetButtons setId={set.id} sizes={set.sizes} prices={{ 5: setPrice(set, 5), 10: setPrice(set, 10) }} />
              ) : (
                <p className="text-sm text-muted">Not available right now. Each scent is still on its own page.</p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
