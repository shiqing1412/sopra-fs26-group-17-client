"use client";
import { useRouter } from "next/navigation";
import { Button } from "antd";

export default function Home() {
  const router = useRouter();

  return (
    <div
      style={{
        minHeight: "100vh",
        fontFamily: "'DM Sans', sans-serif",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        background: `
          radial-gradient(ellipse at 72% 12%, rgba(194, 96, 58, 0.38) 0%, transparent 48%),
          radial-gradient(ellipse at 18% 80%, rgba(218, 131, 96, 0.22) 0%, transparent 45%),
          radial-gradient(ellipse at 88% 88%, rgba(120, 50, 20, 0.3) 0%, transparent 40%),
          radial-gradient(ellipse at 40% 40%, rgba(36, 22, 14, 0.6) 0%, transparent 60%),
          #1A1612
        `,
      }}
    >
      {/* Dot-grid texture overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      {/* Vignette overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at center, transparent 50%, rgba(10,6,4,0.55) 100%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      {/* Top navigation */}
      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "24px 48px",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "baseline" }}>
            <span
              style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: 22,
                color: "#f6f4f2",
              }}
            >
              Wander
            </span>
            <span
              style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: 22,
                color: "#da8360",
              }}
            >
              Sync
            </span>
          </div>
          <span
            style={{
              fontSize: 11,
              color: "#4A4340",
              fontWeight: 300,
              letterSpacing: "0.05em",
              alignSelf: "center",
            }}
          >
            Sopra_fs26_Group_17
          </span>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <Button
            size="middle"
            onClick={() => router.push("/login")}
            style={{
              backgroundColor: "transparent",
              border: "1.5px solid #4A4340",
              color: "#f6f4f2",
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 300,
            }}
          >
            Log in
          </Button>
          <Button
            size="middle"
            onClick={() => router.push("/register")}
            style={{
              backgroundColor: "#C2603A",
              border: "none",
              color: "#f6f4f2",
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 500,
            }}
          >
            Register
          </Button>
        </div>
      </nav>

      {/* Hero section */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "0 24px",
          position: "relative",
          zIndex: 1,
        }}
      >
        <h1
          style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: "clamp(52px, 9vw, 100px)",
            color: "#f6f4f2",
            lineHeight: 1.05,
            marginBottom: 8,
            letterSpacing: "-0.02em",
          }}
        >
          Wander<span style={{ color: "#da8360" }}>Sync</span>
        </h1>

        <p
          style={{
            fontFamily: "'DM Serif Display', serif",
            fontStyle: "italic",
            fontSize: "clamp(18px, 2.8vw, 26px)",
            color: "#8A7A6A",
            marginBottom: 16,
            letterSpacing: "0.01em",
          }}
        >
          Plan together. Wander further.
        </p>

        <p
          style={{
            fontSize: 15,
            color: "#7a6e68",
            fontWeight: 300,
            marginBottom: 52,
            maxWidth: 420,
            lineHeight: 1.8,
          }}
        >
          Build shared itineraries with your group in real time.
          Add stops, explore ideas, and set off together.
        </p>

        <div
          style={{
            display: "flex",
            gap: 16,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <Button
            size="large"
            onClick={() => router.push("/login")}
            style={{
              backgroundColor: "#C2603A",
              border: "none",
              color: "#f6f4f2",
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 500,
              padding: "0 36px",
              height: 50,
              fontSize: 15,
            }}
          >
            Start Planning
          </Button>
          <Button
            size="large"
            onClick={() => router.push("/register")}
            style={{
              backgroundColor: "transparent",
              border: "1.5px solid #4A4340",
              color: "#c8bfb8",
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 300,
              padding: "0 36px",
              height: 50,
              fontSize: 15,
            }}
          >
            Create an Account
          </Button>
        </div>
      </div>

      {/* Footer */}
      <div style={{ padding: "28px 48px", textAlign: "center", position: "relative", zIndex: 1 }}>
        <p style={{ color: "#6b5e56", fontWeight: 300, fontSize: 13 }}>
          The world is better explored together.
        </p>
      </div>
    </div>
  );
}
