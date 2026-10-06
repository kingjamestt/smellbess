"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type NavItem = { href: string; label: string };

/** Full-page menu for small screens. Desktop shows the links inline instead. */
export function MobileMenu({ items, whatsappHref, whatsappLabel }: { items: NavItem[]; whatsappHref: string; whatsappLabel: string }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? "Close menu" : "Open menu"}
        className="relative z-40 inline-flex h-10 w-10 items-center justify-center rounded-md border border-line text-ink hover:border-ink"
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
          {open ? <path d="M3 3l12 12M15 3L3 15" /> : <path d="M2 5h14M2 9h14M2 13h14" />}
        </svg>
      </button>
      {open && (
        <div id="mobile-menu" className="fixed inset-0 z-30 flex flex-col bg-paper px-5 pb-8 pt-20">
          <nav aria-label="Menu" className="flex flex-1 flex-col">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="label-caps border-b border-line py-5 text-lg text-ink"
                aria-current={pathname === item.href ? "page" : undefined}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <a href={whatsappHref} rel="noopener" onClick={() => setOpen(false)} className="label-caps text-sm text-ink">
            {whatsappLabel}
          </a>
        </div>
      )}
    </div>
  );
}
