import type { Metadata } from "next";
import { CartView } from "@/components/cart-view";
import { getCatalog } from "@/lib/server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Your cart", robots: { index: false } };

export default async function CartPage() {
  const catalog = await getCatalog();
  return (
    <div className="container-page py-6">
      <h1 className="mb-4 text-3xl font-extrabold">Your cart</h1>
      <CartView catalog={catalog} />
    </div>
  );
}
