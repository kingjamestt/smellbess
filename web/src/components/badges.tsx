import { STOCK_LABELS, type StockState } from "@/lib/stock";

export function DraftBadge({ className = "" }: { className?: string }) {
  return (
    <span
      title="Draft copy: we'll rewrite this in our own words"
      className={`inline-flex items-center rounded-md border border-dashed border-muted px-1.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-muted ${className}`}
    >
      DRAFT
    </span>
  );
}

const STOCK_STYLES: Record<StockState, string> = {
  in_stock: "bg-sea text-on-sea",
  sold_out: "bg-inverse text-on-inverse",
  arriving: "bg-sun text-on-sun",
  coming_soon: "bg-mist text-ink border border-line",
  retired: "bg-mist text-muted",
};

export function StockBadge({ state }: { state: StockState }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold ${STOCK_STYLES[state]}`}>
      {STOCK_LABELS[state]}
    </span>
  );
}

export function LowStockBadge({ text }: { text: string }) {
  return (
    <span className="inline-flex rounded-full bg-sun px-2.5 py-0.5 text-xs font-bold text-on-sun">{text}</span>
  );
}
