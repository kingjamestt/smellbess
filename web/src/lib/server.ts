import "server-only";
import { SITE } from "@/config/site";
import { parseBankAccounts } from "./bank";
import { buildCatalogSnapshot, type CatalogSnapshot } from "./catalog";
import { buildOrder, type CheckoutInput } from "./checkout";
import { getRepository } from "./data";
import { availableMl, reservedMl } from "./stock";
import type { BankAccount } from "./types";

/** Storefront data: catalog, live stock, delivery config. */
export async function getCatalog(): Promise<CatalogSnapshot> {
  const repo = getRepository();
  const [products, sets, bottles, orders, settings, areas] = await Promise.all([
    repo.listProducts(),
    repo.listSets(),
    repo.listBottles(),
    repo.listOrders(),
    repo.getSettings(),
    repo.listAreas(),
  ]);
  return buildCatalogSnapshot({
    products,
    sets,
    bottles,
    orders,
    settings,
    delivery: {
      areas,
      pickupPoints: SITE.pickupPoints,
      ownDropoffAreaIds: SITE.ownDropoffAreaIds,
    },
  });
}

/** Bank accounts for transfers. Server-only: read from env, never stored. */
export function getBankAccounts(): BankAccount[] {
  return parseBankAccounts(process.env);
}

/**
 * Re-price and re-check stock on the server, then save. Runs exclusively so
 * two customers can't both claim the last 10ml.
 */
export async function placeOrder(
  input: CheckoutInput,
): Promise<{ ok: true; id: string } | { ok: false; errors: string[] }> {
  const repo = getRepository();
  return repo.runExclusive(async () => {
    const [products, sets, bottles, orders, settings, areas] = await Promise.all([
      repo.listProducts(),
      repo.listSets(),
      repo.listBottles(),
      repo.listOrders(),
      repo.getSettings(),
      repo.listAreas(),
    ]);
    const result = buildOrder(input, {
      products,
      sets,
      available: availableMl(bottles, reservedMl(orders)),
      settings,
      delivery: { areas, pickupPoints: SITE.pickupPoints, ownDropoffAreaIds: SITE.ownDropoffAreaIds },
    });
    if (!result.ok) return result;
    const order = await repo.createOrder(result.order);
    return { ok: true, id: order.id };
  });
}

export async function getOrder(id: string) {
  return getRepository().getOrder(id);
}
