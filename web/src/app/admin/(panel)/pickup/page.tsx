import { PickupEditor } from "@/components/admin/pickup-editor";
import { loadAdminData } from "@/lib/admin-ops";

export const metadata = { title: "Pickup run" };

export default async function AdminPickup() {
  const { settings } = await loadAdminData();
  return (
    <div className="max-w-2xl space-y-4">
      <h1 className="text-3xl font-medium">Pickup run</h1>
      <p className="text-muted">
        The stops customers pick at checkout, in route order. Change a time, add or remove a stop. Remove every stop
        to turn pickup off for a week.
      </p>
      <PickupEditor day={settings.pickupDay} points={settings.pickupPoints} />
    </div>
  );
}
