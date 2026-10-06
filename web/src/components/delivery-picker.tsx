"use client";

import { METHOD_LABELS, ZONE_FEES, ZONE_LABELS, type DeliveryConfig } from "@/lib/delivery";
import { formatTtd } from "@/lib/pricing";
import type { DeliveryMethod, Zone } from "@/lib/types";

export interface DeliveryState {
  method: DeliveryMethod;
  pickupPointId?: string;
  areaId?: string;
}

const ZONES: Zone[] = ["urban", "rural", "extended", "remote", "tobago"];

export function DeliveryPicker({
  config,
  pickupDay,
  value,
  onChange,
}: {
  config: DeliveryConfig;
  pickupDay: string;
  value: DeliveryState;
  onChange: (next: DeliveryState) => void;
}) {
  const methods: { id: DeliveryMethod; price: string; blurb: string }[] = [
    { id: "pickup", price: "Free", blurb: `${pickupDay} pickup run. Cash or transfer.` },
    { id: "odeliver", price: "TT$30-90", blurb: "Courier anywhere in T&T, priced by zone." },
  ];

  return (
    <div className="space-y-4">
      <fieldset className="space-y-2">
        <legend className="label">How do you want it?</legend>
        {methods.map((m) => (
          <label
            key={m.id}
            className={`flex cursor-pointer items-start gap-3 rounded-md border p-3 ${
              value.method === m.id ? "border-ink bg-mist" : "border-line"
            }`}
          >
            <input
              type="radio"
              name="method"
              className="mt-1 h-5 w-5 accent-[var(--hibiscus)]"
              checked={value.method === m.id}
              onChange={() => onChange({ method: m.id })}
            />
            <span className="flex-1">
              <span className="flex justify-between gap-2 font-medium">
                {METHOD_LABELS[m.id]} <span>{m.price}</span>
              </span>
              <span className="block text-sm text-muted">{m.blurb}</span>
            </span>
          </label>
        ))}
      </fieldset>

      {value.method === "pickup" && (
        <fieldset className="space-y-2">
          <legend className="label">Pick your {pickupDay} stop</legend>
          {config.pickupPoints.map((p) => (
            <label
              key={p.id}
              className={`flex cursor-pointer items-center gap-3 rounded-md border p-3 ${
                value.pickupPointId === p.id ? "border-ink bg-mist" : "border-line"
              }`}
            >
              <input
                type="radio"
                name="pickup"
                className="h-5 w-5 accent-[var(--hibiscus)]"
                checked={value.pickupPointId === p.id}
                onChange={() => onChange({ ...value, pickupPointId: p.id })}
              />
              <span className="flex-1 font-medium">{p.name}</span>
              <span className="font-medium">{p.time}</span>
            </label>
          ))}
        </fieldset>
      )}

      {value.method === "odeliver" && (
        <label className="block">
          <span className="label">Your area</span>
          <select
            className="field"
            value={value.areaId ?? ""}
            onChange={(e) => onChange({ ...value, areaId: e.target.value || undefined })}
          >
            <option value="">Choose your area…</option>
            {ZONES.map((zone) => {
              const areas = config.areas.filter((a) => a.zone === zone);
              if (!areas.length) return null;
              return (
                <optgroup key={zone} label={`${ZONE_LABELS[zone]}: ${formatTtd(ZONE_FEES[zone])}`}>
                  {areas.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name}
                    </option>
                  ))}
                </optgroup>
              );
            })}
          </select>
          <span className="mt-1 block text-xs text-muted">
            Area not listed, or need it same day? Message us on WhatsApp and we&apos;ll quote it.
          </span>
        </label>
      )}
    </div>
  );
}
