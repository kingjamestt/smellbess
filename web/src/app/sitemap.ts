import type { MetadataRoute } from "next";
import { SITE_URL } from "@/config/site";
import { getCatalog } from "@/lib/server";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { products } = await getCatalog();
  const pages = ["", "/scents", "/sets", "/delivery"].map((path) => ({ url: `${SITE_URL}${path}` }));
  const scents = products.filter((p) => p.status === "live").map((p) => ({ url: `${SITE_URL}/scents/${p.id}` }));
  return [...pages, ...scents];
}
