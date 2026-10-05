import type { Quote } from "@/lib/offers";
import { formatTtd } from "@/lib/pricing";

/** Shows the one applied offer in plain words, plus nudges toward a better one. */
export function OfferBox({ quote }: { quote: Quote }) {
  if (!quote.offer && quote.hints.length === 0 && quote.messages.length === 0) return null;
  return (
    <div className="space-y-3">
      {quote.freeSample && <FreeSurpriseCard value={quote.freeSample.value} />}
      <section aria-label="Offer" className="space-y-2 rounded-2xl border-2 border-sun bg-sun/15 p-4">
        {quote.offer && <p className="font-display text-lg font-extrabold">{quote.offer.label}</p>}
        {quote.messages.map((m) => (
          <p key={m} className="text-sm">
            {m}
          </p>
        ))}
        {quote.hints.map((h) => (
          <p key={h} className="text-sm font-semibold text-sea">
            {h}
          </p>
        ))}
      </section>
    </div>
  );
}

/**
 * "You qualify" card for the free 5ml. The customer doesn't choose: we pick a
 * Tier A scent when packing. Pops in once; motion is off with reduced motion.
 */
export function FreeSurpriseCard({ value }: { value: number }) {
  return (
    <section
      aria-live="polite"
      className="animate-surprise-pop relative overflow-hidden rounded-2xl bg-hibiscus p-4 text-on-hibiscus"
    >
      <span aria-hidden className="animate-sparkle absolute top-1.5 left-2 text-sm text-sun">
        ✦
      </span>
      <span aria-hidden className="animate-sparkle absolute bottom-2 left-15 text-xs text-sun [animation-delay:0.6s]">
        ✦
      </span>
      <div className="flex items-center gap-3">
        <GiftIcon />
        <div>
          <p className="font-display text-lg font-extrabold">You qualify for a free 5ml!</p>
          <p className="text-sm">
            A surprise Arabian picked by us goes in your bag. Worth {formatTtd(value)}, yours free.
          </p>
        </div>
      </div>
    </section>
  );
}

function GiftIcon() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 48 48"
      className="animate-gift-shake h-12 w-12 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinejoin="round"
    >
      <rect x="7" y="20" width="34" height="22" rx="3" fill="var(--sun)" stroke="var(--ink)" />
      <rect x="4" y="13" width="40" height="9" rx="3" fill="var(--sun)" stroke="var(--ink)" />
      <path d="M24 13v29" stroke="var(--ink)" />
      <path d="M24 13c-3-7-12-8-12-3s9 3 12 3c3 0 12 2 12-3s-9-4-12 3Z" fill="var(--paper)" stroke="var(--ink)" />
    </svg>
  );
}
