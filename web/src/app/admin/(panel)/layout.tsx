import Link from "next/link";
import { signOutAction } from "../actions";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

const LINKS = [
  { href: "/admin", label: "Home" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/orders/new", label: "+ Order" },
  { href: "/admin/decanting", label: "Decanting" },
  { href: "/admin/stock", label: "Stock" },
  { href: "/admin/pickup", label: "Pickup" },
  { href: "/admin/zones", label: "Zones" },
];

/** Every page under here needs an admin login. Actions check again on their own. */
export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();
  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
        <nav aria-label="Admin" className="flex flex-wrap gap-2">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="chip">
              {l.label}
            </Link>
          ))}
        </nav>
        <form action={signOutAction} className="flex items-center gap-2 text-sm text-muted">
          <span className="hidden sm:inline">{admin.email}</span>
          <button type="submit" className="chip">
            Log out
          </button>
        </form>
      </div>
      {children}
    </>
  );
}
