import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { isAdminEmail, parseAdminEmails } from "./admins";

export interface Admin {
  email: string;
}

/** Login works once the Supabase URL and publishable key are set. */
export function authConfigured(): boolean {
  return !!(process.env.SUPABASE_URL && process.env.SUPABASE_PUBLISHABLE_KEY);
}

/** Supabase client for auth only (publishable key + the visitor's cookies). It can't read any table. */
export async function authClient() {
  const store = await cookies();
  return createServerClient(process.env.SUPABASE_URL!, process.env.SUPABASE_PUBLISHABLE_KEY!, {
    cookies: {
      getAll: () => store.getAll(),
      setAll: (list) => {
        try {
          for (const { name, value, options } of list) store.set(name, value, options);
        } catch {
          // Called from a Server Component, where cookies are read-only. The
          // proxy refreshes the session on every admin request instead.
        }
      },
    },
  });
}

/**
 * The logged-in admin, or null. Logged in means a valid Supabase session
 * whose email is in SMELLBESS_ADMIN_EMAILS.
 *
 * Local dev without Supabase: SMELLBESS_DEV_ADMIN=1 opens admin with no login.
 * It never works in production.
 */
export async function getAdmin(): Promise<Admin | null> {
  if (!authConfigured()) {
    const devOpen = process.env.NODE_ENV !== "production" && process.env.SMELLBESS_DEV_ADMIN === "1";
    return devOpen ? { email: "dev@localhost" } : null;
  }
  const supabase = await authClient();
  const { data } = await supabase.auth.getClaims();
  const email = typeof data?.claims?.email === "string" ? data.claims.email : null;
  return isAdminEmail(email, parseAdminEmails(process.env.SMELLBESS_ADMIN_EMAILS)) ? { email: email! } : null;
}

/** Use at the top of every admin page and admin server action. */
export async function requireAdmin(): Promise<Admin> {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");
  return admin;
}
