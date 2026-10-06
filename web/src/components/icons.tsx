/**
 * Smell Bess line icons. Drawn for the brand rather than pulled from a set:
 * one 20px grid, 1.25 stroke, round ends, no fills except where a shape needs
 * weight (the shaded half of "anytime"). They inherit currentColor, so they
 * take Pearl, Ash or Amber from their parent.
 */
type IconProps = { className?: string; size?: number };

function Svg({ size = 20, className, children }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      {children}
    </svg>
  );
}

/** All: four testers on a tray. */
export function IconAll(p: IconProps) {
  return (
    <Svg {...p}>
      <rect x="3.5" y="3.5" width="5" height="5" rx="1" />
      <rect x="11.5" y="3.5" width="5" height="5" rx="1" />
      <rect x="3.5" y="11.5" width="5" height="5" rx="1" />
      <rect x="11.5" y="11.5" width="5" height="5" rx="1" />
    </Svg>
  );
}

/** Daytime: a sun with short, even rays. */
export function IconDay(p: IconProps) {
  return (
    <Svg {...p}>
      <circle cx="10" cy="10" r="3.25" />
      <path d="M10 2.5v1.75M10 15.75v1.75M2.5 10h1.75M15.75 10h1.75M4.7 4.7l1.25 1.25M14.05 14.05l1.25 1.25M4.7 15.3l1.25-1.25M14.05 5.95l1.25-1.25" />
    </Svg>
  );
}

/** Nighttime: a thin crescent with one star. */
export function IconNight(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M14.5 12.6A6 6 0 0 1 7.4 5.5a6 6 0 1 0 7.1 7.1Z" />
      <path d="M14.5 3.5v2.5M13.25 4.75h2.5" />
    </Svg>
  );
}

/** Anytime: half sun, half shade. */
export function IconAnytime(p: IconProps) {
  return (
    <Svg {...p}>
      <circle cx="10" cy="10" r="4.5" />
      <path d="M10 5.5a4.5 4.5 0 0 0 0 9Z" fill="currentColor" stroke="none" />
      <path d="M10 2.5v1M10 16.5v1M16.5 10h1M15.3 4.7l-.7.7M15.3 15.3l-.7-.7" />
    </Svg>
  );
}

/** Warm weather: heat rising off the road. */
export function IconWarm(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M6 16c-1.25-1.5-1.25-3 0-4.5s1.25-3 0-4.5" />
      <path d="M10 16c-1.25-1.5-1.25-3 0-4.5s1.25-3 0-4.5S8.75 4 10 3" />
      <path d="M14 16c-1.25-1.5-1.25-3 0-4.5s1.25-3 0-4.5" />
    </Svg>
  );
}

/** Cold weather: a six-point snowflake. */
export function IconCold(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M10 2.75v14.5M3.7 6.4l12.6 7.2M3.7 13.6l12.6-7.2" />
      <path d="M8.5 3.9 10 5.25l1.5-1.35M8.5 16.1 10 14.75l1.5 1.35M4.2 8.3l1.9-.6-.4-1.95M15.8 11.7l-1.9.6.4 1.95M4.2 11.7l1.9.6-.4 1.95M15.8 8.3l-1.9-.6.4-1.95" />
    </Svg>
  );
}

/** Any weather: a horizon line, nothing forecast. */
export function IconAnyWeather(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M3 13h14" />
      <path d="M6 13a4 4 0 0 1 8 0" />
      <path d="M5 16h10" />
    </Svg>
  );
}

/** The 5×10ml bundle: five atomizers in a row. */
export function IconBundle(p: IconProps) {
  return (
    <Svg {...p}>
      {[2.75, 6, 9.25, 12.5, 15.75].map((x) => (
        <g key={x}>
          <rect x={x} y="7" width="1.75" height="9.5" rx=".6" />
          <path d={`M${x + 0.875} 7V5`} />
        </g>
      ))}
    </Svg>
  );
}

/** The free 5ml: a small atomizer with a glint. */
export function IconGift(p: IconProps) {
  return (
    <Svg {...p}>
      <rect x="6" y="8" width="5" height="9" rx="1.25" />
      <path d="M8.5 8V5.75M7.25 5.75h2.5" />
      <path d="M14.5 3v3M13 4.5h3M15.25 9.5v1.5M14.5 10.25H16" />
    </Svg>
  );
}

/** A sealed bottle, for the bottle price line. */
export function IconBottle(p: IconProps) {
  return (
    <Svg {...p}>
      <rect x="5" y="7.5" width="10" height="10" rx="1.75" />
      <rect x="7.75" y="3" width="4.5" height="3" rx=".75" />
      <path d="M10 6v1.5M7.5 12.5h5" />
    </Svg>
  );
}
