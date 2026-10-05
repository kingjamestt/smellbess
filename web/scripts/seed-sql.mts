/**
 * Prints SQL that loads the catalog from src/data/seed.ts into Supabase:
 * products, sets, delivery areas, settings and the owner's real shelf bottles.
 * Safe to re-run: catalog rows are upserted, and settings and bottles are only
 * inserted if missing (so it never overwrites what the owners changed in admin).
 *
 *   node scripts/seed-sql.mts > /tmp/seed.sql   (Node 24)
 */
import { AREAS, DEFAULT_SETTINGS, OWNER_SHELF_BOTTLES, PRODUCTS, SETS } from "../src/data/seed.ts";

const q = (v: string) => `'${v.replace(/'/g, "''")}'`;
const j = (v: unknown) => `${q(JSON.stringify(v))}::jsonb`;

const out: string[] = ["begin;"];

const products = PRODUCTS.map(({ id, ...data }, i) => `(${q(id)}, ${i}, ${j(data)})`);
out.push(
  `insert into public.products (id, sort, data) values\n${products.join(",\n")}\n` +
    `on conflict (id) do update set sort = excluded.sort, data = excluded.data, updated_at = now();`,
);

const sets = SETS.map(({ id, ...data }, i) => `(${q(id)}, ${i}, ${j(data)})`);
out.push(
  `insert into public.sets (id, sort, data) values\n${sets.join(",\n")}\n` +
    `on conflict (id) do update set sort = excluded.sort, data = excluded.data, updated_at = now();`,
);

const areas = AREAS.map((a, i) => `(${q(a.id)}, ${q(a.name)}, ${q(a.zone)}, ${i})`);
out.push(`insert into public.areas (id, name, zone, sort) values\n${areas.join(",\n")}\non conflict (id) do nothing;`);

const s = DEFAULT_SETTINGS;
out.push(
  `insert into public.settings (id, atomizers, low_stock_threshold, pickup_day, pickup_points) values ` +
    `(1, ${j(s.atomizers)}, ${s.lowStockThreshold}, ${q(s.pickupDay)}, ${j(s.pickupPoints)})\non conflict (id) do nothing;`,
);

const bottles = OWNER_SHELF_BOTTLES.map(
  (b) => `(${q(b.id)}, ${q(b.productId)}, ${b.sizeMl}, ${b.mlRemaining}, ${b.costTtd}, ${q(b.source)})`,
);
out.push(
  `insert into public.bottles (id, product_id, size_ml, ml_remaining, cost_ttd, source) values\n${bottles.join(",\n")}\non conflict (id) do nothing;`,
);

out.push("commit;");
console.log(out.join("\n\n"));
