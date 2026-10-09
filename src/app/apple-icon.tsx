import { ImageResponse } from "next/og";
import { PHOENIX_PATHS } from "@/components/ui/logo-paths";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#ffffff" }}>
        <svg width="132" height="124" viewBox="6 4 100 92">
          {PHOENIX_PATHS.map((d, i) => (
            <path key={i} d={d} fill="#992233" />
          ))}
        </svg>
      </div>
    ),
    size,
  );
}
