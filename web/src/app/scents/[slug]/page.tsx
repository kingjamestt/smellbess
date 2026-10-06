import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DraftBadge } from "@/components/badges";
import { Purchase } from "@/components/purchase";
import { ScentPhoto } from "@/components/scent-photo";
import { SITE } from "@/config/site";
import { formatTtd, priceFor } from "@/lib/pricing";
import { getCatalog } from "@/lib/server";
import { genderLabel, wearLabel } from "@/lib/shelf";
import { STOCK_LABELS } from "@/lib/stock";
import type { Occasion, Ratings } from "@/lib/types";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { products } = await getCatalog();
  const p = products.find((x) => x.id === slug);
  if (!p) return { title: "Scent not found" };
  const decants = `5ml ${formatTtd(priceFor(p.tier, 5))}, 10ml ${formatTtd(priceFor(p.tier, 10))}, 15ml ${formatTtd(priceFor(p.tier, 15))}`;
  const title = p.sealed ? `${p.house} ${p.name} Decants & Bottle in Trinidad` : `${p.house} ${p.name} Decant in Trinidad`;
  const description = `${p.house} ${p.name}: ${p.blurb} Decants ${decants}${p.sealed ? `, sealed bottle ${formatTtd(p.sealed.price)}` : ""}.`;
  return {
    title,
    description,
    alternates: { canonical: `/scents/${p.id}` },
    openGraph: { url: `/scents/${p.id}`, title: `${title} | Smell Bess`, description },
  };
}

const RATING_LABELS: Record<keyof Ratings, string> = {
  heat: "In TT heat",
  longevity: "Longevity",
  projection: "Projection",
  compliments: "Compliments",
};
const OCCASION_LABELS: Record<Occasion, string> = { office: "Office", lime: "Lime", fete: "Fete", date: "Date" };

export default async function ScentPage({ params }: Props) {
  const { slug } = await params;
  const { products } = await getCatalog();
  const p = products.find((x) => x.id === slug);
  if (!p) notFound();

  const fullLabel = `${p.house} ${p.name}`;
  const hasNotes = p.notes.top.length + p.notes.heart.length + p.notes.base.length > 0;
  const buyable = p.stock === "in_stock";
  const wear = wearLabel(p);
  const meta = `${p.house} · ${[wear, genderLabel(p)].filter(Boolean).join(", ").toLowerCase().replace(/^./, (c) => c.toUpperCase())}`;

  return (
    <div className="container-page pb-6 pt-5 md:pt-10">
      <nav aria-label="Breadcrumb" className="mb-5 text-sm text-muted">
        <Link href="/scents" className="underline underline-offset-4 hover:text-ink">
          The scents
        </Link>
        <span aria-hidden> / </span>
        <span aria-current="page">{p.name}</span>
      </nav>

      <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] md:gap-12 lg:gap-16">
        <div className="md:sticky md:top-20 md:self-start">
          <ScentPhoto
            product={p}
            sizes="(min-width: 768px) 45vw, 100vw"
            priority
            className="aspect-[5/4] w-full md:aspect-[4/5]"
            inset="p-[10%] md:p-[12%]"
          />
        </div>

        <div className="space-y-8">
          <header className="space-y-3">
            <h1 className="text-[2rem] font-medium leading-[1.05] lg:text-[2.75rem]">{p.name}</h1>
            <p className="text-muted">{meta}</p>
            {p.smellsLike.length > 0 && (
              <p>
                Smells like <span className="text-hibiscus">{p.smellsLike.join(", ")}</span>
                <span className="text-muted"> (our opinion)</span>
              </p>
            )}
            {p.inspiredBy && p.inspiredBy.length > 0 && (
              <p>
                Inspired by <span className="text-hibiscus">{p.inspiredBy.join(", ")}</span>
                <span className="text-muted"> (our opinion)</span>
              </p>
            )}
            <p className="max-w-prose text-lg leading-relaxed">
              {p.blurb} {p.draft && <DraftBadge className="align-middle" />}
            </p>
          </header>

          {buyable ? (
            <Purchase product={p} />
          ) : (
            <div className="space-y-3 rounded-md border border-line p-5">
              <p className="font-medium">
                {p.stock === "coming_soon" ? "Coming soon." : p.stock === "arriving" ? "Arriving soon. The bottle is on its way." : STOCK_LABELS[p.stock]}
              </p>
              <p className="text-sm text-muted tabular-nums">
                Decants when it lands: 5ml {formatTtd(priceFor(p.tier, 5))}, 10ml {formatTtd(priceFor(p.tier, 10))}, 15ml{" "}
                {formatTtd(priceFor(p.tier, 15))}
              </p>
              <a
                className="btn-secondary"
                href={`https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(`Hi Smell Bess, let me know when ${fullLabel} is in.`)}`}
                rel="noopener"
              >
                Tell me when it&apos;s in
              </a>
            </div>
          )}

          {p.take && (
            <figure className="border-l border-hibiscus pl-5">
              <blockquote className="text-xl leading-snug">&ldquo;{p.take.text}&rdquo;</blockquote>
              <figcaption className="mt-2 text-sm text-muted">
                {p.take.by === "him" ? "His take" : "Her take"} {p.draft && <DraftBadge className="ml-1" />}
              </figcaption>
            </figure>
          )}

          {p.ratings && (
            <section aria-labelledby="ratings" className="space-y-4">
              <h2 id="ratings" className="flex items-center gap-2 text-lg font-medium">
                Our ratings {p.draft && <DraftBadge />}
              </h2>
              <dl className="divide-y divide-line border-y border-line">
                {(Object.keys(RATING_LABELS) as (keyof Ratings)[]).map((k) => (
                  <div key={k} className="flex items-baseline justify-between gap-4 py-3">
                    <dt>{RATING_LABELS[k]}</dt>
                    <dd className="wide text-muted tabular-nums">
                      <span className="text-ink">{p.ratings![k]}</span> / 5
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          )}

          <section aria-labelledby="notes" className="space-y-4">
            <h2 id="notes" className="flex items-center gap-2 text-lg font-medium">
              Notes {p.draft && <DraftBadge />}
            </h2>
            {hasNotes ? (
              <dl className="divide-y divide-line border-y border-line">
                {(["top", "heart", "base"] as const).map((k) =>
                  p.notes[k].length ? (
                    <div key={k} className="grid grid-cols-[5.5rem_minmax(0,1fr)] gap-3 py-3">
                      <dt className="label-caps pt-0.5 text-muted">{k}</dt>
                      <dd>{p.notes[k].join(", ")}</dd>
                    </div>
                  ) : null,
                )}
              </dl>
            ) : (
              <p className="text-sm text-muted">We&apos;re writing up the notes.</p>
            )}
            {(p.vibes.length > 0 || p.occasions.length > 0) && (
              <ul className="flex flex-wrap gap-2" aria-label="Character and occasions">
                {p.vibes.map((v) => (
                  <li key={v} className="chip capitalize">
                    {v}
                  </li>
                ))}
                {p.occasions.map((o) => (
                  <li key={o} className="chip">
                    {OCCASION_LABELS[o]}
                  </li>
                ))}
              </ul>
            )}
          </section>

          <p className="border-t border-line pt-5 text-xs leading-relaxed text-muted">{SITE.legal}</p>
        </div>
      </div>
    </div>
  );
}
