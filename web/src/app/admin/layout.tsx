import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s | Smell Bess admin" },
  robots: { index: false, follow: false },
};

const LINKS = [
  { href: "/admin", label: "Home" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/decanting", label: "Decanting" },
  { href: "/admin/stock", label: "Stock" },
  { href: "/admin/zones", label: "Zones" },
];

/**
 * STUB (milestone M2). No admin data is rendered until there's a login
 * (Supabase auth for the 2 admins). Every admin page and server action must
 * check the session before reading or changing anything.
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container-page py-6">
      <p className="mb-4 rounded-xl bg-sun/40 px-3 py-2 text-sm font-semibold">
        Admin is a stub. Login for the 2 admins comes with Supabase (M2). No order or customer data is shown here yet.
      </p>
      <nav aria-label="Admin" className="mb-6 flex flex-wrap gap-2">
        {LINKS.map((l) => (
          <Link key={l.href} href={l.href} className="chip">
            {l.label}
          </Link>
        ))}
      </nav>
      {children}
    </div>
  );
}
