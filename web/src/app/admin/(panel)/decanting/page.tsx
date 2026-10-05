import Link from "next/link";
import { loadAdminData } from "@/lib/admin-ops";
import { decantingList, SURPRISE_ID } from "@/lib/pipeline";

export const metadata = { title: "Decanting" };

export default async function AdminDecanting() {
  const { orders, bottles } = await loadAdminData();
  const rows = decantingList(orders);
  const due = orders.filter(
    (o) => o.status === "paid" || (o.status === "new" && o.payment === "cash_on_pickup"),
  );
  const totalMl = rows.reduce((s, r) => s + r.ml, 0);

  return (
    <div className="max-w-2xl space-y-4">
      <h1 className="text-3xl font-extrabold">Decanting list</h1>
      <p className="text-muted">
        Paid orders, plus cash-at-pickup orders. {due.length} order{due.length === 1 ? "" : "s"}, {totalMl}ml in
        all. Mark each order decanted when it&apos;s filled: that takes the ml out of the bottles.
      </p>
      {rows.length === 0 ? (
        <p>Nothing to decant right now.</p>
      ) : (
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-line">
              <th className="py-2">Scent</th>
              <th className="py-2">Size</th>
              <th className="py-2">How many</th>
              <th className="py-2">ml</th>
              <th className="py-2">In bottles</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const inBottles = bottles.filter((b) => b.productId === r.productId).reduce((s, b) => s + b.mlRemaining, 0);
              const surprise = r.productId === SURPRISE_ID;
              return (
                <tr key={`${r.productId}-${r.size}`} className="border-b border-line">
                  <td className={`py-2 font-semibold ${surprise ? "text-hibiscus" : ""}`}>{r.label}</td>
                  <td className="py-2">{r.size}ml</td>
                  <td className="py-2 font-bold">{r.count}</td>
                  <td className="py-2">{r.ml}</td>
                  <td className="py-2 text-muted">{surprise ? "pick first" : `${inBottles}ml`}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
      {due.length > 0 && (
        <section className="space-y-2">
          <h2 className="text-lg font-bold">Orders on this list</h2>
          <ul className="flex flex-wrap gap-2">
            {due.map((o) => (
              <li key={o.id}>
                <Link href={`/admin/orders/${o.id}`} className="chip">
                  {o.number} · {o.customer.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
