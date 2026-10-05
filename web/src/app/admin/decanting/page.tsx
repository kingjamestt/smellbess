export const metadata = { title: "Decanting list" };

export default function AdminDecanting() {
  return (
    <div className="space-y-3">
      <h1 className="text-3xl font-extrabold">Today&apos;s decanting list</h1>
      <p className="text-muted">
        Stub. Will list every paid order (and new cash-at-pickup orders) grouped by scent and size, from{" "}
        <code>decantingList()</code> in <code>src/lib/pipeline.ts</code>.
      </p>
    </div>
  );
}
