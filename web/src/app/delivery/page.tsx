import type { Metadata } from "next";
import { SITE } from "@/config/site";
import { ZONE_FEES, ZONE_LABELS } from "@/lib/delivery";
import { formatTtd } from "@/lib/pricing";
import { getCatalog } from "@/lib/server";
import type { Zone } from "@/lib/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Delivery & pickup",
  description: "Free Saturday pickup in Chaguanas, Port of Spain and East Gates, or delivery anywhere in T&T from TT$30.",
};

const ZONES: Zone[] = ["urban", "rural", "extended", "remote", "tobago"];

export default async function DeliveryPage() {
  const { delivery } = await getCatalog();
  return (
    <div className="container-page max-w-3xl space-y-8 py-6">
      <div>
        <h1 className="wordmark text-[1.75rem] leading-tight lg:text-[2.25rem]">Delivery &amp; pickup</h1>
        <p className="mt-1 text-muted">
          You always see the delivery price before you order. No surprise fees.
        </p>
      </div>

      <section aria-labelledby="pickup" className="space-y-3">
        <h2 id="pickup" className="text-xl font-medium">
          {delivery.pickupDay} pickup: free
        </h2>
        <p>Pick your stop at checkout. Pay by transfer before, or bring cash.</p>
        <ol className="space-y-2">
          {delivery.pickupPoints.map((p) => (
            <li key={p.id} className="rounded-md border border-line flex items-center justify-between p-3">
              <span className="font-medium">{p.name}</span>
              <span className="label-caps rounded-md border border-line px-3 py-2 tabular-nums">{p.time}</span>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="courier" className="space-y-3">
        <h2 id="courier" className="text-xl font-medium">
          ODeliver courier, anywhere in T&amp;T
        </h2>
        <p>
          Priced by zone, at cost. Paid by bank transfer before we send it out. If we&apos;re passing your way,
          we might bring it ourselves, at the same price.
        </p>
        <table className="w-full text-left text-sm">
          <caption className="sr-only">ODeliver prices by zone</caption>
          <thead>
            <tr className="border-b border-line">
              <th scope="col" className="py-2">
                Zone
              </th>
              <th scope="col" className="py-2">
                Price
              </th>
              <th scope="col" className="py-2">
                Areas
              </th>
            </tr>
          </thead>
          <tbody>
            {ZONES.map((z) => (
              <tr key={z} className="border-b border-line align-top">
                <th scope="row" className="py-2 pr-2 font-medium">
                  {ZONE_LABELS[z]}
                </th>
                <td className="py-2 pr-2 font-medium">{formatTtd(ZONE_FEES[z])}</td>
                <td className="py-2 text-muted">
                  {delivery.areas
                    .filter((a) => a.zone === z)
                    .map((a) => a.name)
                    .join(", ")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="text-sm text-muted">
          Area not listed, or need it the same day? WhatsApp us on {SITE.whatsappDisplay} and we&apos;ll quote it.
        </p>
      </section>
    </div>
  );
}
