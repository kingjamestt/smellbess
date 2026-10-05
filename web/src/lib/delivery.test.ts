import { describe, expect, it } from "vitest";
import { OWN_DROPOFF_FEE, ZONE_FEES, paymentOptionsFor, quoteDelivery, type DeliveryConfig } from "./delivery";
import type { Zone } from "./types";

const config: DeliveryConfig = {
  areas: [
    { id: "pos", name: "Port of Spain", zone: "urban" },
    { id: "sg", name: "Sangre Grande", zone: "rural" },
    { id: "pf", name: "Point Fortin", zone: "extended" },
    { id: "may", name: "Mayaro", zone: "remote" },
    { id: "tob", name: "Tobago", zone: "tobago" },
  ],
  pickupPoints: [
    { id: "pp", name: "Price Plaza, Chaguanas", time: "10:00am" },
    { id: "mt", name: "MovieTowne, Port of Spain", time: "1:00pm" },
  ],
  ownDropoffAreaIds: ["pos"],
};

describe("delivery fees (customer always pays)", () => {
  it("ODeliver zone fees match the plan", () => {
    expect(ZONE_FEES).toEqual({ urban: 30, rural: 40, extended: 50, remote: 60, tobago: 90 });
  });

  it.each<[string, Zone, number]>([
    ["pos", "urban", 30],
    ["sg", "rural", 40],
    ["pf", "extended", 50],
    ["may", "remote", 60],
    ["tob", "tobago", 90],
  ])("ODeliver to %s is %s, TT$%i", (areaId, zone, fee) => {
    const q = quoteDelivery({ method: "odeliver", areaId }, config);
    expect(q).toMatchObject({ ok: true, fee });
    if (q.ok) expect(q.area?.zone).toBe(zone);
  });

  it("Saturday pickup is free and needs a pickup spot", () => {
    expect(quoteDelivery({ method: "pickup" }, config)).toEqual({ ok: false, error: "Pick a Saturday pickup spot." });
    const q = quoteDelivery({ method: "pickup", pickupPointId: "mt" }, config);
    expect(q).toMatchObject({ ok: true, fee: 0, label: "Saturday pickup: MovieTowne, Port of Spain, 1:00pm" });
    if (q.ok) expect(q.pickupPoint?.time).toBe("1:00pm");
  });

  it("rejects an unknown pickup spot", () => {
    expect(quoteDelivery({ method: "pickup", pickupPointId: "nope" }, config).ok).toBe(false);
  });

  it("workplace hand-off is free", () => {
    expect(quoteDelivery({ method: "workplace" }, config)).toMatchObject({ ok: true, fee: 0 });
  });

  it("own drop-off is TT$30 in listed areas only", () => {
    expect(quoteDelivery({ method: "own_dropoff", areaId: "pos" }, config)).toMatchObject({
      ok: true,
      fee: OWN_DROPOFF_FEE,
    });
    expect(OWN_DROPOFF_FEE).toBe(30);
    const out = quoteDelivery({ method: "own_dropoff", areaId: "sg" }, config);
    expect(out.ok).toBe(false);
  });

  it("courier and drop-off need a known area", () => {
    expect(quoteDelivery({ method: "odeliver" }, config).ok).toBe(false);
    expect(quoteDelivery({ method: "odeliver", areaId: "atlantis" }, config).ok).toBe(false);
  });
});

describe("payment options", () => {
  it("cash is only for Saturday pickup", () => {
    expect(paymentOptionsFor("pickup")).toEqual(["bank_transfer", "cash_on_pickup"]);
    expect(paymentOptionsFor("workplace")).toEqual(["bank_transfer"]);
    expect(paymentOptionsFor("own_dropoff")).toEqual(["bank_transfer"]);
    expect(paymentOptionsFor("odeliver")).toEqual(["bank_transfer"]);
  });
});
