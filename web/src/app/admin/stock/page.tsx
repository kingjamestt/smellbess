export const metadata = { title: "Stock" };

export default function AdminStock() {
  return (
    <div className="space-y-3">
      <h1 className="text-3xl font-extrabold">Stock</h1>
      <p className="text-muted">
        Stub. Will edit bottles (ID, ml remaining, cost, source), product status (live / coming soon / retired)
        and the atomizer flags. Turning off 15ml atomizers makes 15ml ship as 10ml + 5ml.
      </p>
      <p className="text-sm text-muted">
        Until then: edit <code>web/.data/store.json</code> locally (created on first run).
      </p>
    </div>
  );
}
