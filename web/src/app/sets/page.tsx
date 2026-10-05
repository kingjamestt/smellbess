import type { Metadata } from "next";
import Link from "next/link";
import { DraftBadge } from "@/components/badges";
import { ScentArt } from "@/components/scent-art";
import { SetButtons } from "@/components/set-buttons";
import { setPrice } from "@/lib/offers";
import { getCatalog } from "@/lib/server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Curated sets",
  description: "Three scents we picked for the occasion, in a gift box: 3×5ml from TT$150 or 3×10ml from TT$280.",
};

export default async function SetsPage() {
  const { sets, products } = await getCatalog();
  const byId = new Map(products.map((p) => [p.id, p]));

  return (
    <div className="container-page py-6">
      <h1 className="text-3xl font-extrabold sm:text-4xl">Curated sets</h1>
      <p className="mb-6 mt-1 max-w-prose text-muted">
        Not sure where to start? We picked three for the occasion. Gift box and scent cards included.{" "}
        <strong className="text-ink">3×5ml from TT$150</strong> or{" "}
        <strong className="text-ink">3×10ml from TT$280</strong>, less than buying them separately. One offer
        per order.
      </p>
      <ul className="grid gap-4 sm:grid-cols-2">
        {sets.map((set) => (
          <li key={set.id} className="card space-y-3 p-4">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-extrabold">{set.name}</h2>
              {set.draft && <DraftBadge />}
            </div>
            <p className="text-muted">{set.description}</p>
            <ul className="grid grid-cols-3 gap-2">
              {set.productIds.map((id) => {
                const p = byId.get(id);
                if (!p) return null;
                return (
                  <li key={id}>
                    <Link href={`/scents/${id}`} className="block text-center text-xs font-semibold">
                      <ScentArt
                        hue={p.hue}
                        label={`${p.house} ${p.name}`}
                        className="mb-1 aspect-square w-full rounded-xl"
                      />
                      {p.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
            {set.sizes[5] || set.sizes[10] ? (
              <SetButtons
                setId={set.id}
                sizes={set.sizes}
                prices={{ 5: setPrice(set, 5), 10: setPrice(set, 10) }}
              />
            ) : (
              <p className="text-sm font-semibold text-muted">Not available right now: one of these scents is low.</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
