import { ActionForm } from "@/components/admin/action-form";
import { loadAdminData } from "@/lib/admin-ops";
import { ZONE_FEES, ZONE_LABELS } from "@/lib/delivery";
import { formatTtd } from "@/lib/pricing";
import type { Zone } from "@/lib/types";
import { saveAreaAction } from "../../actions";

export const metadata = { title: "Zones" };

const ZONES: Zone[] = ["urban", "rural", "extended", "remote", "tobago"];

function ZoneSelect({ value }: { value?: Zone }) {
  return (
    <select name="zone" className="field w-44" defaultValue={value ?? ""} required>
      <option value="">Zone…</option>
      {ZONES.map((z) => (
        <option key={z} value={z}>
          {ZONE_LABELS[z]} ({formatTtd(ZONE_FEES[z])})
        </option>
      ))}
    </select>
  );
}

export default async function AdminZones() {
  const { areas } = await loadAdminData();
  return (
    <div className="max-w-2xl space-y-4">
      <h1 className="text-3xl font-extrabold">Delivery zones</h1>
      <p className="text-muted">
        Which ODeliver zone each area is in. The list is our best guess: correct it against ODeliver&apos;s own area
        list.
      </p>
      <ul className="space-y-2">
        {areas.map((a) => (
          <li key={a.id}>
            <ActionForm action={saveAreaAction} className="card flex flex-wrap items-center gap-2 p-2" okText="Saved.">
              <input type="hidden" name="id" value={a.id} />
              <input name="name" defaultValue={a.name} className="field flex-1" aria-label="Area name" />
              <ZoneSelect value={a.zone} />
              <button type="submit" className="btn-secondary">
                Save
              </button>
            </ActionForm>
          </li>
        ))}
      </ul>
      <section className="card space-y-2 p-4">
        <h2 className="font-bold">Add an area</h2>
        <ActionForm action={saveAreaAction} className="flex flex-wrap items-center gap-2" okText="Area added.">
          <input name="name" placeholder="e.g. Valsayn" className="field flex-1" aria-label="Area name" required />
          <ZoneSelect />
          <button type="submit" className="btn-primary">
            Add
          </button>
        </ActionForm>
      </section>
    </div>
  );
}
