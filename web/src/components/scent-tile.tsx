import Link from "next/link";
import type { ProductView } from "@/lib/catalog";
import { formatTtd, priceFor, TIER_LABELS } from "@/lib/pricing";
import { LowStockBadge, StockBadge } from "./badges";
import { ScentArt } from "./scent-art";

const GENDER: Record<ProductView["gender"], string> = { him: "For him", her: "For her", unisex: "Unisex" };

export function genderLabel(p: Pick<ProductView, "gender" | "leans">) {
  if (p.gender === "unisex" && p.leans) return `Unisex, leans ${p.leans === "her" ? "fem." : "masc."}`;
  return GENDER[p.gender];
}

/** Compact card for the catalog grid. Links to the full scent card. */
export function ScentTile({ product }: { product: ProductView }) {
  // Show the most relevant low-stock warning: 10ml is the main size.
  const low =
    product.stock === "in_stock"
      ? [10, 15, 5].map((size) => product.sizes.find((s) => s.size === size && s.badge)).find(Boolean)
      : undefined;
  return (
    <Link
      href={`/scents/${product.id}`}
      className="card group flex flex-col overflow-hidden transition-shadow hover:shadow-lg"
    >
      <div className="relative">
        <ScentArt hue={product.hue} label={`${product.house} ${product.name}`} className="aspect-square w-full" />
        <div className="absolute left-2 top-2 flex flex-wrap gap-1">
          <StockBadge state={product.stock} />
          {low?.badge && <LowStockBadge text={low.badge} />}
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-1 p-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">{product.house}</p>
        <h3 className="text-lg font-bold leading-tight group-hover:text-hibiscus">{product.name}</h3>
        <p className="text-xs text-muted">
          {genderLabel(product)} · {TIER_LABELS[product.tier]}
        </p>
        {product.smellsLike[0] && <p className="text-sm text-ink">{product.smellsLike[0]}</p>}
        <p className="mt-auto pt-2 text-sm font-semibold">
          from {formatTtd(priceFor(product.tier, 5))} <span className="font-normal text-muted">/ 5ml</span>
        </p>
      </div>
    </Link>
  );
}
