import type { Metadata } from "next";
import Link from "next/link";
import { pageOpenGraph, SITE } from "@/config/site";
import { getCatalog } from "@/lib/server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contact",
  description: "Message Smell Bess on WhatsApp to ask about a scent, place an order or sort out delivery in Trinidad & Tobago.",
  alternates: { canonical: "/contact" },
  openGraph: pageOpenGraph("/contact"),
};

const WHATSAPP = `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent("Hi Smell Bess, ")}`;

export default async function ContactPage() {
  const { delivery } = await getCatalog();
  return (
    <div className="container-page max-w-3xl pb-6 pt-8 md:pt-12">
      <div className="space-y-4">
        <h1 className="wordmark text-[1.75rem] leading-tight lg:text-[2.25rem]">Contact</h1>
        <span aria-hidden className="block h-0.5 w-14 bg-hibiscus" />
        <p className="max-w-xl text-muted">
          WhatsApp is the quickest way to reach us. Ask about a scent, place an order or sort out delivery, all in one chat.
        </p>
        <a href={WHATSAPP} rel="noopener" className="btn-primary">
          Message us on WhatsApp
        </a>
      </div>

      <dl className="mt-12 divide-y divide-line border-y border-line">
        <div className="grid gap-1 py-5 sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-6">
          <dt className="text-muted">WhatsApp</dt>
          <dd>
            <a href={WHATSAPP} rel="noopener" className="tabular-nums underline decoration-hibiscus underline-offset-4 hover:text-hibiscus">
              {SITE.whatsappDisplay}
            </a>
          </dd>
        </div>
        <div className="grid gap-1 py-5 sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-6">
          <dt className="text-muted">Pickup</dt>
          <dd>
            Free at {delivery.pickupPoints.map((p) => `${p.name} (${p.day || delivery.pickupDay} ${p.time})`).join(", ")}.{" "}
            <Link href="/delivery" className="underline decoration-hibiscus underline-offset-4 hover:text-hibiscus">
              Delivery &amp; pickup
            </Link>
          </dd>
        </div>
        <div className="grid gap-1 py-5 sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-6">
          <dt className="text-muted">Payment</dt>
          <dd>
            Bank details only ever come from our WhatsApp number, after we confirm your order. They are never on this
            website. If anyone else sends you payment details for Smell Bess, don&apos;t pay, and let us know.
          </dd>
        </div>
      </dl>

      <p className="mt-8 text-sm text-muted">
        How orders, returns and your details are handled:{" "}
        <Link href="/policies" className="text-ink underline decoration-hibiscus underline-offset-4 hover:text-hibiscus">
          our policies
        </Link>
        .
      </p>
    </div>
  );
}
