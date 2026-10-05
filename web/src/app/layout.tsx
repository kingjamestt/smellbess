import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque } from "next/font/google";
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-TT" className={bricolage.variable}>
      <body className="flex min-h-dvh flex-col antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:rounded focus:bg-ink focus:px-3 focus:py-2 focus:text-paper"
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
