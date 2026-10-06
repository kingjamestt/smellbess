import { AdminOrderForm } from "@/components/admin/admin-order-form";
import { requireAdmin } from "@/lib/auth";
import { getCatalog } from "@/lib/server";

export const metadata = { title: "New order" };

export default async function NewAdminOrder() {
  await requireAdmin();
  const catalog = await getCatalog();
  return (
    <div className="max-w-2xl space-y-4">
      <h1 className="text-3xl font-medium">New order</h1>
      <p className="text-muted">
        For orders that come in on WhatsApp or at work. Same prices, offers and stock checks as the shop.
      </p>
      <AdminOrderForm catalog={catalog} />
    </div>
  );
}
