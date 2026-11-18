import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const bg = searchParams.get("bg") ?? "#1E293B";
  const current = Number(searchParams.get("current") ?? 0);
  const total = Number(searchParams.get("total") ?? 5);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "28px",
          backgroundColor: bg,
        }}
      >
        {Array.from({ length: total }).map((_, i) => {
          const active = i < current;
          return (
            <div
              key={i}
              style={{
                width: "84px",
                height: "84px",
                borderRadius: "9999px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "34px",
                fontWeight: 700,
                backgroundColor: active ? "#FACC15" : "rgba(255,255,255,0.15)",
                color: active ? "#0F172A" : "#FFFFFF",
              }}
            >
              {active ? "✓" : i + 1}
            </div>
          );
        })}
      </div>
    ),
    { width: 1032, height: 336 }
  );
}