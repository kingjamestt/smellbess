import Link from "next/link";
import { notFound } from "next/navigation";
import { ActionForm } from "@/components/admin/action-form";
import { loadAdminData } from "@/lib/admin-ops";
import { productLabel } from "@/lib/checkout";
import { PAYMENT_LABELS } from "@/lib/delivery";
import { nextStatuses, STATUS_LABELS } from "@/lib/pipeline";
import { formatTtd } from "@/lib/pricing";
import { orderMessage } from "@/lib/whatsapp";
import { advanceOrderAction, pickFreeSampleAction } from "../../../actions";

export const metadata = { title: "Order" };

type Props = { params: Promise<{ id: string }> };

const NEXT_LABEL: Record<string, string> = {
  paid: "Mark paid",
  decanted: "Mark decanted (takes ml from bottles)",
  ready: "Ready for pickup",
  out_for_delivery: "Out for delivery",
  done: "Done",
};

export default async function AdminOrder({ params }: Props) {
  const { id } = await params;
  const { orders, products, available, settings } = await loadAdminData();
  const order = orders.find((o) => o.id === id);
  if (!order) notFound();

  const next = nextStatuses(order).filter((s) => s !== "cancelled");
  const canCancel = nextStatuses(order).includes("cancelled");
  const free = order.lines.find((l) => l.kind === "free");
  const freeEditable = free && (order.status === "new" || order.status === "paid");
  const freeOptions = products
    .filter((p) => p.status === "live" && p.tier === "A")
    .map((p) => ({ p, ml: (available[p.id] ?? 0) + (free?.productId === p.id ? 5 : 0) }))
    .filter(({ ml }) => ml >= 5)
    .sort((a, b) => b.ml - a.ml);
  const phoneDigits = order.customer.phone.replace(/\D/g, "");
  const created = new Date(order.createdAt).toLocaleString("en-TT", { timeZone: "America/Port_of_Spain" });

  return (
    <div className="max-w-2xl space-y-5">
      <Link href="/admin/orders" className="text-sm underline">
        ← Orders
      </Link>
      <div className="space-y-1">
        <h1 className="text-3xl font-medium">
          {order.number} · {formatTtd(order.totals.total)}
        </h1>
        <p className="text-muted">
          <span className="chip mr-2">{STATUS_LABELS[order.status]}</span>
          {created}
        </p>
      </div>

      {(next.length > 0 || canCancel) && (
        <section className="card space-y-3 p-4">
          <h2 className="text-lg font-bold">Next step</h2>
          <div className="flex flex-wrap gap-2">
            {next.map((to) => (
              <ActionForm key={to} action={advanceOrderAction} className="flex flex-wrap gap-2">
                <input type="hidden" name="id" value={order.id} />
                <input type="hidden" name="to" value={to} />
                <button type="submit" className="btn-primary">
                  {NEXT_LABEL[to] ?? STATUS_LABELS[to]}
                </button>
              </ActionForm>
            ))}
            {canCancel && (
              <ActionForm
                action={advanceOrderAction}
                confirmText={`Cancel ${order.number}? This frees its stock.`}
                className="flex flex-wrap gap-2"
              >
                <input type="hidden" name="id" value={order.id} />
                <input type="hidden" name="to" value="cancelled" />
                <button type="submit" className="btn-secondary">
                  Cancel order
                </button>
              </ActionForm>
            )}
          </div>
        </section>
      )}

      {free && (
        <section className="card space-y-2 border-hibiscus p-4">
          <h2 className="text-lg font-bold">Free 5ml surprise</h2>
          <p className="text-sm">
            {free.productId ? (
              <>
                Picked: <strong>{free.label}</strong>
              </>
            ) : (
              "Not picked yet. Choose a Tier A scent, ideally one that's selling slowly."
            )}
          </p>
          {freeEditable && (
            <ActionForm action={pickFreeSampleAction} className="flex flex-wrap gap-2" okText="Saved.">
              <input type="hidden" name="id" value={order.id} />
              <select name="productId" className="field max-w-xs" defaultValue={free.productId ?? ""} required>
                <option value="">Choose a scent…</option>
                {freeOptions.map(({ p, ml }) => (
                  <option key={p.id} value={p.id}>
                    {productLabel(p)} ({ml}ml free)
                  </option>
                ))}
              </select>
              <button type="submit" className="btn-secondary">
                Save pick
              </button>
            </ActionForm>
          )}
        </section>
      )}

      <section className="card space-y-2 p-4">
        <h2 className="text-lg font-bold">Customer</h2>
        <p>
          <strong>{order.customer.name}</strong> · {order.customer.phone}
        </p>
        {order.customer.note && <p className="rounded-xl bg-mist p-2 text-sm">“{order.customer.note}”</p>}
        <a href={`https://wa.me/${phoneDigits}`} className="btn-whatsapp" rel="noopener">
          WhatsApp {order.customer.name.split(" ")[0]}
        </a>
      </section>

      <section className="card space-y-2 p-4">
        <h2 className="text-lg font-bold">Items</h2>
        <ul className="space-y-1 text-sm">
          {order.lines.map((l, i) => (
            <li key={i} className="flex justify-between gap-2">
              <span>
                {l.kind === "free"
                  ? `Free 5ml: ${l.productId ? l.label : "surprise (not picked)"}`
                  : l.kind === "set"
                    ? `${l.qty}× ${l.label} set 3×${l.size}ml (${l.items.map((x) => x.label).join(", ")})`
                    : l.kind === "bottle"
                      ? `${l.qty}× ${l.label} SEALED ${l.sizeMl}ml bottle (pack whole)`
                      : `${l.qty}× ${l.label} ${l.size}ml${l.shipsAsSplit ? " (as 10ml + 5ml)" : ""}`}
              </span>
              <span>{l.kind === "free" ? "FREE" : formatTtd(l.unitPrice * l.qty)}</span>
            </li>
          ))}
        </ul>
        {order.offer && <p className="text-sm text-sea">{order.offer.label}</p>}
        <dl className="space-y-1 border-t border-line pt-2 text-sm">
          <div className="flex justify-between">
            <dt>Subtotal</dt>
            <dd>{formatTtd(order.totals.subtotal)}</dd>
          </div>
          {order.totals.discount > 0 && (
            <div className="flex justify-between">
              <dt>Offer</dt>
              <dd>−{formatTtd(order.totals.discount)}</dd>
            </div>
          )}
          <div className="flex justify-between">
            <dt>Delivery</dt>
            <dd>{formatTtd(order.totals.delivery)}</dd>
          </div>
          <div className="flex justify-between font-bold">
            <dt>Total</dt>
            <dd>{formatTtd(order.totals.total)}</dd>
          </div>
        </dl>
      </section>

      <section className="card space-y-1 p-4 text-sm">
        <h2 className="text-lg font-bold">Delivery and payment</h2>
        <p>{order.delivery.label}</p>
        <p>{PAYMENT_LABELS[order.payment]}</p>
        {order.utm?.source && (
          <p className="text-muted">
            Came from: {order.utm.source}
            {order.utm.campaign ? ` / ${order.utm.campaign}` : ""}
          </p>
        )}
      </section>

      <details className="card p-4 text-sm">
        <summary className="cursor-pointer font-semibold">Order message (as the customer sent it)</summary>
        <pre className="mt-2 whitespace-pre-wrap font-sans">{orderMessage(order, settings.pickupDay)}</pre>
      </details>
    </div>
  );
}
