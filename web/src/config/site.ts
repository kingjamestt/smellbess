import type { PickupPoint } from "@/lib/types";

/**
 * Business config that's safe to commit. Edit here; no database needed.
 *
 * NOT here on purpose: bank account details. They live only in `.env.local`
 * (see `.env.example`) and are read on the server at runtime.
 */
export const SITE = {
  name: "Smell Bess",
  domain: "smellbess.com",
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

  workplace: {
    description: "Hand-off at our workplace, arranged on WhatsApp. Free.",
  },

  /**
   * Areas where we do our own drop-off at TT$30. PLACEHOLDERS: the owner
   * hasn't confirmed the route yet. Ids must match areas in the zone list.
   */
  ownDropoffAreaIds: ["port-of-spain", "chaguanas", "arima"] as string[],
  ownDropoffConfirmed: false,

  /** Shown on every scent page and in the footer (website-brief.md). */
  legal:
    "Decanted by hand from authentic bottles. Smell Bess is not affiliated with any brand. 'Smells like' comparisons are our opinion.",
} as const;
