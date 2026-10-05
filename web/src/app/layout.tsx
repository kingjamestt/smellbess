import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import { LOOK_BOOT_SCRIPT, LookSwitcher } from "@/components/look-switcher";
import { Footer, Header } from "@/components/site-chrome";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Smell Bess | Fire fragrance decants in Trinidad & Tobago",
    template: "%s | Smell Bess",
  },
  description:
    "Only the bess scents: strong performers and proven compliment-getters, decanted by hand from authentic bottles. 5ml, 10ml and 15ml in TTD. Saturday pickup or delivery across T&T.",
};

export const viewport: Viewport = {
  themeColor: "#c4145a",
};

/** DESIGN PREVIEW: the look switcher shows in dev, or when NEXT_PUBLIC_DESIGN_PREVIEW=1. */
const showLookSwitcher = process.env.NODE_ENV !== "production" || process.env.NEXT_PUBLIC_DESIGN_PREVIEW === "1";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // The boot script may change data-look before React hydrates.
    <html lang="en-TT" className={bricolage.variable} data-look="carnival" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: LOOK_BOOT_SCRIPT }} />
      </head>
      <body className="flex min-h-dvh flex-col antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:rounded focus:bg-inverse focus:px-3 focus:py-2 focus:text-on-inverse"
        >
          Skip to content
        </a>
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
        {showLookSwitcher && <LookSwitcher />}
      </body>
    </html>
  );
}
