export const metadata = { title: "Delivery zones" };

export default function AdminZones() {
  return (
    <div className="space-y-3">
      <h1 className="text-3xl font-extrabold">Delivery zones</h1>
      <p className="text-muted">
        Stub. Will edit the area → ODeliver zone list (Urban 30 / Rural 40 / Extended 50 / Remote 60 / Tobago 90).
        Own drop-off areas and pickup stops are in <code>src/config/site.ts</code>.
      </p>
    </div>
  );
}
