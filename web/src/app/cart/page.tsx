import type { Metadata } from "next";
import { CartView } from "@/components/cart-view";
import { getCatalog } from "@/lib/server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Your cart", robots: { index: false } };

export default async function CartPage() {
  const catalog = await getCatalog();
  return (
    <div className="container-page pb-6 pt-8 md:pt-12">
      <h1 className="wordmark mb-8 text-[1.75rem] leading-tight lg:text-[2.25rem]">Your cart</h1>
      <CartView catalog={catalog} />
    </div>
  );
}
