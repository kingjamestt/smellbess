import Link from "next/link";
import { SITE } from "@/config/site";
import { Seal, Wordmark } from "./brand";
import { MobileMenu } from "./mobile-menu";
import { CartLink, UtmCapture } from "./site-chrome-client";

const NAV = [
  { href: "/scents", label: "Scents" },
  { href: "/sets", label: "Sets" },
  { href: "/delivery", label: "Delivery" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-line bg-paper/95 backdrop-blur">
      <UtmCapture />
      <div className="container-page flex h-14 items-center justify-between gap-3">
        <Link href="/" aria-label="Smell Bess, home" className="py-2">
          <Wordmark size="sm" />
        </Link>
        <div className="flex items-center gap-2 sm:gap-3">
          <nav aria-label="Main" className="label-caps hidden items-center gap-3 text-ink md:flex">
            {NAV.map((item) => (
              <Link key={item.href} href={item.href} className="rounded-md px-3 py-2 hover:bg-mist">
                {item.label}
              </Link>
            ))}
          </nav>
          <span className="label-caps text-ink">
            <CartLink />
          </span>
          <MobileMenu items={NAV} whatsappHref={`https://wa.me/${SITE.whatsappNumber}`} whatsappLabel={`WhatsApp ${SITE.whatsappDisplay}`} />
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="mt-16 border-t border-line bg-mist">
      <div className="container-page space-y-5 py-10 text-sm text-muted">
        <div className="flex items-center justify-between gap-6">
          <Wordmark size="md" rule descriptor />
          <Seal id="footer-seal" className="h-20 w-20 shrink-0 text-ink sm:h-24 sm:w-24" />
        </div>
        <p className="max-w-prose text-ink">{SITE.legal}</p>
        <p>Brand names are only used to describe a scent profile and belong to their owners.</p>
        <p>Prices are in TTD and include nothing hidden. Delivery is shown before you place your order.</p>
        <nav aria-label="Footer" className="label-caps flex flex-wrap gap-x-5 gap-y-3 pt-2 text-ink">
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
