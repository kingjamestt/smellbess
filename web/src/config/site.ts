import type { PickupPoint } from "@/lib/types";

/**
 * Business config that's safe to commit. Edit here; no database needed.
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

  /**
   * Saturday pickup run, in order. Free. Customer picks one stop at checkout.
   * Change times or stops here.
   */
  pickupDay: "Saturday",
  pickupPoints: [
    { id: "price-plaza", name: "Price Plaza, Chaguanas", time: "10:00am" },
    { id: "movietowne-pos", name: "MovieTowne, Port of Spain", time: "1:00pm" },
    { id: "east-gates", name: "East Gates Mall", time: "5:00pm" },
  ] satisfies PickupPoint[],

  /** Shown on every scent page and in the footer (website-brief.md). */
  legal:
    "Decanted by hand from authentic bottles. Smell Bess is not affiliated with any brand. 'Smells like' comparisons are our opinion.",
} as const;
