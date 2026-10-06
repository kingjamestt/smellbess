import type { Metadata, Viewport } from "next";
import { Archivo } from "next/font/google";
import { Footer, Header } from "@/components/site-chrome";
import "./globals.css";

// One family for the whole brand. The width axis gives the Expanded cut used
// by the wordmark, labels and display type (business-plan.md §5a).
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Smell Bess | Fine fragrance in Trinidad & Tobago",
    template: "%s | Smell Bess",
  },
  description:
    "Only the best: we only carry scents that are a 10/10 or close, as sealed bottles and decants poured by hand from authentic stock. 5ml, 10ml and 15ml in TTD. Saturday pickup or delivery across T&T.",
  // A design-preview deploy (demo data) stays out of search engines.
  ...(process.env.NEXT_PUBLIC_DESIGN_PREVIEW === "1" ? { robots: { index: false, follow: false } } : {}),
};

export const viewport: Viewport = {
  themeColor: "#121014",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-TT" className={archivo.variable}>
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
      </body>
    </html>
  );
}
