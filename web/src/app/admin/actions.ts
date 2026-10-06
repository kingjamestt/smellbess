"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  advanceOrder,
  pickFreeSample,
  removeBottle,
  saveArea,
  saveBottle,
  savePickup,
  saveStockSettings,
} from "@/lib/admin-ops";
import { isAdminEmail, parseAdminEmails } from "@/lib/admins";
import { authClient, authConfigured, requireAdmin } from "@/lib/auth";
import { sanitizeCheckoutInput } from "@/lib/checkout";
import { placeOrder } from "@/lib/server";
import { ORDER_STATUSES, type OrderStatus, type PickupPoint, type Zone } from "@/lib/types";

export type FormState = { ok?: boolean; error?: string; message?: string } | undefined;

const text = (fd: FormData, key: string) => String(fd.get(key) ?? "").trim();
const num = (fd: FormData, key: string) => Number(text(fd, key));
const done = (r: { ok: true } | { ok: false; error: string }, path: string): FormState => {
  if (r.ok) revalidatePath(path, "layout");
  return r.ok ? { ok: true } : { error: r.error };
};

// ---------------------------------------------------------------- login

/**
 * Email a one-time login link. Answers the same whether or not the email is
 * an admin, so the form can't be used to discover who the admins are.
 */
export async function sendLoginLinkAction(_prev: FormState, fd: FormData): Promise<FormState> {
  const email = text(fd, "email").toLowerCase();
  const message = "If that email is an admin, a login link is on its way. Open it on this same phone or browser.";
  if (!authConfigured()) return { error: "Login isn't set up yet (Supabase env vars missing)." };
  if (!isAdminEmail(email, parseAdminEmails(process.env.SMELLBESS_ADMIN_EMAILS))) return { message };

  const h = await headers();
  const origin = process.env.SMELLBESS_SITE_URL?.replace(/\/$/, "") ?? h.get("origin") ?? "";
  const supabase = await authClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: `${origin}/auth/callback` },
  });
  if (error) {
    console.error("Login link failed", error.message);
    return { error: "Couldn't send the link just now. Wait a minute and try again." };
  }
  return { message };
}

export async function signOutAction() {
  if (authConfigured()) await (await authClient()).auth.signOut();
  redirect("/admin/login");
}

// ---------------------------------------------------------------- orders

export async function advanceOrderAction(_prev: FormState, fd: FormData): Promise<FormState> {
  const to = text(fd, "to") as OrderStatus;
  if (!ORDER_STATUSES.includes(to)) return { error: "Unknown status." };
  return done(await advanceOrder(text(fd, "id"), to), "/admin");
}

export async function pickFreeSampleAction(_prev: FormState, fd: FormData): Promise<FormState> {
  return done(await pickFreeSample(text(fd, "id"), text(fd, "productId")), "/admin");
}

/** An order typed in by an admin (WhatsApp, workplace). Same pricing and stock rules as the shop. */
export async function createAdminOrderAction(
  raw: unknown,
): Promise<{ ok: true; id: string } | { ok: false; errors: string[] }> {
  await requireAdmin();
  const input = sanitizeCheckoutInput(raw, { allowWorkplace: true });
  if (!input) return { ok: false, errors: ["Check the order lines and delivery, then try again."] };
  const result = await placeOrder(input, "admin");
  if (result.ok) revalidatePath("/admin", "layout");
  return result;
}

// ---------------------------------------------------------------- stock

export async function saveBottleAction(_prev: FormState, fd: FormData): Promise<FormState> {
  return done(
    await saveBottle({
      id: text(fd, "id").toUpperCase(),
      productId: text(fd, "productId"),
      sizeMl: num(fd, "sizeMl"),
      mlRemaining: num(fd, "mlRemaining"),
      costTtd: num(fd, "costTtd"),
      source: text(fd, "source"),
      isTester: fd.get("isTester") === "on" || undefined,
      openedAt: text(fd, "openedAt") || undefined,
      sealed: fd.get("sealed") === "on" || undefined,
      // Ticking "sold" keeps the original sale date if there was one.
      soldAt: fd.get("sold") === "on" ? text(fd, "soldAt") || new Date().toISOString() : undefined,
    }),
    "/admin",
  );
}

export async function deleteBottleAction(_prev: FormState, fd: FormData): Promise<FormState> {
  return done(await removeBottle(text(fd, "id")), "/admin");
}

export async function saveStockSettingsAction(_prev: FormState, fd: FormData): Promise<FormState> {
  return done(
    await saveStockSettings(
      { 5: fd.get("a5") === "on", 10: fd.get("a10") === "on", 15: fd.get("a15") === "on" },
      num(fd, "lowStockThreshold"),
    ),
    "/admin",
  );
}

// ---------------------------------------------------------------- delivery

export async function saveAreaAction(_prev: FormState, fd: FormData): Promise<FormState> {
  return done(await saveArea({ id: text(fd, "id"), name: text(fd, "name"), zone: text(fd, "zone") as Zone }), "/admin");
}

export async function savePickupAction(_prev: FormState, fd: FormData): Promise<FormState> {
  const names = fd.getAll("name").map(String);
  const times = fd.getAll("time").map(String);
  const ids = fd.getAll("pid").map(String);
  const days = fd.getAll("pday").map(String);
  // Checkboxes only post when ticked, so each row posts its index as "live".
  const live = new Set(fd.getAll("live").map(String));
  const points: PickupPoint[] = names.map((name, i) => ({ id: ids[i] ?? "", name, time: times[i] ?? "", day: days[i] ?? "", paused: !live.has(String(i)) }));
  return done(await savePickup(text(fd, "pickupDay"), points), "/");
}
