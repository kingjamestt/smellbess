import type { Metadata } from "next";
import Link from "next/link";
import { DraftBadge } from "@/components/badges";
import { SITE } from "@/config/site";

export const metadata: Metadata = {
  title: "Policies",
  description: "How Smell Bess handles orders, payment, delivery, authenticity, returns, pre-orders and your personal details.",
  alternates: { canonical: "/policies" },
  openGraph: { url: "/policies" },
};

// DRAFT: written from business-plan.md decisions. Returns, pre-order refunds and
// privacy wording are for the owners to confirm before launch.
const UPDATED = "7 October 2026";

const SECTIONS: { id: string; title: string; body: React.ReactNode }[] = [
  {
    id: "orders",
    title: "Orders and payment",
    body: (
      <>
        <p>
          Your order goes to us on WhatsApp. We confirm stock there, then send our bank details. Pay by bank transfer before
          we send your order out, or pay cash at pickup.
        </p>
        <p>
          Prices are in TTD. The best deal is applied for you automatically, one offer per order. Full bottles are not part of
          any offer.
        </p>
      </>
    ),
  },
  {
    id: "delivery",
    title: "Delivery and pickup",
    body: (
      <p>
        Pickup is free: the Saturday run, or some Tuesdays and Thursdays in Trincity. ODeliver courier goes anywhere in Trinidad &amp; Tobago, priced by zone at cost, and you see the
        price before you order. Stops, times and prices are on{" "}
        <Link href="/delivery" className="underline decoration-hibiscus underline-offset-4 hover:text-hibiscus">
          Delivery &amp; pickup
        </Link>
        .
      </p>
    ),
  },
  {
    id: "authenticity",
    title: "Authenticity",
    body: (
      <>
        <p>
          Every decant is poured by hand from an authentic bottle bought from a reputable retailer. Full bottles are brand new,
          boxed and in cellophane.
        </p>
        <p>
          Smell Bess is not affiliated with any brand. “Smells like” and “inspired by” are our opinion of a scent&apos;s
          profile, and brand names belong to their owners.
        </p>
      </>
    ),
  },
  {
    id: "returns",
    title: "Returns and exchanges",
    body: (
      <>
        <p>Decants are poured to order, so we can&apos;t take them back once they leave us.</p>
        <p>
          If something arrives damaged or leaking, or isn&apos;t what you ordered, message us on WhatsApp within 48 hours with a
          photo. We&apos;ll replace it or refund you.
        </p>
      </>
    ),
  },
  {
    id: "pre-orders",
    title: "Full-bottle pre-orders",
    body: (
      <p>
        A pre-order needs a 50% deposit, with the rest paid when the bottle arrives. If we can&apos;t get the bottle, you get your
        deposit back in full.
      </p>
    ),
  },
  {
    id: "privacy",
    title: "Your details",
    body: (
      <>
        <p>
          We keep only what we need to fill your order: your name, phone number, delivery area or address, and what you
          ordered. We use it to confirm, deliver and follow up on your order, and nothing else.
        </p>
        <p>
          We never sell or share your details for marketing. We note which link brought you to the site, and that&apos;s all the
          tracking we do. To see or delete what we hold about you, message us on WhatsApp.
        </p>
      </>
    ),
  },
];

const link = "underline decoration-hibiscus underline-offset-4 hover:text-hibiscus";

export default function PoliciesPage() {
  return (
    <div className="container-page pb-6 pt-8 md:pt-12">
      <div className="max-w-2xl space-y-4">
        <h1 className="wordmark text-[1.75rem] leading-tight lg:text-[2.25rem]">
          Policies <DraftBadge className="align-middle" />
        </h1>
        <span aria-hidden className="block h-0.5 w-14 bg-hibiscus" />
        <p className="text-muted">The short version: you see every price up front, you pay us directly, and we make it right if something goes wrong.</p>
      </div>

      <div className="mt-10 grid grid-cols-[minmax(0,1fr)] gap-8 md:grid-cols-[13rem_minmax(0,1fr)] md:gap-14">
        <nav aria-label="On this page" className="md:sticky md:top-20 md:self-start">
          <ul className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 md:mx-0 md:block md:space-y-1 md:px-0">
            {SECTIONS.map((s) => (
              <li key={s.id} className="shrink-0">
                <a
                  href={`#${s.id}`}
                  className="block rounded-full border border-line px-3.5 py-2 text-sm text-muted hover:border-ink hover:text-ink md:rounded-md md:border-0 md:px-0 md:py-1.5"
                >
                  {s.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="max-w-prose space-y-12">
          {SECTIONS.map((s) => (
            <section key={s.id} id={s.id} aria-labelledby={`${s.id}-title`} className="scroll-mt-24 space-y-3 leading-relaxed">
              <h2 id={`${s.id}-title`} className="text-xl font-medium">
                {s.title}
              </h2>
              <div className="space-y-3 text-muted [&_a]:text-ink">{s.body}</div>
            </section>
          ))}
          <p className="border-t border-line pt-6 text-sm text-muted">
            Questions about any of this?{" "}
            <a href={`https://wa.me/${SITE.whatsappNumber}`} rel="noopener" className={`text-ink ${link}`}>
              Message us on WhatsApp
            </a>
            . Last updated {UPDATED}.
          </p>
        </div>
      </div>
    </div>
  );
}
