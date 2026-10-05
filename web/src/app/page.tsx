import Link from "next/link";
import { ScentTile } from "@/components/scent-tile";
import { SITE } from "@/config/site";
import { getCatalog } from "@/lib/server";

export const dynamic = "force-dynamic";

const OFFERS = [
  { big: "5×10ml", small: "for TT$350", text: "Any five Arabian 10ml decants. Save TT$150." },
  { big: "Free 5ml", small: "you pick", text: "Get 3 or more Arabian decants of 10ml or bigger." },
  { big: "Sets", small: "from TT$150", text: "Three we picked for the fete, the office or date night." },
];

const STEPS = [
  { n: "1", title: "Pick your scents", text: "5ml to try, 10ml to wear, 15ml for regulars." },
  { n: "2", title: "Place the order", text: "See the full price, delivery included, before you commit." },
  { n: "3", title: "Send it on WhatsApp", text: "One tap. We confirm stock and reply." },
  { n: "4", title: "Pay and collect", text: `Bank transfer, or cash at ${SITE.pickupDay} pickup.` },
];

export default async function Home() {
  const { products } = await getCatalog();
  const featured = products.filter((p) => p.stock === "in_stock").slice(0, 4);

  return (
    <div>
      <section className="bg-ink text-paper">
        <div className="container-page py-10 sm:py-16">
          <p className="mb-3 inline-block rounded-full bg-sun px-3 py-1 text-sm font-bold text-ink">
            Decants made in T&amp;T
          </p>
          <h1 className="max-w-2xl text-4xl font-extrabold leading-[1.05] sm:text-6xl">
            Only the <span className="text-sun">bess</span> scents. No duds.
          </h1>
          <p className="mt-4 max-w-xl text-lg text-paper/85">
            Strong performers and proven compliment-getters, tested in TT heat. Decanted by hand from authentic
            bottles in 5ml, 10ml and 15ml.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/scents" className="btn-primary">
              Shop scents
            </Link>
            <Link href="/sets" className="btn border-2 border-paper text-paper hover:bg-paper/10">
              Curated sets
            </Link>
          </div>
          <p className="mt-6 text-sm text-paper/70">
            From TT$60 a 5ml · Free {SITE.pickupDay} pickup · Delivery anywhere in T&amp;T from TT$30
          </p>
        </div>
      </section>

      <section aria-labelledby="offers" className="container-page py-10">
        <h2 id="offers" className="text-2xl font-extrabold sm:text-3xl">
          Deals that make sense
        </h2>
        <p className="mb-4 text-muted">One offer per order. We pick the best one for you automatically.</p>
        <ul className="grid gap-3 sm:grid-cols-3">
          {OFFERS.map((o) => (
            <li key={o.big} className="card p-4">
              <p className="font-display text-3xl font-extrabold text-hibiscus">{o.big}</p>
              <p className="font-semibold">{o.small}</p>
              <p className="mt-1 text-sm text-muted">{o.text}</p>
            </li>
          ))}
        </ul>
      </section>

      {featured.length > 0 && (
        <section aria-labelledby="featured" className="container-page py-4">
          <div className="mb-4 flex items-end justify-between gap-2">
            <h2 id="featured" className="text-2xl font-extrabold sm:text-3xl">
              In stock now
            </h2>
            <Link href="/scents" className="font-semibold text-hibiscus underline">
              See all
            </Link>
          </div>
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {featured.map((p) => (
              <li key={p.id} className="flex">
                <ScentTile product={p} />
              </li>
            ))}
          </ul>
        </section>
      )}

      <section aria-labelledby="how" className="container-page py-10">
        <h2 id="how" className="mb-4 text-2xl font-extrabold sm:text-3xl">
          How it works
        </h2>
        <ol className="grid gap-3 sm:grid-cols-4">
          {STEPS.map((s) => (
            <li key={s.n} className="card p-4">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-sun font-bold">
                {s.n}
              </span>
              <p className="mt-2 font-bold">{s.title}</p>
              <p className="text-sm text-muted">{s.text}</p>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
