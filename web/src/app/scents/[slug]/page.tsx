import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DraftBadge, StockBadge } from "@/components/badges";
import { ScentArt } from "@/components/scent-art";
import { genderLabel } from "@/components/scent-tile";
import { SizePicker } from "@/components/size-picker";
import { SITE } from "@/config/site";
import { formatTtd, priceFor, TIER_LABELS } from "@/lib/pricing";
import { getCatalog } from "@/lib/server";
import type { Occasion, Ratings } from "@/lib/types";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { products } = await getCatalog();
  const p = products.find((x) => x.id === slug);
  if (!p) return { title: "Scent not found" };
  return {
    title: `${p.house} ${p.name} decant`,
    description: `${p.house} ${p.name} decants in Trinidad: 5ml ${formatTtd(priceFor(p.tier, 5))}, 10ml ${formatTtd(priceFor(p.tier, 10))}, 15ml ${formatTtd(priceFor(p.tier, 15))}.`,
  };
}

const RATING_LABELS: Record<keyof Ratings, string> = {
  heat: "TT heat",
  longevity: "Longevity",
  projection: "Projection",
  compliments: "Compliments",
};
const OCCASION_LABELS: Record<Occasion, string> = { office: "Office", lime: "Lime", fete: "Fete", date: "Date" };

function RatingRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-28 text-sm font-semibold">{label}</span>
      <span className="flex gap-1" aria-hidden>
        {[1, 2, 3, 4, 5].map((i) => (
          <span key={i} className={`h-2.5 w-6 rounded-full ${i <= value ? "bg-hibiscus" : "bg-line"}`} />
        ))}
      </span>
      <span className="sr-only">
        {value} out of 5
      </span>
    </div>
  );
}

export default async function ScentPage({ params }: Props) {
  const { slug } = await params;
  const { products } = await getCatalog();
  const p = products.find((x) => x.id === slug);
  if (!p) notFound();

  const fullLabel = `${p.house} ${p.name}`;
  const hasNotes = p.notes.top.length + p.notes.heart.length + p.notes.base.length > 0;

  return (
    <div className="container-page py-6">
      <nav aria-label="Breadcrumb" className="mb-4 text-sm text-muted">
        <Link href="/scents" className="underline">
          All scents
        </Link>{" "}
        / {p.name}
      </nav>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="mx-auto w-full max-w-56 overflow-hidden rounded-3xl border border-line md:max-w-none">
          <ScentArt hue={p.hue} label={fullLabel} className="aspect-square w-full" />
        </div>

        <div className="space-y-5">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <StockBadge state={p.stock} />
              <span className="chip">{TIER_LABELS[p.tier]}</span>
              <span className="chip">{genderLabel(p)}</span>
              {p.draft && <DraftBadge />}
            </div>
            <p className="text-sm font-semibold uppercase tracking-wide text-muted">{p.house}</p>
            <h1 className="text-4xl font-extrabold leading-none">{p.name}</h1>
            {p.variant && <p className="text-muted">{p.variant}</p>}
            {p.smellsLike.length > 0 && (
              <p className="text-lg font-semibold">
                Smells like: <span className="text-hibiscus">{p.smellsLike.join(", ")}</span>
              </p>
            )}
            <p className="text-lg">{p.blurb}</p>
          </div>

          {p.stock === "in_stock" ? (
            <SizePicker productId={p.id} tier={p.tier} sizes={p.sizes} />
          ) : (
            <div className="card space-y-2 bg-mist p-4">
              <p className="font-semibold">
                {p.stock === "coming_soon"
                  ? "Coming soon."
                  : p.stock === "arriving"
                    ? "Arriving soon. The bottle is on its way."
                    : "Sold out for now. We're restocking."}
              </p>
              <p className="text-sm text-muted">
                Prices when it lands: 5ml {formatTtd(priceFor(p.tier, 5))} · 10ml {formatTtd(priceFor(p.tier, 10))}{" "}
                · 15ml {formatTtd(priceFor(p.tier, 15))}
              </p>
              <a
                className="btn-whatsapp"
                href={`https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(`Hi Smell Bess! Let me know when ${fullLabel} is in.`)}`}
                rel="noopener"
              >
                Tell me when it&apos;s in (WhatsApp)
              </a>
            </div>
          )}

          {p.tier === "A" && p.stock === "in_stock" && (
            <p className="rounded-xl bg-mist px-3 py-2 text-sm">
              Counts toward our offers: 5×10ml for TT$350, or a free 5ml with 3+ decants of 10ml or bigger. One offer
              per order.
            </p>
          )}
          {p.tier === "A+" && (
            <p className="rounded-xl bg-mist px-3 py-2 text-sm">
              Premium Arabian (Tier A+): not part of the bundle or free 5ml offers.
            </p>
          )}

          {p.ratings && (
            <section aria-labelledby="ratings" className="space-y-2">
              <h2 id="ratings" className="flex items-center gap-2 text-xl font-bold">
                Our ratings {p.draft && <DraftBadge />}
              </h2>
              {(Object.keys(RATING_LABELS) as (keyof Ratings)[]).map((k) => (
                <RatingRow key={k} label={RATING_LABELS[k]} value={p.ratings![k]} />
              ))}
            </section>
          )}

          {p.take && (
            <section aria-labelledby="take" className="card space-y-1 p-4">
              <h2 id="take" className="flex items-center gap-2 text-xl font-bold">
                {p.take.by === "him" ? "His take" : "Her take"} {p.draft && <DraftBadge />}
              </h2>
              <p className="text-lg">&ldquo;{p.take.text}&rdquo;</p>
            </section>
          )}

          <section aria-labelledby="notes" className="space-y-2">
            <h2 id="notes" className="flex items-center gap-2 text-xl font-bold">
              Notes {p.draft && <DraftBadge />}
            </h2>
            {hasNotes ? (
              <dl className="grid grid-cols-[5rem_1fr] gap-y-1 text-sm">
                {(["top", "heart", "base"] as const).map((k) =>
                  p.notes[k].length ? (
                    <div key={k} className="contents">
                      <dt className="font-semibold capitalize">{k}</dt>
                      <dd>{p.notes[k].join(", ")}</dd>
                    </div>
                  ) : null,
                )}
              </dl>
            ) : (
              <p className="text-sm text-muted">Notes coming soon.</p>
            )}
            <div className="flex flex-wrap gap-2 pt-1">
              {p.vibes.map((v) => (
                <span key={v} className="chip capitalize">
                  {v}
                </span>
              ))}
              {p.occasions.map((o) => (
                <span key={o} className="chip border-sea text-sea">
                  {OCCASION_LABELS[o]}
                </span>
              ))}
            </div>
          </section>

          <p className="border-t border-line pt-4 text-xs text-muted">{SITE.legal}</p>
        </div>
      </div>
    </div>
  );
}
