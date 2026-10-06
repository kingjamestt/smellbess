import type { Metadata } from "next";
import { CheckoutForm } from "@/components/checkout-form";
import { getCatalog } from "@/lib/server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Checkout", robots: { index: false } };

export default async function CheckoutPage() {
  const catalog = await getCatalog();
  return (
    <div className="container-page pb-6 pt-8 md:pt-12">
      <h1 className="wordmark mb-8 text-[1.75rem] leading-tight lg:text-[2.25rem]">Checkout</h1>
      <CheckoutForm catalog={catalog} pickupDay={catalog.delivery.pickupDay} />
    </div>
  );
}
