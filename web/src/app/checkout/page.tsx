import type { Metadata } from "next";
import { CheckoutForm } from "@/components/checkout-form";
import { getCatalog } from "@/lib/server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Checkout", robots: { index: false } };

export default async function CheckoutPage() {
  const catalog = await getCatalog();
  return (
    <div className="container-page py-6">
      <h1 className="mb-4 text-3xl font-extrabold">Checkout</h1>
      <CheckoutForm catalog={catalog} pickupDay={catalog.delivery.pickupDay} />
    </div>
  );
}
