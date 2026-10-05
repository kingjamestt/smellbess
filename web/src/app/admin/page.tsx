export default function AdminHome() {
  return (
    <div className="space-y-3">
      <h1 className="text-3xl font-extrabold">Admin</h1>
      <p className="max-w-prose text-muted">Planned for M2, mobile-first, for the owner and girlfriend:</p>
      <ul className="list-disc space-y-1 pl-5">
        <li>Orders pipeline: new → paid → decanted → ready / out for delivery → done.</li>
        <li>Today&apos;s decanting list grouped by scent and size.</li>
        <li>Products and bottles: ml remaining, bottle ID, cost. Atomizer stock flags.</li>
        <li>Area → ODeliver zone mapping.</li>
        <li>CSV export of orders.</li>
      </ul>
      <p className="text-sm text-muted">
        The logic behind these already exists and is tested: <code>src/lib/pipeline.ts</code> (status
        transitions, decanting list), <code>src/lib/stock.ts</code> and the <code>Repository</code> interface in{" "}
        <code>src/lib/data/repository.ts</code>.
      </p>
    </div>
  );
}
