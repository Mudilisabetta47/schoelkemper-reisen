import { REISECMS_BASE_URL } from "@/lib/reisecms";

/**
 * Bild-Proxy für Reisebilder aus dem reise-CMS.
 * Das CMS liefert Bilder nur mit passendem Referer aus (Hotlink-Schutz).
 * Bilder bleiben im CMS (Bildrechte aus dem CMS-Bildpool), werden hier nur
 * durchgereicht. Skalierung übernimmt das CMS (?width=), max. 1600 px
 * (Originale sind max. ~2000 px, größer würde nur hochgerechnet).
 */
export async function GET(req: Request, ctx: { params: Promise<{ path: string[] }> }) {
  const { path } = await ctx.params;
  // gewünschte Breite (vom Image-Loader) → das CMS skaliert selbst
  const w = Math.round(Number(new URL(req.url).searchParams.get("w")));
  const size = Number.isFinite(w) && w > 0 ? Math.min(1600, Math.max(64, w)) : 0;
  const rel = path.map((p) => encodeURIComponent(decodeURIComponent(p))).join("/");
  if (!/^media\/image\//.test(rel) || rel.includes("..") || !/\.(jpe?g|png|webp|gif)$/i.test(rel)) {
    return new Response("Not found", { status: 404 });
  }
  const upstream = await fetch(`${REISECMS_BASE_URL}/${rel}${size ? `?width=${size}&height=${size}` : ""}`, {
    headers: { Referer: `${REISECMS_BASE_URL}/`, "User-Agent": "Mozilla/5.0 (ScholkemperWebsite)" },
    signal: AbortSignal.timeout(15000),
  }).catch(() => null);
  if (!upstream || !upstream.ok || !(upstream.headers.get("content-type") ?? "").startsWith("image/")) {
    return new Response("Not found", { status: 404, headers: { "Cache-Control": "public, max-age=300" } });
  }
  return new Response(upstream.body, {
    headers: {
      "Content-Type": upstream.headers.get("content-type") ?? "image/jpeg",
      "Cache-Control": "public, max-age=86400, s-maxage=604800, stale-while-revalidate=604800",
    },
  });
}
