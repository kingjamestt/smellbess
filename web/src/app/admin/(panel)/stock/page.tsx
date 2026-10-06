import { ActionForm } from "@/components/admin/action-form";
import { loadAdminData } from "@/lib/admin-ops";
import { productLabel } from "@/lib/checkout";
import { formatTtd } from "@/lib/pricing";
import { bottleKey } from "@/lib/stock";
import { deleteBottleAction, saveBottleAction, saveStockSettingsAction } from "../../actions";

export const metadata = { title: "Stock" };

export default async function AdminStock() {
  const { products, bottles, available, settings } = await loadAdminData();
  const live = products.filter((p) => p.status !== "retired");

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-medium">Stock</h1>

      <section className="card space-y-3 p-4">
        <h2 className="text-lg font-bold">Atomizers and alerts</h2>
        <ActionForm action={saveStockSettingsAction} className="flex flex-wrap items-end gap-4" okText="Saved.">
          {([5, 10, 15] as const).map((size) => (
            <label key={size} className="flex items-center gap-2">
              <input type="checkbox" name={`a${size}`} defaultChecked={settings.atomizers[size]} className="h-5 w-5" />
              {size}ml atomizers in stock
            </label>
          ))}
          <label>
            <span className="label">Low-stock badge at (units left)</span>
            <input
              name="lowStockThreshold"
              type="number"
              min={0}
              max={50}
              defaultValue={settings.lowStockThreshold}
              className="field w-24"
            />
          </label>
          <button type="submit" className="btn-secondary">
            Save
          </button>
        </ActionForm>
        <p className="text-sm text-muted">
          With 15ml atomizers off, 15ml still sells but ships as a 10ml + 5ml.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold">Bottles</h2>
        <p className="text-sm text-muted">
          &quot;Free&quot; is what the shop can still sell: ml in the open bottles minus what open orders have
          claimed. Decanting an order takes its ml out automatically; edit here after spills, tests or a new bottle.
          A <strong className="text-ink">sealed</strong> bottle is sold whole and never decanted. Packing its order
          marks it sold; tick &quot;Sold&quot; yourself for a sale made off the site.
        </p>
        {live.map((p) => {
          const own = bottles.filter((b) => b.productId === p.id);
          if (own.length === 0 && p.status !== "live") return null;
          return (
            <div key={p.id} className="card space-y-2 p-3">
              <p className="flex flex-wrap justify-between gap-2 font-semibold">
                <span>
                  {productLabel(p)} <span className="text-sm font-normal text-muted">({p.tier})</span>
                </span>
                <span className="text-sm">
                  {available[p.id] ?? 0}ml free
                  {p.bottle && (
                    <span className="text-muted">
                      {" "}
                      · {available[bottleKey(p.id)] ?? 0} sealed for sale at {formatTtd(p.bottle.price)}
                    </span>
                  )}
                </span>
              </p>
              {own.length === 0 && <p className="text-sm text-muted">No bottle yet: shows as &quot;arriving soon&quot;.</p>}
              {own.map((b) => (
                <div key={b.id} className="flex flex-wrap items-end gap-2">
                  <ActionForm action={saveBottleAction} className="flex flex-wrap items-end gap-2" okText="Saved.">
                    <input type="hidden" name="id" value={b.id} />
                    <input type="hidden" name="productId" value={b.productId} />
                    <input type="hidden" name="sizeMl" value={b.sizeMl} />
                    <input type="hidden" name="source" value={b.source} />
                    <input type="hidden" name="openedAt" value={b.openedAt ?? ""} />
                    {b.isTester && <input type="hidden" name="isTester" value="on" />}
                    {b.sealed && <input type="hidden" name="sealed" value="on" />}
                    <input type="hidden" name="soldAt" value={b.soldAt ?? ""} />
                    <span className="min-w-20 text-sm font-semibold">
                      {b.id} <span className="font-normal text-muted">/ {b.sizeMl}ml</span>
                      {b.sealed && <span className="label-caps ml-2 text-hibiscus">Sealed</span>}
                    </span>
                    {b.sealed ? (
                      <>
                        <input type="hidden" name="mlRemaining" value={b.mlRemaining} />
                        <label className="flex min-h-11 items-center gap-2">
                          <input type="checkbox" name="sold" defaultChecked={!!b.soldAt} className="h-5 w-5" />
                          Sold{b.soldAt ? ` (${b.soldAt.slice(0, 10)})` : ""}
                        </label>
                      </>
                    ) : (
                      <label>
                        <span className="label">ml left</span>
                        <input
                          name="mlRemaining"
                          type="number"
                          step="0.5"
                          min={0}
                          max={b.sizeMl}
                          defaultValue={b.mlRemaining}
                          className="field w-24"
                        />
                      </label>
                    )}
                    <label>
                      <span className="label">Cost TT$</span>
                      <input name="costTtd" type="number" min={0} defaultValue={b.costTtd} className="field w-24" />
                    </label>
                    <button type="submit" className="btn-secondary">
                      Save
                    </button>
                  </ActionForm>
                  <ActionForm action={deleteBottleAction} confirmText={`Delete bottle ${b.id}?`}>
                    <input type="hidden" name="id" value={b.id} />
                    <button type="submit" className="chip">
                      Delete
                    </button>
                  </ActionForm>
                </div>
              ))}
            </div>
          );
        })}
      </section>

      <section className="card space-y-3 p-4">
        <h2 className="text-lg font-bold">Add a bottle</h2>
        <ActionForm action={saveBottleAction} className="grid gap-3 sm:grid-cols-2" okText="Bottle added.">
          <label>
            <span className="label">Scent</span>
            <select name="productId" className="field" required defaultValue="">
              <option value="">Choose…</option>
              {live.map((p) => (
                <option key={p.id} value={p.id}>
                  {productLabel(p)}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span className="label">Bottle ID (written on the bottle)</span>
            <input name="id" className="field" placeholder="KH-02" required />
          </label>
          <label>
            <span className="label">Bottle size (ml)</span>
            <input name="sizeMl" type="number" min={1} max={500} defaultValue={100} className="field" required />
          </label>
          <label>
            <span className="label">ml left (usable)</span>
            <input name="mlRemaining" type="number" step="0.5" min={0} defaultValue={95} className="field" required />
          </label>
          <label>
            <span className="label">Landed cost TT$</span>
            <input name="costTtd" type="number" min={0} className="field" required />
          </label>
          <label>
            <span className="label">Source</span>
            <input name="source" className="field" placeholder="Jomashop" />
          </label>
          <label>
            <span className="label">Opened on</span>
            <input name="openedAt" type="date" className="field" />
          </label>
          <label className="flex items-center gap-2 self-end pb-2">
            <input type="checkbox" name="isTester" className="h-5 w-5" /> Tester bottle
          </label>
          <label className="flex items-center gap-2 sm:col-span-2">
            <input type="checkbox" name="sealed" className="h-5 w-5" /> Keep sealed: sell it whole, never decant
            (needs a sealed price on the scent)
          </label>
          <button type="submit" className="btn-primary sm:col-span-2">
            Add bottle
          </button>
        </ActionForm>
      </section>
    </div>
  );
}
