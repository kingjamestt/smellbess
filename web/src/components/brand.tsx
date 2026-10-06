/**
 * Smell Bess brand marks (business-plan.md §5a). The wordmark is type, not an
 * image: Archivo Expanded Light caps, tracked 0.22em, with BESS in Amber.
 */

export function Wordmark({
  size = "md",
  rule = false,
  descriptor = false,
  className = "",
}: {
  size?: "sm" | "md" | "lg";
  rule?: boolean;
  descriptor?: boolean;
  className?: string;
}) {
  const text = { sm: "text-[0.95rem]", md: "text-xl", lg: "text-3xl sm:text-5xl" }[size];
  const ruleW = { sm: "w-6", md: "w-10", lg: "w-16" }[size];
  return (
    <span className={`inline-flex flex-col items-start gap-2 ${className}`}>
      {/* The trailing tracking would push the word off-centre, so it's trimmed with a negative margin. */}
      <span className={`wordmark whitespace-nowrap ${text}`}>
        Smell <span className="text-hibiscus">Bess</span>
      </span>
      {rule && <span aria-hidden className={`h-0.5 ${ruleW} bg-hibiscus`} />}
      {descriptor && <span className="label-caps text-muted">Fine fragrance</span>}
    </span>
  );
}

/** S and B split by one Amber line. */
export function Monogram({ className = "" }: { className?: string }) {
  return (
    <span aria-hidden className={`wide inline-flex items-center gap-[0.35em] font-light leading-none ${className}`}>
      <span>S</span>
      <span className="h-[1.1em] w-px bg-hibiscus" />
      <span>B</span>
    </span>
  );
}

/**
 * The seal: thin double rings, the promise around the edge, the monogram in
 * the middle. `id` must be unique on the page (it names the text path).
 */
export function Seal({ id = "seal", className = "" }: { id?: string; className?: string }) {
  const ring = `${id}-ring`;
  return (
    <svg viewBox="0 0 200 200" role="img" aria-label="Smell Bess seal: only the best, Trinidad and Tobago" className={className}>
      <defs>
        <path id={ring} d="M100,100 m-77,0 a77,77 0 1,1 154,0 a77,77 0 1,1 -154,0" />
      </defs>
      <g fill="none" stroke="currentColor">
        <circle cx="100" cy="100" r="96" strokeWidth="1.2" />
        <circle cx="100" cy="100" r="92" strokeWidth="0.5" />
        <circle cx="100" cy="100" r="64" strokeWidth="0.5" />
      </g>
      <text fill="currentColor" fontSize="9.5" style={{ fontStretch: "125%" }}>
        <textPath href={`#${ring}`} textLength="470" lengthAdjust="spacing">
          SMELL BESS · ONLY THE BEST · TRINIDAD &amp; TOBAGO ·
        </textPath>
      </text>
      <g fill="currentColor" fontSize="30" fontWeight="300" textAnchor="middle" style={{ fontStretch: "125%" }}>
        <text x="80" y="110">S</text>
        <text x="120" y="110">B</text>
      </g>
      <rect x="99.3" y="82" width="1.4" height="34" className="fill-hibiscus" />
      <text x="100" y="138" textAnchor="middle" fill="currentColor" fontSize="6" letterSpacing="2.4" opacity="0.6" style={{ fontStretch: "125%" }}>
        EST. 2026
      </text>
    </svg>
  );
}
