import { ImageResponse } from "next/og";

export const alt =
  "Deadbeat Client Risk Check — Free 90-second tool for freelancers";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#0B1020",
          backgroundImage:
            "radial-gradient(circle at 20% 20%, #1e3a8a 0%, transparent 50%), radial-gradient(circle at 80% 80%, #4f46e5 0%, transparent 50%)",
          padding: "72px",
          fontFamily: "sans-serif",
          color: "white",
        }}
      >
        {/* Top row: brand */}
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 14,
              backgroundColor: "#4f46e5",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 28,
              fontWeight: 700,
            }}
          >
            OS
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              lineHeight: 1.1,
            }}
          >
            <div style={{ fontSize: 30, fontWeight: 700 }}>OneSign</div>
            <div style={{ fontSize: 20, color: "#94a3b8" }}>
              The freelancer&apos;s legal shield
            </div>
          </div>
        </div>

        {/* Main block */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              display: "flex",
              alignSelf: "flex-start",
              padding: "8px 16px",
              borderRadius: 999,
              backgroundColor: "rgba(99, 102, 241, 0.2)",
              border: "1px solid rgba(147, 197, 253, 0.4)",
              color: "#c7d2fe",
              fontSize: 22,
              fontWeight: 600,
            }}
          >
            Free · 90 seconds · No signup
          </div>
          <div
            style={{
              fontSize: 80,
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: -1,
              maxWidth: 1000,
            }}
          >
            Before you sign with that client,
          </div>
          <div
            style={{
              fontSize: 80,
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: -1,
              color: "#60a5fa",
              maxWidth: 1000,
            }}
          >
            find out if they&apos;ll actually pay.
          </div>
        </div>

        {/* Bottom row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <div style={{ fontSize: 26, color: "#cbd5e1" }}>
            12 questions → risk score → contract clauses to patch every flag
          </div>
          <div
            style={{
              fontSize: 24,
              fontWeight: 700,
              color: "#93c5fd",
            }}
          >
            onesign.click/risk-check
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
