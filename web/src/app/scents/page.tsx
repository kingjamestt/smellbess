import type { Metadata } from "next";
import { CatalogBrowser } from "@/components/catalog-browser";
import { getCatalog } from "@/lib/server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "All scents",
  description: "Fire fragrance decants in 5ml, 10ml and 15ml. Filter by vibe, occasion and who's wearing it.",
};

export default async function ScentsPage() {
  const { products } = await getCatalog();
  return (
    <div className="container-page py-6">
      <h1 className="text-3xl font-extrabold sm:text-4xl">Only the bess</h1>
      <p className="mb-6 mt-1 max-w-prose text-muted">
        Every scent here is a strong performer we&apos;d wear ourselves. Prices are set by tier, in TTD.
      </p>
      <CatalogBrowser products={products} />
    </div>
  );
}
