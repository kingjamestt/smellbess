"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createAdminOrderAction } from "@/app/admin/actions";
import { useQuote } from "@/components/use-quote";
import type { CatalogSnapshot } from "@/lib/catalog";
import { productLabel } from "@/lib/checkout";
import { paymentOptionsFor, PAYMENT_LABELS, quoteDelivery, ZONE_FEES } from "@/lib/delivery";
import { formatTtd } from "@/lib/pricing";
import type { CartLine, DeliveryMethod, PaymentMethod, SizeMl } from "@/lib/types";

type Row = { key: number; ref: string; size: SizeMl; qty: number };

/** Admin order entry. Rows are "p:<productId>" or "s:<setId>". The server re-prices everything. */
export function AdminOrderForm({ catalog }: { catalog: CatalogSnapshot }) {
  const router = useRouter();
  const live = catalog.products.filter((p) => p.status === "live");
  const [rows, setRows] = useState<Row[]>([{ key: 1, ref: "", size: 10, qty: 1 }]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [method, setMethod] = useState<DeliveryMethod>("workplace");
  const [pickupPointId, setPickupPointId] = useState("");
  const [areaId, setAreaId] = useState("");
  const [paymentChoice, setPaymentChoice] = useState<PaymentMethod>("cash_on_pickup");
  const [errors, setErrors] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const lines: CartLine[] = rows
    .filter((r) => r.ref)
    .map((r) =>
      r.ref.startsWith("s:")
        ? { kind: "set", setId: r.ref.slice(2), size: r.size === 5 ? 5 : 10, qty: r.qty }
        : { kind: "single", productId: r.ref.slice(2), size: r.size, qty: r.qty },
    );
  const { quote, blockers } = useQuote(catalog, { lines });
  const delivery = { method, pickupPointId: pickupPointId || undefined, areaId: areaId || undefined };
  const dq = quoteDelivery(delivery, catalog.delivery);
  const payments = paymentOptionsFor(method);
  const payment = payments.includes(paymentChoice) ? paymentChoice : payments[0];
  const update = (key: number, patch: Partial<Row>) =>
    setRows((rs) => rs.map((r) => (r.key === key ? { ...r, ...patch } : r)));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setErrors([]);
    const res = await createAdminOrderAction({ cart: { lines }, customer: { name, phone, note }, delivery, payment });
    setSaving(false);
    if (res.ok) router.push(`/admin/orders/${res.id}`);
    else setErrors(res.errors);
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <fieldset className="card space-y-3 p-4">
        <legend className="px-1 font-bold">What they want</legend>
        {rows.map((r) => {
          const isSet = r.ref.startsWith("s:");
          return (
            <div key={r.key} className="grid grid-cols-[1fr_auto_auto_auto] items-end gap-2">
              <label>
                <span className="label">Scent or set</span>
                <select className="field" value={r.ref} onChange={(e) => update(r.key, { ref: e.target.value })}>
                  <option value="">Choose…</option>
                  <optgroup label="Scents">
                    {live.map((p) => (
                      <option key={p.id} value={`p:${p.id}`}>
                        {productLabel(p)}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Sets">
                    {catalog.sets.map((s) => (
                      <option key={s.id} value={`s:${s.id}`}>
                        {s.name}
                      </option>
                    ))}
                  </optgroup>
                </select>
              </label>
              <label>
                <span className="label">Size</span>
                <select
                  className="field"
                  value={r.size}
                  onChange={(e) => update(r.key, { size: Number(e.target.value) as SizeMl })}
                >
                  <option value={5}>{isSet ? "3×5ml" : "5ml"}</option>
                  <option value={10}>{isSet ? "3×10ml" : "10ml"}</option>
                  {!isSet && <option value={15}>15ml</option>}
                </select>
              </label>
              <label>
                <span className="label">Qty</span>
                <input
                  className="field w-16"
                  type="number"
                  min={1}
                  max={20}
                  value={r.qty}
                  onChange={(e) => update(r.key, { qty: Math.max(1, Math.min(20, Number(e.target.value) || 1)) })}
                />
              </label>
              <button
                type="button"
                className="chip mb-1"
                aria-label="Remove line"
                onClick={() => setRows((rs) => (rs.length > 1 ? rs.filter((x) => x.key !== r.key) : rs))}
              >
                ✕
              </button>
            </div>
          );
        })}
        <button
          type="button"
          className="chip"
          onClick={() => setRows((rs) => [...rs, { key: Date.now(), ref: "", size: 10, qty: 1 }])}
        >
          + Add line
        </button>
      </fieldset>

      <fieldset className="card space-y-3 p-4">
        <legend className="px-1 font-bold">Customer</legend>
        <label className="block">
          <span className="label">Name</span>
          <input className="field" value={name} onChange={(e) => setName(e.target.value)} required />
        </label>
        <label className="block">
          <span className="label">WhatsApp number</span>
          <input className="field" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required />
        </label>
        <label className="block">
          <span className="label">Note (optional)</span>
          <input className="field" value={note} onChange={(e) => setNote(e.target.value)} />
        </label>
      </fieldset>

      <fieldset className="card space-y-3 p-4">
        <legend className="px-1 font-bold">Getting it to them</legend>
        <div className="flex flex-wrap gap-2">
          {(["workplace", "pickup", "odeliver"] as const).map((m) => (
            <label key={m} className={`chip cursor-pointer ${method === m ? "chip-on" : ""}`}>
              <input type="radio" className="sr-only" checked={method === m} onChange={() => setMethod(m)} />
              {m === "workplace" ? "Workplace (free)" : m === "pickup" ? `${catalog.delivery.pickupDay} pickup` : "ODeliver"}
            </label>
          ))}
        </div>
        {method === "pickup" && (
          <select className="field" value={pickupPointId} onChange={(e) => setPickupPointId(e.target.value)}>
            <option value="">Which stop?</option>
            {catalog.delivery.pickupPoints.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}, {p.time}
              </option>
            ))}
          </select>
        )}
        {method === "odeliver" && (
          <select className="field" value={areaId} onChange={(e) => setAreaId(e.target.value)}>
            <option value="">Which area?</option>
            {catalog.delivery.areas.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name} ({formatTtd(ZONE_FEES[a.zone])})
              </option>
            ))}
          </select>
        )}
        <div className="flex flex-wrap gap-2">
          {payments.map((p) => (
            <label key={p} className={`chip cursor-pointer ${payment === p ? "chip-on" : ""}`}>
              <input type="radio" className="sr-only" checked={payment === p} onChange={() => setPaymentChoice(p)} />
              {PAYMENT_LABELS[p] === "Cash at pickup" ? "Cash" : PAYMENT_LABELS[p]}
            </label>
          ))}
        </div>
      </fieldset>

      <section className="card space-y-1 p-4 text-sm">
        {quote.offer && <p className="font-semibold text-sea">{quote.offer.label}</p>}
        {quote.freeSample && <p className="font-semibold text-hibiscus">+ free 5ml surprise (pick it on the order page)</p>}
        <p>Items: {formatTtd(quote.itemsTotal)}</p>
        <p>Delivery: {dq.ok ? formatTtd(dq.fee) : "choose above"}</p>
        <p className="text-lg font-extrabold">Total: {formatTtd(quote.itemsTotal + (dq.ok ? dq.fee : 0))}</p>
      </section>

      {[...blockers, ...errors].length > 0 && (
        <ul role="alert" className="space-y-1 text-sm font-semibold text-danger">
          {[...new Set([...blockers, ...errors])].map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
      )}
      <button type="submit" className="btn-primary w-full" disabled={saving || lines.length === 0 || !dq.ok}>
        {saving ? "Saving…" : "Save order"}
      </button>
    </form>
  );
}
