import { STATUS_LABELS } from "@/lib/pipeline";
import { ORDER_STATUSES } from "@/lib/types";

export const metadata = { title: "Orders" };

export default function AdminOrders() {
  return (
    <div className="space-y-3">
      <h1 className="text-3xl font-extrabold">Orders</h1>
      <p className="text-muted">Stub. After login, orders show here grouped by status, newest first.</p>
      <ol className="flex flex-wrap gap-2">
        {ORDER_STATUSES.map((s) => (
          <li key={s} className="chip">
            {STATUS_LABELS[s]}
          </li>
        ))}
      </ol>
    </div>
  );
}
