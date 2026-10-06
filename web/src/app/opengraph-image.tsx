import { ImageResponse } from "next/og";

// The link preview on WhatsApp, Instagram, Facebook and Google: the brand card
// (business-plan.md §5a colours). Pages without their own image inherit it.
export const alt = "Smell Bess: only the best. Perfume decants and full bottles in Trinidad & Tobago.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#121014",
          color: "#EAE8E5",
        }}
      >
        <div style={{ display: "flex", fontSize: 92, letterSpacing: "0.22em", fontWeight: 300 }}>
          SMELL<span style={{ color: "#E3A23B", marginLeft: "0.4em" }}>BESS</span>
        </div>
        <div style={{ width: 140, height: 4, background: "#E3A23B", margin: "36px 0" }} />
        <div style={{ fontSize: 44, color: "#EAE8E5" }}>Only the best.</div>
        <div style={{ fontSize: 30, color: "#8F8A93", marginTop: 18, letterSpacing: "0.12em" }}>
          FINE FRAGRANCE · TRINIDAD &amp; TOBAGO
        </div>
      </div>
    ),
    size,
  );
}
