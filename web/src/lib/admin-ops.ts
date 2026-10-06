import "server-only";
import { requireAdmin } from "./auth";
import { productLabel } from "./checkout";
import { getRepository } from "./data";
import { canTransition } from "./pipeline";
import { availableMl, orderDemandMl, planDeductions, reservedMl } from "./stock";
import { OFFER_RULES } from "./offers";
import type { Area, Bottle, OrderLine, OrderStatus, PickupPoint, Settings, SizeMl, Zone } from "./types";

/** Everything the admin screens read. Admin only. */
export async function loadAdminData() {
  await requireAdmin();
  const repo = getRepository();
  const [products, sets, bottles, orders, settings, areas] = await Promise.all([
    repo.listProducts(),
    repo.listSets(),
    repo.listBottles(),
    repo.listOrders(),
    repo.getSettings(),
    repo.listAreas(),
  ]);
  return { products, sets, bottles, orders, settings, areas, available: availableMl(bottles, reservedMl(orders)) };
}

export type OpResult = { ok: true } | { ok: false; error: string };

/**
 * Move an order to the next status. Decanting takes the juice out of the
 * bottles (emptiest bottle first) in the same database step.
 */
export async function advanceOrder(id: string, to: OrderStatus): Promise<OpResult> {
  await requireAdmin();
  const repo = getRepository();
  const order = await repo.getOrder(id);
  if (!order) return { ok: false, error: "Order not found." };
  if (!canTransition(order, to)) return { ok: false, error: "That step isn't allowed from here." };

  let deductions: { bottleId: string; ml: number; sell?: true }[] = [];
  if (to === "decanted") {
    if (order.lines.some((l) => l.kind === "free" && !l.productId)) {
      return { ok: false, error: "Pick the scent for the free 5ml first." };
    }
    const plan = planDeductions(orderDemandMl(order.lines), await repo.listBottles());
    if (plan.missing.length > 0) {
      return {
        ok: false,
        error: `Not enough stock for: ${plan.missing.map((m) => (m.sealed ? `${m.productId} (no sealed bottle left)` : `${m.productId} (${m.ml}ml short)`)).join(", ")}. Check the stock page.`,
      };
    }
    deductions = plan.deductions;
  }
  const moved = await repo.transitionOrder(id, order.status, to, deductions);
  return moved ? { ok: true } : { ok: false, error: "Someone else just updated this order. Refresh and try again." };
}

/** Choose the scent for an order's free 5ml surprise: a live Tier A with 5ml to spare. */
export async function pickFreeSample(orderId: string, productId: string): Promise<OpResult> {
  const { products, bottles, orders } = await loadAdminData();
  const order = orders.find((o) => o.id === orderId);
  if (!order) return { ok: false, error: "Order not found." };
  if (order.status !== "new" && order.status !== "paid") {
    return { ok: false, error: "The free 5ml can only be changed before decanting." };
  }
  const product = products.find((p) => p.id === productId);
  if (!product || product.status !== "live" || product.tier !== OFFER_RULES.freeSample.tier) {
    return { ok: false, error: "Pick a live Tier A scent." };
  }
  // Stock without this order's own claim, then check 5ml is free for the pick.
  const others = orders.filter((o) => o.id !== orderId);
  const lines: OrderLine[] = order.lines.map((l) =>
    l.kind === "free" ? { ...l, productId, label: productLabel(product) } : l,
  );
  const need = orderDemandMl(lines)[productId] ?? 0;
  if ((availableMl(bottles, reservedMl(others))[productId] ?? 0) < need) {
    return { ok: false, error: `Not enough ${productLabel(product)} left.` };
  }
  await getRepository().updateOrderLines(orderId, lines, orderDemandMl(lines));
  return { ok: true };
}

const BOTTLE_ID = /^[A-Za-z0-9][A-Za-z0-9-]{0,19}$/;

export async function saveBottle(input: Bottle): Promise<OpResult> {
  const { products } = await loadAdminData();
  if (!BOTTLE_ID.test(input.id)) return { ok: false, error: "Bottle ID: letters, numbers and dashes, e.g. KH-02." };
  const product = products.find((p) => p.id === input.productId);
  if (!product) return { ok: false, error: "Pick a scent." };
  if (input.sealed && !product.bottle) {
    return { ok: false, error: `${productLabel(product)} has no sealed-bottle price yet, so it can't be sold whole.` };
  }
  if (input.soldAt && !input.sealed) return { ok: false, error: "Only a sealed bottle can be marked sold." };
  if (!(input.sizeMl > 0 && input.sizeMl <= 500)) return { ok: false, error: "Bottle size must be 1–500ml." };
  if (!(input.mlRemaining >= 0 && input.mlRemaining <= input.sizeMl)) {
    return { ok: false, error: "ml left must be between 0 and the bottle size." };
  }
  if (!(input.costTtd >= 0)) return { ok: false, error: "Cost can't be negative." };
  await getRepository().upsertBottle({ ...input, source: input.source.slice(0, 60) });
  return { ok: true };
}

export async function removeBottle(id: string): Promise<OpResult> {
  await requireAdmin();
  await getRepository().deleteBottle(id);
  return { ok: true };
}

export async function saveStockSettings(atomizers: Record<SizeMl, boolean>, lowStockThreshold: number): Promise<OpResult> {
  await requireAdmin();
  if (!Number.isInteger(lowStockThreshold) || lowStockThreshold < 0 || lowStockThreshold > 50) {
    return { ok: false, error: "Low-stock threshold must be 0–50." };
  }
  await getRepository().updateSettings({ atomizers, lowStockThreshold });
  return { ok: true };
}

const ZONES: Zone[] = ["urban", "rural", "extended", "remote", "tobago"];

export async function saveArea(area: Area): Promise<OpResult> {
  await requireAdmin();
  const name = area.name.trim().slice(0, 60);
  if (name.length < 2) return { ok: false, error: "Give the area a name." };
  if (!ZONES.includes(area.zone)) return { ok: false, error: "Pick a zone." };
  const id = area.id || name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  await getRepository().upsertArea({ id, name, zone: area.zone });
  return { ok: true };
}

export async function savePickup(pickupDay: string, points: PickupPoint[]): Promise<OpResult> {
  await requireAdmin();
  const day = pickupDay.trim().slice(0, 20);
  if (day.length < 3) return { ok: false, error: "Which day is the pickup run?" };
  const clean = points
    .map((p) => ({ name: p.name.trim().slice(0, 60), time: p.time.trim().slice(0, 20), id: p.id }))
    .filter((p) => p.name && p.time);
  const seen = new Set<string>();
  const withIds: Settings["pickupPoints"] = clean.map((p) => {
    let id = p.id || p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "stop";
    while (seen.has(id)) id = `${id}-2`;
    seen.add(id);
    return { id, name: p.name, time: p.time };
  });
  await getRepository().updateSettings({ pickupDay: day, pickupPoints: withIds });
  return { ok: true };
}
