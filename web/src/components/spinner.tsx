/**
 * Smell Bess loading spinner, drawn from the seal: a faint Pearl ring with an
 * Amber arc that sweeps round and breathes in and out. The large size keeps
 * the S|B monogram still in the middle. With reduced motion the arc stops
 * as a quarter ring (globals.css shortens every animation), which still
 * reads as "working".
 */
export function Spinner({
  size = "md",
  label = "Loading",
  arc = "accent",
  className = "",
}: {
  size?: "sm" | "md" | "lg";
  /** "current" draws the arc in the text colour, for use on an Amber button. */
  arc?: "accent" | "current";
  /** Read by screen readers. Hidden visually except on the large size. */
  label?: string;
  className?: string;
}) {
  const px = { sm: 18, md: 40, lg: 112 }[size];
  const stroke = { sm: 2.5, md: 1.6, lg: 0.9 }[size];
  return (
    <span role="status" className={`inline-flex flex-col items-center gap-4 ${className}`}>
      <span className="relative inline-grid place-items-center" style={{ width: px, height: px }}>
        <svg viewBox="0 0 40 40" width={px} height={px} aria-hidden className="absolute inset-0">
          <circle cx="20" cy="20" r="17" fill="none" stroke="currentColor" strokeOpacity="0.18" strokeWidth={stroke} />
          {size === "lg" && (
            <circle cx="20" cy="20" r="14.6" fill="none" stroke="currentColor" strokeOpacity="0.12" strokeWidth={stroke * 0.6} />
          )}
          <g className="spinner-sweep">
            <circle
              cx="20"
              cy="20"
              r="17"
              fill="none"
              strokeWidth={stroke}
              strokeLinecap="round"
              className={`spinner-arc ${arc === "accent" ? "stroke-hibiscus" : "stroke-current"}`}
            />
          </g>
        </svg>
        {size === "lg" && (
          <span aria-hidden className="wide flex items-center gap-2 text-xl font-light">
            <span>S</span>
            <span className="spinner-line h-6 w-px bg-hibiscus" />
            <span>B</span>
          </span>
        )}
      </span>
      <span className={size === "lg" ? "label-caps text-muted" : "sr-only"}>{label}</span>
    </span>
  );
}

/** Full-area loading state for route segments (loading.tsx). */
export function LoadingScreen({ label = "One moment" }: { label?: string }) {
  return (
    <div className="grid min-h-[60dvh] place-items-center px-4 py-16">
      <Spinner size="lg" label={label} />
    </div>
  );
}
