import { ImageResponse } from "next/og";

// The link preview on WhatsApp, Instagram, Facebook and Google (business-plan.md §5a).
// Seal on the left, wordmark and tagline on the right. Apps that crop the card to a
// centred square (small WhatsApp thumbnails) keep the wordmark and most of the seal.
export const alt = "Smell Bess: only the best. Perfume decants and full bottles in Trinidad & Tobago.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const NIGHT = "#121014";
const PEARL = "#EAE8E5";
const ASH = "#8F8A93";
const AMBER = "#E3A23B";

const RING = "SMELL BESS · ONLY THE BEST · TRINIDAD & TOBAGO · ";
const SEAL = 240;

/** The thin-ring seal. next/og can't set text on a path, so each ring letter is placed and rotated by hand. */
function Seal() {
  const c = SEAL / 2;
  const r = SEAL * 0.39;
  const chars = RING.split("");
  return (
    <div style={{ position: "relative", width: SEAL, height: SEAL, display: "flex" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, borderRadius: "50%", border: `2px solid ${PEARL}` }} />
      <div style={{ position: "absolute", top: 7, left: 7, right: 7, bottom: 7, borderRadius: "50%", border: `1px solid ${PEARL}`, opacity: 0.7 }} />
      <div style={{ position: "absolute", top: SEAL * 0.2, left: SEAL * 0.2, right: SEAL * 0.2, bottom: SEAL * 0.2, borderRadius: "50%", border: `1px solid ${PEARL}`, opacity: 0.7 }} />
      {chars.map((ch, i) => {
        const a = (i / chars.length) * 2 * Math.PI - Math.PI / 2;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: c + r * Math.cos(a) - 8,
              top: c + r * Math.sin(a) - 9,
              width: 16,
              height: 18,
              display: "flex",
              justifyContent: "center",
              fontSize: 11,
              color: PEARL,
              transform: `rotate(${(a + Math.PI / 2) * (180 / Math.PI)}deg)`,
            }}
          >
            {ch}
          </div>
        );
      })}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 14, color: PEARL, fontSize: 38, fontWeight: 300 }}>
        <span>S</span>
        <span style={{ width: 2, height: 42, background: AMBER }} />
        <span>B</span>
      </div>
    </div>
  );
}

export default function Image() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", background: NIGHT, color: PEARL, padding: "0 70px", gap: 48 }}>
        <Seal />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 52, letterSpacing: "0.22em", fontWeight: 300 }}>
            SMELL<span style={{ color: AMBER, marginLeft: "0.4em" }}>BESS</span>
          </div>
          <div style={{ width: 96, height: 4, background: AMBER, margin: "26px 0" }} />
          <div style={{ fontSize: 40 }}>Only the best.</div>
          <div style={{ fontSize: 19, color: ASH, marginTop: 14, letterSpacing: "0.14em" }}>FINE FRAGRANCE · TRINIDAD &amp; TOBAGO</div>
        </div>
      </div>
    ),
    size,
  );
}
