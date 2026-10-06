import Link from "next/link";
import { ScentArt } from "@/components/scent-art";
import { ScentTile } from "@/components/scent-tile";
import { SITE } from "@/config/site";
import type { ProductView } from "@/lib/catalog";
import { getCatalog } from "@/lib/server";

export const dynamic = "force-dynamic";

const steps = (pickupDay: string) => [
  { title: "Pick your scents", text: "5ml to try, 10ml to wear, 15ml for regulars." },
  { title: "Place the order", text: "See the full price, delivery included, before you commit." },
  { title: "Send it on WhatsApp", text: "One tap. We confirm stock and reply." },
  { title: "Pay and collect", text: `Bank transfer, or cash at ${pickupDay} pickup.` },
];

/** Three scents for the hero: one for him, one for her, one more. In-stock first. */
function heroPicks(products: ProductView[]) {
  const ranked = [...products.filter((p) => p.stock === "in_stock"), ...products.filter((p) => p.stock !== "in_stock")];
  const picks: ProductView[] = [];
  for (const g of ["him", "her", "unisex"] as const) {
    const p = ranked.find((x) => x.gender === g && !picks.includes(x));
    if (p) picks.push(p);
  }
  for (const p of ranked) if (picks.length < 3 && !picks.includes(p)) picks.push(p);
  return picks.slice(0, 3);
}

// Fanned like a hand of cards: left, right, then the middle one on top.
const FAN = ["-rotate-6 translate-y-4", "rotate-6 translate-y-4", "z-10 -translate-y-1"];
const FAN_ORDER = ["order-1", "order-3", "order-2"];

export default async function Home() {
  const { products, sets, delivery } = await getCatalog();
  const STEPS = steps(delivery.pickupDay);
  const picks = heroPicks(products);
  const inStock = products.filter((p) => p.stock === "in_stock");
  const notInHero = inStock.filter((p) => !picks.includes(p));
  const featured = (notInHero.length >= 4 ? notInHero : inStock).slice(0, 4);

  return (
    <div>
      <section className="hero overflow-hidden">
        <div className="container-page grid items-center gap-10 py-10 sm:py-14 md:grid-cols-[1.15fr_1fr] md:py-16">
          <div className="hero-in">
            <p className="hero-sticker mb-4 inline-block rounded-full bg-sun px-3 py-1 text-sm font-bold text-on-sun">
              Decants made in T&amp;T
            </p>
            <h1 className="text-4xl font-extrabold leading-[1.02] sm:text-5xl lg:text-6xl">
              Only the <span className="text-[var(--hero-accent)]">bess</span> scents. No duds.
            </h1>
            <p className="mt-4 max-w-md text-lg opacity-85">
              Strong performers and proven compliment-getters, tested in TT heat. Decanted by hand from authentic
              bottles.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/scents" className="btn-primary">
                Shop scents
              </Link>
              <Link href="/sets" className="btn border-2 border-current hover:bg-white/10">
                Curated sets
              </Link>
            </div>
          </div>

          {picks.length > 0 && (
            // TODO(M3): swap for a real photo of our decants once it's shot (1600×1200).
            <ul aria-label="A few of our scents" className="hero-in hero-in-late flex justify-center px-4 pb-4 md:px-0">
              {picks.map((p, i) => (
                <li key={p.id} className={`-mx-2 w-1/3 max-w-[190px] sm:-mx-3 ${FAN_ORDER[i]}`}>
                  <Link
                    href={`/scents/${p.id}`}
                    className={`card fan-card block overflow-hidden text-ink ${FAN[i]}`}
                  >
                    <ScentArt hue={p.hue} label={`${p.house} ${p.name}`} className="aspect-[4/5] w-full" />
                    <span className="block truncate px-2 py-2 text-center text-xs font-bold sm:text-sm">
                      {p.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section aria-label="Prices and delivery" className="border-b border-line bg-mist">
        <dl className="container-page grid grid-cols-3 divide-x divide-line py-5 text-center sm:py-6">
          <div className="px-2">
            <dt className="text-xs text-muted sm:text-sm">5ml from</dt>
            <dd className="font-display text-xl font-extrabold sm:text-3xl">TT$60</dd>
          </div>
          <div className="px-2">
            <dt className="text-xs text-muted sm:text-sm">{delivery.pickupDay} pickup</dt>
            <dd className="font-display text-xl font-extrabold sm:text-3xl">Free</dd>
          </div>
          <div className="px-2">
            <dt className="text-xs text-muted sm:text-sm">Delivery from</dt>
            <dd className="font-display text-xl font-extrabold sm:text-3xl">TT$30</dd>
          </div>
        </dl>
      </section>

      {featured.length > 0 && (
        <section aria-labelledby="featured" className="container-page py-12">
          <div className="mb-5 flex items-end justify-between gap-2">
            <h2 id="featured" className="text-2xl font-extrabold sm:text-3xl">
              In stock now
            </h2>
            <Link href="/scents" className="font-semibold text-hibiscus underline underline-offset-4">
              Shop scents
            </Link>
          </div>
          <ul className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
            {featured.map((p) => (
              <li key={p.id} className="flex">
                <ScentTile product={p} />
              </li>
            ))}
          </ul>
        </section>
      )}

      <section aria-labelledby="offers" className="container-page py-6">
        <h2 id="offers" className="text-2xl font-extrabold sm:text-3xl">
          Deals that make sense
        </h2>
        <p className="mb-5 text-muted">One offer per order. We pick the best one for you automatically.</p>
        <div className="grid gap-3 sm:gap-4 md:grid-cols-[1.3fr_1fr] md:grid-rows-2">
          <div className="deal flex flex-col justify-between gap-6 bg-hibiscus p-6 text-on-hibiscus md:row-span-2 md:p-8">
            <p className="font-display text-6xl font-extrabold leading-none sm:text-7xl">5×10ml</p>
            <div>
              <p className="font-display text-3xl font-extrabold">TT$350</p>
              <p className="mt-2 max-w-sm opacity-90">
                Any five Arabian 10ml decants. That&apos;s TT$150 off. Want ten? Two bundles, TT$700.
              </p>
            </div>
          </div>
          <div className="deal bg-sun p-5 text-on-sun">
            <p className="font-display text-2xl font-extrabold">Free surprise 5ml</p>
            <p className="mt-1 text-sm">
              Get 3 or more decants of 10ml or bigger and we add a 5ml we picked for you.
            </p>
          </div>
          <div className="card flex flex-col gap-3 p-5">
            <div>
              <p className="font-display text-2xl font-extrabold">Sets from TT$150</p>
              <p className="mt-1 text-sm text-muted">Three scents we picked for the occasion, in a gift box.</p>
            </div>
            {sets.length > 0 && (
              <ul className="flex flex-wrap gap-2">
                {sets.map((s) => (
                  <li key={s.id} className="chip">
                    {s.name}
                  </li>
                ))}
              </ul>
            )}
            <Link href="/sets" className="mt-auto font-semibold text-hibiscus underline underline-offset-4">
              Curated sets
            </Link>
          </div>
        </div>
      </section>

      <section aria-labelledby="how" className="container-page grid gap-6 py-12 md:grid-cols-[1fr_1.4fr] md:gap-12">
        <div>
          <h2 id="how" className="text-2xl font-extrabold sm:text-3xl">
            How it works
          </h2>
          <p className="mt-2 max-w-sm text-muted">
            Your order comes to us on WhatsApp and we take it from there.
          </p>
          <a href={`https://wa.me/${SITE.whatsappNumber}`} rel="noopener" className="btn-whatsapp mt-5">
            Questions? WhatsApp us
          </a>
        </div>
        <ol className="divide-y divide-line">
          {STEPS.map((s, i) => (
            <li key={s.title} className="flex gap-4 py-4 first:pt-0 last:pb-0">
              <span aria-hidden className="font-display w-8 shrink-0 text-3xl font-extrabold leading-none text-hibiscus">
                {i + 1}
              </span>
              <div>
                <p className="font-bold">{s.title}</p>
                <p className="text-sm text-muted">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
