import type { NextConfig } from "next";

/**
 * 301-Mapping der bisherigen URLs (reise-CMS) auf die neue Struktur.
 * Reise-Detailseiten und Reise-Kategorien leitet src/app/reise/[...legacy]/route.ts
 * datenbasiert weiter. Vollständiger Plan: docs/SEO-MIGRATION.md
 */
const legacy: [string, string][] = [
  ["/index.php", "/"],
  ["/reise", "/reisen"],
  ["/reise/index.php", "/reisen"],
  ["/reise/reise.php", "/reisen"],
  ["/scholkemper", "/ueber-uns"],
  ["/scholkemper/index.php", "/ueber-uns"],
  ["/scholkemper/mitarbeiter.php", "/ueber-uns#team"],
  ["/scholkemper/stellenangebote.php", "/jobs"],
  ["/scholkemper/reisebusse.php", "/fuhrpark"],
  ["/scholkemper/anfahrt.php", "/kontakt#anfahrt"],
  ["/scholkemper/impressum.php", "/impressum"],
  ["/scholkemper/datenschutz.php", "/datenschutz"],
  ["/scholkemper/cookieinformation.php", "/cookies"],
  ["/service/datenschutz.php", "/datenschutz"],
  ["/service/kontakt.php", "/kontakt"],
  ["/service/bildergalerie.php", "/galerie"],
  ["/service/reise_info.php", "/reiseinfo"],
  ["/service/reisekataloge.php", "/reisekatalog"],
  ["/service/reisebedingungen.php", "/reisebedingungen"],
  ["/service/agb_anmietverkehr.php", "/agb-anmietverkehr"],
  ["/service/gruppenreisen.php", "/gruppenreisen"],
  ["/service/gruppen_vereinsreisen.php", "/gruppenreisen"],
  ["/busvermietung/bus_charter.php", "/busvermietung"],
  ["/busvermietung/mietomnibusse.php", "/busvermietung"],
  ["/busvermietung/essen.php", "/busvermietung/bus-catering"],
  ["/busvermietung/klassenfahrt.php", "/klassenfahrten"],
  ["/newsletter/index.php", "/newsletter"],
  ["/media/download/reisekatalog/flyerinnen.pdf", "/downloads/scholkemper-flyer-januar-mai-2026.pdf"],
];

const nextConfig: NextConfig = {
  // Cache Components/PPR sind bewusst aus: OpenNext (Cloudflare Workers) unterstützt
  // sie derzeit nicht (Worker hängt beim Rendern). Seiten werden statisch vorgerendert.
  poweredByHeader: false,
  images: {
    loader: "custom",
    loaderFile: "./src/lib/image-loader.ts",
    formats: ["image/avif", "image/webp"],
    qualities: [60, 75, 85],
    deviceSizes: [390, 640, 828, 1080, 1280, 1600, 1920, 2560],
    imageSizes: [96, 160, 240, 320, 480],
    localPatterns: [{ pathname: "/img/**" }, { pathname: "/cms-media/**" }],
    minimumCacheTTL: 2678400,
  },
  async redirects() {
    return [
      ...legacy.map(([source, destination]) => ({ source, destination, statusCode: 301 as const })),
      // ".php?mini=1" u. ä. – Query wird von Next automatisch mitgeprüft, Pfad reicht
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
        ],
      },
      {
        source: "/img/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=2592000, stale-while-revalidate=86400" }],
      },
    ];
  },
};

export default nextConfig;
