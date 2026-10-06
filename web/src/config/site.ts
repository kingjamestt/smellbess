/**
 * Business config that's safe to commit. Things the owners change often
 * (pickup stops, zones, stock) live in the database and are edited in admin.
 *
 * Bank details are NOT on the site at all (owner decision, 5 Oct 2026). The
 * customer sends the order on WhatsApp and we reply there with them.
 */
export const SITE = {
  name: "Smell Bess",
  /** Free Netlify address for now; smellbess.com comes later. */
  domain: "smellbess.netlify.app",
  instagram: "smellbess",

  /** WhatsApp Business number for orders, wa.me format (no "+", no spaces). */
  whatsappNumber: "18683050506",
  whatsappDisplay: "+1 868-305-0506",

  /** Shown on every scent page and in the footer (website-brief.md). */
  legal:
    "Decanted by hand from authentic bottles. Smell Bess is not affiliated with any brand. 'Smells like' and 'inspired by' comparisons are our opinion.",
} as const;

/** Absolute site address for link previews, canonical URLs and the sitemap. */
export const SITE_URL = (process.env.SMELLBESS_SITE_URL || `https://${SITE.domain}`).replace(/\/$/, "");
