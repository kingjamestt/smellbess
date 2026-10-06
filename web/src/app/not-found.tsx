import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-page space-y-4 py-16 text-center">
      <h1 className="wordmark text-2xl leading-tight">Not here</h1>
      <p className="text-muted">That page doesn&apos;t exist, or the link is off.</p>
      <Link href="/scents" className="btn-primary">
        See the scents
      </Link>
    </div>
  );
}
