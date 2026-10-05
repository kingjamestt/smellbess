import Link from "next/link";
import { loadAdminData } from "@/lib/admin-ops";
import { STATUS_LABELS } from "@/lib/pipeline";
import { formatTtd } from "@/lib/pricing";
import { ORDER_STATUSES, type Order } from "@/lib/types";

export const metadata = { title: "Orders" };

type Props = { searchParams: Promise<{ status?: string }> };

const FILTERS: { id: string; label: string; match: (o: Order) => boolean }[] = [
  { id: "open", label: "Open", match: (o) => o.status !== "done" && o.status !== "cancelled" },
  ...ORDER_STATUSES.map((s) => ({ id: s, label: STATUS_LABELS[s], match: (o: Order) => o.status === s })),
  { id: "all", label: "All", match: () => true },
];

const ago = (iso: string) => {
  const h = Math.floor((Date.now() - Date.parse(iso)) / 3600000);
  return h < 1 ? "just now" : h < 24 ? `${h}h ago` : `${Math.floor(h / 24)}d ago`;
};

export default async function AdminOrders({ searchParams }: Props) {
  const { status = "open" } = await searchParams;
  const { orders } = await loadAdminData();
  const filter = FILTERS.find((f) => f.id === status) ?? FILTERS[0];
  const shown = orders.filter(filter.match);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-3xl font-extrabold">Orders</h1>
        <Link href="/admin/orders/new" className="btn-primary">
          + New order
        </Link>
      </div>
      <nav aria-label="Filter orders" className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <Link
            key={f.id}
            href={`/admin/orders?status=${f.id}`}
            className={`chip ${f.id === filter.id ? "chip-on" : ""}`}
            aria-current={f.id === filter.id ? "page" : undefined}
          >
            {f.label} ({orders.filter(f.match).length})
          </Link>
        ))}
      </nav>
      {shown.length === 0 ? (
        <p className="text-muted">No orders here.</p>
      ) : (
        <ul className="space-y-2">
          {shown.map((o) => (
            <li key={o.id}>
              <Link href={`/admin/orders/${o.id}`} className="card block space-y-1 p-3 hover:bg-mist">
                <span className="flex flex-wrap items-baseline justify-between gap-2">
                  <span className="font-bold">
                    {o.number} · {o.customer.name}
                  </span>
                  <span className="font-semibold">{formatTtd(o.totals.total)}</span>
                </span>
                <span className="flex flex-wrap justify-between gap-2 text-sm text-muted">
                  <span>{o.delivery.label}</span>
                  <span>
                    <span className="chip mr-2">{STATUS_LABELS[o.status]}</span>
                    {ago(o.createdAt)}
                  </span>
                </span>
                {o.lines.some((l) => l.kind === "free" && !l.productId) &&
                  (o.status === "new" || o.status === "paid") && (
                    <span className="block text-sm font-semibold text-hibiscus">Free 5ml to pick</span>
                  )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
