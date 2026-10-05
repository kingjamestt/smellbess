import type { Area, DeliveryMethod, PaymentMethod, PickupPoint, Zone } from "./types";

/**
 * Delivery: the customer always pays. No free delivery offers.
 * Source: CLAUDE.md and business-plan.md §7.4.
 */
export const ZONE_FEES: Readonly<Record<Zone, number>> = {
  urban: 30,
  rural: 40,
  extended: 50,
  remote: 60,
  tobago: 90,
};

export const ZONE_LABELS: Readonly<Record<Zone, string>> = {
  urban: "Urban",
  rural: "Rural",
  extended: "Extended",
  remote: "Remote",
  tobago: "Tobago",
};

export const METHOD_LABELS: Readonly<Record<DeliveryMethod, string>> = {
  pickup: "Saturday pickup",
  workplace: "Workplace hand-off",
  odeliver: "ODeliver courier",
};

export const PAYMENT_LABELS: Readonly<Record<PaymentMethod, string>> = {
  bank_transfer: "Bank transfer",
  cash_on_pickup: "Cash at pickup",
};

export interface DeliveryConfig {
  areas: readonly Area[];
  pickupDay: string;
  pickupPoints: readonly PickupPoint[];
}

export interface DeliveryChoice {
  method: DeliveryMethod;
  areaId?: string;
  pickupPointId?: string;
}

export type DeliveryQuote =
  | {
      ok: true;
      method: DeliveryMethod;
      label: string;
      fee: number;
      area?: Area;
      pickupPoint?: PickupPoint;
    }
  | { ok: false; error: string };

export function quoteDelivery(choice: DeliveryChoice, config: DeliveryConfig): DeliveryQuote {
  const area = choice.areaId ? config.areas.find((a) => a.id === choice.areaId) : undefined;
  switch (choice.method) {
    case "pickup": {
      const point = config.pickupPoints.find((p) => p.id === choice.pickupPointId);
      if (!point) return { ok: false, error: `Pick a ${config.pickupDay} pickup spot.` };
      return {
        ok: true,
        method: "pickup",
        label: `${config.pickupDay} pickup: ${point.name}, ${point.time}`,
        fee: 0,
        pickupPoint: point,
      };
    }
    case "workplace":
      return { ok: true, method: "workplace", label: METHOD_LABELS.workplace, fee: 0 };
    case "odeliver": {
      if (!area) return { ok: false, error: "Pick your area." };
      return {
        ok: true,
        method: "odeliver",
        label: `${METHOD_LABELS.odeliver}: ${area.name} (${ZONE_LABELS[area.zone]})`,
        fee: ZONE_FEES[area.zone],
        area,
      };
    }
    default:
      return { ok: false, error: "Pick a delivery option." };
  }
}

/**
 * Cash only when we hand it over in person (Saturday pickup, workplace).
 * Delivery is paid by transfer before dispatch.
 */
export function paymentOptionsFor(method: DeliveryMethod): PaymentMethod[] {
  return method === "odeliver" ? ["bank_transfer"] : ["bank_transfer", "cash_on_pickup"];
}
