import "server-only";
import { after } from "next/server";
import { sendNewOrderAlert } from "./alerts";
import { buildCatalogSnapshot, type CatalogSnapshot } from "./catalog";
import { buildOrder, productLabel, type CheckoutInput } from "./checkout";
import { getRepository } from "./data";
import type { OrderSource } from "./data/repository";
import { availableMl, cartDemandMl, reservedMl } from "./stock";
import type { Settings } from "./types";

async function loadAll() {
  const repo = getRepository();
  const [products, sets, bottles, orders, settings, areas] = await Promise.all([
    repo.listProducts(),
    repo.listSets(),
    repo.listBottles(),
    repo.listOrders(),
    repo.getSettings(),
    repo.listAreas(),
  ]);
  return { repo, products, sets, bottles, orders, settings, areas };
}

const deliveryConfig = (settings: Settings, areas: Awaited<ReturnType<typeof loadAll>>["areas"]) => ({
  areas,
  pickupDay: settings.pickupDay,
  // Paused stops (an owner's work-from-home week) never reach customers or checkout.
  pickupPoints: settings.pickupPoints.filter((p) => !p.paused),
});

/** Storefront data: catalog, live stock, delivery config. */
export async function getCatalog(): Promise<CatalogSnapshot> {
  const { products, sets, bottles, orders, settings, areas } = await loadAll();
  return buildCatalogSnapshot({ products, sets, bottles, orders, settings, delivery: deliveryConfig(settings, areas) });
}

export async function getSettings(): Promise<Settings> {
  return getRepository().getSettings();
}

/**
 * Re-price and re-check everything on the server, then save. The database
 * re-checks stock atomically, so two customers can't both claim the last 10ml.
 * Admins (source "admin") use the same rules, plus workplace hand-off.
 */
export async function placeOrder(
  input: CheckoutInput,
  source: OrderSource = "web",
): Promise<{ ok: true; id: string } | { ok: false; errors: string[] }> {
  const { repo, products, sets, bottles, orders, settings, areas } = await loadAll();
  const result = buildOrder(input, {
    products,
    sets,
    available: availableMl(bottles, reservedMl(orders)),
    settings,
    delivery: deliveryConfig(settings, areas),
  });
  if (!result.ok) return result;

  const setMap = Object.fromEntries(sets.map((s) => [s.id, s]));
  const saved = await repo.placeOrder(result.order, cartDemandMl({ lines: input.cart.lines }, setMap), source);
  if (!saved.ok) {
    const byId = new Map(products.map((p) => [p.id, p]));
    return {
      ok: false,
      errors: saved.shortfalls.map((s) => {
        const p = byId.get(s.productId);
        return `Someone just took the last of ${p ? productLabel(p) : "a scent"} (${s.availableMl}ml left). Lower the size or quantity.`;
      }),
    };
  }
  // Email both admins after the response, so a slow email never holds up checkout.
  if (source === "web") after(() => sendNewOrderAlert(saved.order));
  return { ok: true, id: saved.order.id };
}

export async function getOrder(id: string) {
  return getRepository().getOrder(id);
}
