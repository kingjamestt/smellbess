import type { MetadataRoute } from "next";
import { SITE_URL } from "@/config/site";

const preview = process.env.NEXT_PUBLIC_DESIGN_PREVIEW === "1";

export default function robots(): MetadataRoute.Robots {
  // A design-preview deploy (demo data) stays out of search engines.
  if (preview) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/cart", "/checkout", "/order", "/auth"] },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
