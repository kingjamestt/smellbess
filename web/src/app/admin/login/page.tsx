import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ActionForm } from "@/components/admin/action-form";
import { authConfigured, getAdmin } from "@/lib/auth";
import { sendLoginLinkAction } from "../actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Log in" };

type Props = { searchParams: Promise<{ error?: string }> };

export default async function AdminLogin({ searchParams }: Props) {
  if (await getAdmin()) redirect("/admin");
  const { error } = await searchParams;
  return (
    <div className="mx-auto max-w-sm space-y-4 py-8">
      <h1 className="text-3xl font-extrabold">Admin login</h1>
      <p className="text-muted">We email you a one-time link. No password.</p>
      {error === "link" && (
        <p role="alert" className="rounded-xl bg-sun/40 p-3 text-sm">
          That link didn&apos;t work (it may have expired, or was opened in a different browser). Send a new one.
        </p>
      )}
      {!authConfigured() && (
        <p className="rounded-xl bg-mist p-3 text-sm">
          Supabase isn&apos;t configured here. For local testing without it, set <code>SMELLBESS_DEV_ADMIN=1</code> in{" "}
          <code>.env.local</code>.
        </p>
      )}
      <ActionForm action={sendLoginLinkAction} className="space-y-3">
        <label className="block">
          <span className="label">Email</span>
          <input name="email" type="email" required autoComplete="email" className="field" />
        </label>
        <button type="submit" className="btn-primary w-full">
          Email me a login link
        </button>
      </ActionForm>
    </div>
  );
}
