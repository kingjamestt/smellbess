/**
 * Placeholder artwork until our own photos are shot. A plain decant atomizer
 * silhouette tinted per scent. No brand logos, no press images.
 */
export function ScentArt({
  hue,
  label,
  className = "",
}: {
  hue: number;
  label: string;
  className?: string;
}) {
  const bg = `hsl(${hue} 70% 92%)`;
  const juice = `hsl(${hue} 60% 55%)`;
  const glass = `hsl(${hue} 40% 98%)`;
  return (
    <svg
      viewBox="0 0 120 120"
      role="img"
      aria-label={`Placeholder image for ${label}`}
      className={className}
    >
      <rect width="120" height="120" fill={bg} />
      <circle cx="96" cy="22" r="26" fill={`hsl(${(hue + 40) % 360} 80% 85%)`} />
      <rect x="51" y="18" width="18" height="10" rx="2" fill="#17131f" />
      <rect x="55" y="28" width="10" height="8" fill="#9a94a8" />
      <rect x="40" y="36" width="40" height="68" rx="8" fill={glass} stroke="#17131f" strokeWidth="2.5" />
      <rect x="43" y="56" width="34" height="45" rx="5" fill={juice} />
      <rect x="46" y="62" width="5" height="30" rx="2.5" fill="#ffffff" opacity="0.45" />
    </svg>
  );
}
