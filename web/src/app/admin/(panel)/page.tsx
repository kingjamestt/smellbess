import Link from "next/link";
import { loadAdminData } from "@/lib/admin-ops";
import { productLabel } from "@/lib/checkout";
import { formatTtd } from "@/lib/pricing";
import { decantingList, recentOrders } from "@/lib/pipeline";
import { getRepository } from "@/lib/data";

export const metadata = { title: "Home" };

export default async function AdminHome() {
  const { orders, products, available, settings } = await loadAdminData();
  const count = (s: string) => orders.filter((o) => o.status === s).length;
  const toDecant = decantingList(orders).reduce((n, r) => n + r.count, 0);
  const unpicked = orders.filter(
    (o) => (o.status === "new" || o.status === "paid") && o.lines.some((l) => l.kind === "free" && !l.productId),
  ).length;
  const low = products
    .filter((p) => p.status === "live")
    .map((p) => ({ p, ml: available[p.id] ?? 0 }))
    .filter(({ ml }) => Math.floor(ml / 10) <= settings.lowStockThreshold)
    .sort((a, b) => a.ml - b.ml);
  const thisWeek = recentOrders(orders, 7);

  const tiles = [
    { label: "New (awaiting payment)", value: count("new"), href: "/admin/orders?status=new" },
    { label: "Paid (to decant)", value: count("paid"), href: "/admin/orders?status=paid" },
    { label: "Decants on the list", value: toDecant, href: "/admin/decanting" },
    { label: "Ready / out", value: count("ready") + count("out_for_delivery"), href: "/admin/orders?status=ready" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-extrabold">Today</h1>
      {getRepository().kind === "json" && (
        <p className="rounded-xl bg-sun/40 p-3 text-sm">Local test data (JSON file). Production uses Supabase.</p>
      )}
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {tiles.map((t) => (
          <li key={t.label}>
            <Link href={t.href} className="card block p-4 hover:bg-mist">
              <span className="font-display text-3xl font-extrabold">{t.value}</span>
              <span className="block text-sm text-muted">{t.label}</span>
            </Link>
          </li>
        ))}
      </ul>
      {unpicked > 0 && (
        <p className="rounded-xl bg-hibiscus/10 p-3 text-sm font-semibold">
          {unpicked === 1 ? "1 order still needs" : `${unpicked} orders still need`} a free 5ml picked.{" "}
          <Link href="/admin/orders?status=open" className="underline">
            Pick them
          </Link>
        </p>
      )}
      <section className="card space-y-1 p-4">
        <h2 className="text-lg font-bold">Last 7 days</h2>
        <p>
          {thisWeek.length} order{thisWeek.length === 1 ? "" : "s"} ·{" "}
          {formatTtd(thisWeek.reduce((s, o) => s + o.totals.total - o.totals.delivery, 0))} in decants (before
          delivery)
        </p>
      </section>
      <section className="space-y-2">
        <h2 className="text-lg font-bold">Running low</h2>
        {low.length === 0 ? (
          <p className="text-sm text-muted">Nothing low right now.</p>
        ) : (
          <ul className="space-y-1">
            {low.map(({ p, ml }) => (
              <li key={p.id} className="card flex justify-between p-3 text-sm">
                <span>{productLabel(p)}</span>
                <span className="font-semibold">{ml}ml free</span>
              </li>
            ))}
          </ul>
        )}
        <Link href="/admin/stock" className="text-sm underline">
          Stock and bottles
        </Link>
      </section>
      <a href="/admin/export" className="btn-secondary">
        Download all orders (CSV)
      </a>
    </div>
  );
}
