import Link from "next/link";
import { SITE } from "@/config/site";
import { CartLink, UtmCapture } from "./site-chrome-client";

export function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-line bg-paper/95 backdrop-blur">
      <UtmCapture />
      <div className="container-page flex h-14 items-center justify-between gap-3">
        <Link href="/" className="font-display text-xl font-extrabold tracking-tight">
          Smell <span className="text-hibiscus">Bess</span>
        </Link>
        <nav aria-label="Main" className="flex items-center gap-1 text-sm font-semibold sm:gap-3">
          <Link href="/scents" className="rounded-full px-2 py-2 hover:bg-mist sm:px-3">
            Scents
          </Link>
          <Link href="/sets" className="rounded-full px-2 py-2 hover:bg-mist sm:px-3">
            Sets
          </Link>
          <Link href="/delivery" className="hidden rounded-full px-3 py-2 hover:bg-mist sm:inline-block">
            Delivery
          </Link>
          <CartLink />
        </nav>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="mt-16 border-t border-line bg-mist">
      <div className="container-page space-y-4 py-8 text-sm text-muted">
        <p className="font-display text-lg font-bold text-ink">
          Smell <span className="text-hibiscus">Bess</span>
        </p>
        <p className="max-w-prose text-ink">{SITE.legal}</p>
        <p>Brand names are only used to describe a scent profile and belong to their owners.</p>
        <p>Prices are in TTD and include nothing hidden. Delivery is shown before you place your order.</p>
        <nav aria-label="Footer" className="flex flex-wrap gap-x-4 gap-y-2 font-semibold text-ink">
          <Link href="/scents">All scents</Link>
          <Link href="/sets">Curated sets</Link>
          <Link href="/delivery">Delivery &amp; pickup</Link>
          <a href={`https://wa.me/${SITE.whatsappNumber}`} rel="noopener">
            WhatsApp {SITE.whatsappDisplay}
          </a>
        </nav>
      </div>
    </footer>
  );
}
