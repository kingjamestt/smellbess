import Link from "next/link";
import { Deals, setsFrom } from "@/components/deals";
import { ScentPhoto } from "@/components/scent-photo";
import { Shelf } from "@/components/shelf";
import { fullName } from "@/lib/shelf";
import { SITE } from "@/config/site";
import { formatTtd } from "@/lib/pricing";
import { setPrice } from "@/lib/offers";
import { getCatalog } from "@/lib/server";

export const dynamic = "force-dynamic";

export default async function Home() {
  const { products, sets, delivery } = await getCatalog();
  const live = products.filter((p) => p.status === "live");
  const bottles = live.filter((p) => p.sealed).length;

  return (
    <div className="container-page pb-6 pt-8 md:pt-12">
      <Shelf
        products={live}
        intro={
          <div className="space-y-5">
            <h1 className="wordmark text-[2.125rem] leading-[1.12] lg:text-[3.25rem]">
              Only
              <br className="hidden md:block" /> the best.
            </h1>
            <span aria-hidden className="block h-0.5 w-14 bg-hibiscus" />
            <p className="max-w-md text-[0.9375rem] leading-relaxed text-muted md:text-base">
              We ONLY carry 10/10 (or close) fragrances for men and women, with our main focus on quality of scent,
              affordability and customer service. Our website automatically applies{" "}
              <a href="#deals" className="text-ink underline decoration-hibiscus underline-offset-4 hover:text-hibiscus">
                discounts and deals
              </a>
              . Decants from {formatTtd(60)}
              {bottles > 0 ? ", full bottles while they last." : "."}
            </p>
          </div>
        }
      />

      <div id="deals" className="mt-12 scroll-mt-24">
        <Deals products={live} setCount={sets.length} setFrom={setsFrom(sets)} layout="row" />
      </div>

      <section aria-labelledby="sets-title" className="mt-16 border-t border-line pt-10">
        <div className="flex items-baseline justify-between gap-4">
          <h2 id="sets-title" className="wordmark text-xl lg:text-2xl">
            The sets
            <span aria-hidden className="mt-3 block h-0.5 w-10 bg-hibiscus" />
          </h2>
          <Link href="/sets" className="text-sm text-muted underline underline-offset-4 hover:text-ink">
            See the sets
          </Link>
        </div>
        <p className="mt-3 max-w-xl text-muted">Can&apos;t decide? We did the picking for you. Three scents for the occasion, in a gift box with a card for each.</p>
        <ul className="mt-6 grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {sets.map((s) => (
            <li key={s.id} className="bg-paper">
              <Link href={`/sets#${s.id}`} className="flex h-full flex-col gap-3 p-5 hover:bg-mist">
                <span className="grid grid-cols-3 gap-1.5" aria-hidden>
                  {s.productIds.map((id) => {
                    const p = products.find((x) => x.id === id);
                    return p ? <ScentPhoto key={id} product={p} sizes="80px" className="aspect-[4/5]" inset="p-[6%]" /> : null;
                  })}
                </span>
                <span className="text-lg font-medium">{s.name}</span>
                <span className="text-sm text-muted">
                  {s.productIds.map((id) => products.find((p) => p.id === id)).filter((p) => p !== undefined).map(fullName).join(", ")}
                </span>
                <span className="label-caps mt-auto pt-3 text-hibiscus tabular-nums">
                  3×5ml {formatTtd(setPrice(s, 5))} · 3×10ml {formatTtd(setPrice(s, 10))}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="how-title" className="mt-16 grid gap-6 border-t border-line pt-10 md:grid-cols-[19rem_minmax(0,1fr)] md:gap-10 lg:grid-cols-[22rem_minmax(0,1fr)] lg:gap-14">
        <div className="space-y-4">
          <h2 id="how-title" className="wordmark text-xl lg:text-2xl">
            How ordering works
            <span aria-hidden className="mt-3 block h-0.5 w-10 bg-hibiscus" />
          </h2>
          <a href={`https://wa.me/${SITE.whatsappNumber}`} rel="noopener" className="btn-secondary">
            Ask us on WhatsApp
          </a>
        </div>
        <ol className="grid gap-x-10 gap-y-6 sm:grid-cols-2">
          {[
            ["Choose", "A 5ml to try it out, a 10ml to wear it, a 15ml if you can't stop. Or grab a brand new full bottle."],
            ["See the full price", "Delivery added and the best deal applied for you. No surprises."],
            ["Send it on WhatsApp", "One tap sends your order to us. We check stock and reply right there."],
            ["Pay, then collect", `Bank transfer, or cash at ${delivery.pickupDay} pickup.`],
          ].map(([title, text], i) => (
            <li key={title} className="flex gap-4">
              <span aria-hidden className="wide w-5 shrink-0 text-sm text-hibiscus tabular-nums">
                {i + 1}
              </span>
              <div>
                <p className="font-medium">{title}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted">{text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
