import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-page space-y-4 py-16 text-center">
      <h1 className="text-3xl font-extrabold">That page isn&apos;t here.</h1>
      <p className="text-muted">Maybe it sold out, maybe the link is off.</p>
      <Link href="/scents" className="btn-primary">
        Browse scents
      </Link>
    </div>
  );
}
