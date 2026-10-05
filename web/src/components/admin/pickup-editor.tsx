"use client";

import { useState } from "react";
import { savePickupAction } from "@/app/admin/actions";
import type { PickupPoint } from "@/lib/types";
import { ActionForm } from "./action-form";

export function PickupEditor({ day, points }: { day: string; points: PickupPoint[] }) {
  const [rows, setRows] = useState(points.map((p, i) => ({ ...p, key: i })));
  const move = (i: number, d: -1 | 1) =>
    setRows((rs) => {
      const j = i + d;
      if (j < 0 || j >= rs.length) return rs;
      const next = [...rs];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });

  return (
    <ActionForm action={savePickupAction} className="space-y-3" okText="Saved. Checkout shows the new stops now.">
      <label className="block">
        <span className="label">Day</span>
        <input name="pickupDay" defaultValue={day} className="field max-w-48" required />
      </label>
      <ol className="space-y-2">
        {rows.map((r, i) => (
          <li key={r.key} className="card flex flex-wrap items-end gap-2 p-2">
            <input type="hidden" name="pid" value={r.id} />
            <label className="flex-1">
              <span className="label">Stop</span>
              <input name="name" defaultValue={r.name} className="field" required />
            </label>
            <label>
              <span className="label">Time</span>
              <input name="time" defaultValue={r.time} className="field w-28" placeholder="10:00am" required />
            </label>
            <span className="flex gap-1 pb-1">
              <button type="button" className="chip" aria-label="Move up" onClick={() => move(i, -1)}>
                ↑
              </button>
              <button type="button" className="chip" aria-label="Move down" onClick={() => move(i, 1)}>
                ↓
              </button>
              <button
                type="button"
                className="chip"
                aria-label="Remove stop"
                onClick={() => setRows((rs) => rs.filter((x) => x.key !== r.key))}
              >
                ✕
              </button>
            </span>
          </li>
        ))}
      </ol>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className="btn-secondary"
          onClick={() => setRows((rs) => [...rs, { id: "", name: "", time: "", key: Date.now() }])}
        >
          + Add stop
        </button>
        <button type="submit" className="btn-primary">
          Save pickup run
        </button>
      </div>
    </ActionForm>
  );
}
