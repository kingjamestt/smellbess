import type { Metadata } from "next";
import { ScentRow, Shelf } from "@/components/shelf";
import { getCatalog } from "@/lib/server";
import { DEALS, filterFromParams } from "@/lib/shelf";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "All scents",
  description:
    "Every scent we carry, as decants (5ml, 10ml, 15ml) and sealed bottles while they last. Filter by daytime or nighttime, weather, who's wearing it, and which deal it counts toward.",
};

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function ScentsPage({ searchParams }: Props) {
  const { products } = await getCatalog();
  const initial = filterFromParams(await searchParams);
  const live = products.filter((p) => p.status === "live");
  const soon = products.filter((p) => p.status === "coming_soon");

  return (
    <div className="container-page pb-6 pt-8 md:pt-12">
      <div className="max-w-2xl space-y-4">
        <h1 className="wordmark text-[1.75rem] leading-tight lg:text-[2.25rem]">The scents</h1>
        <span aria-hidden className="block h-0.5 w-14 bg-hibiscus" />
        <p className="text-muted">
          {initial.deal
            ? `Showing the scents that count toward: ${DEALS[initial.deal].label.toLowerCase()}.`
            : "Every scent here is a strong performer we'd wear ourselves. Decant prices are set by tier, in TTD."}
        </p>
      </div>

      <div className="mt-8">
        <Shelf products={live} initial={initial} full />
      </div>

      {soon.length > 0 && (
        <section aria-labelledby="soon-title" className="mt-16 border-t border-line pt-10">
          <h2 id="soon-title" className="wordmark text-xl lg:text-2xl">
            Coming soon
          </h2>
          <p className="mt-3 max-w-xl text-muted">On the Bess List and on their way in a future drop.</p>
          <ul className="mt-4 grid divide-y divide-mist sm:grid-cols-2 sm:gap-x-10 sm:divide-y-0 lg:grid-cols-3">
            {soon.map((p) => (
              <li key={p.id} className="sm:border-b sm:border-mist">
                <ScentRow product={p} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
