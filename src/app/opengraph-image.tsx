import { ImageResponse } from "next/og";

export const alt = "Wayo Agency";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#0a0908",
          color: "#f2efe9",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "72px",
          fontFamily: "Georgia",
        }}
      >
        <div style={{ fontSize: 24, letterSpacing: 6, color: "#a39d92" }}>WAYO AGENCY</div>
        <div style={{ fontSize: 84, lineHeight: 0.95, marginTop: 24 }}>Vibe Code</div>
        <div style={{ fontSize: 36, lineHeight: 1.1, marginTop: 18, color: "#ff5a1f" }}>Audit · Rescue · Production</div>
      </div>
    ),
    size,
  );
}
