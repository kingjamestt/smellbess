import type { Quote } from "@/lib/offers";
import { formatTtd } from "@/lib/pricing";

/** The one applied offer in plain words, plus nudges toward a better one. */
export function OfferBox({ quote }: { quote: Quote }) {
  if (!quote.offer && quote.hints.length === 0 && quote.messages.length === 0) return null;
  return (
    <div className="space-y-3">
      {quote.freeSample && <FreeSurpriseCard value={quote.freeSample.value} />}
      <section aria-label="Your offer" className="space-y-2 rounded-md bg-mist p-5">
        {quote.offer && <p className="font-medium">{quote.offer.label}</p>}
        {quote.messages.map((m) => (
          <p key={m} className="text-sm leading-relaxed text-muted">
            {m}
          </p>
        ))}
        {quote.hints.map((h) => (
          <p key={h} className="text-sm leading-relaxed text-hibiscus">
            {h}
          </p>
        ))}
      </section>
    </div>
  );
}

/**
 * The free 5ml: the customer doesn't choose, we pick a Tier A scent when
 * packing. The card rises in once and its Amber rule draws across, like the
 * seal on the pouch. Reduced motion shows it settled.
 */
export function FreeSurpriseCard({ value }: { value: number }) {
  return (
    <section aria-live="polite" className="animate-surprise-pop rounded-md bg-ink p-5 text-paper">
      <div className="flex items-start gap-4">
        <span aria-hidden className="wide mt-0.5 flex shrink-0 items-center gap-1.5 text-lg font-light">
          S<span className="h-5 w-px bg-amber-deep" />B
        </span>
        <div className="space-y-1">
          <p className="font-medium">You&apos;ve earned a 5ml, chosen by us.</p>
          <p className="text-sm text-pearl-ink-soft">
            We&apos;ll pick an Arabian we think you&apos;ll like and pack it with your order. Worth {formatTtd(value)}, on us.
          </p>
        </div>
      </div>
      <span aria-hidden className="animate-rule-draw mt-4 block h-0.5 origin-left bg-amber-deep" />
    </section>
  );
}
