import { REISECMS_BASE_URL } from "@/lib/reisecms";

/**
 * Bild-Proxy für Reisebilder aus dem reise-CMS.
 * Das CMS liefert Bilder nur mit passendem Referer aus (Hotlink-Schutz).
 * Bilder bleiben im CMS (Bildrechte aus dem CMS-Bildpool), werden hier nur
 * durchgereicht und von next/image als AVIF/WebP optimiert und gecacht.
 */
export async function GET(_req: Request, ctx: { params: Promise<{ path: string[] }> }) {
  const { path } = await ctx.params;
  const rel = path.map((p) => encodeURIComponent(decodeURIComponent(p))).join("/");
  if (!/^media\/image\//.test(rel) || rel.includes("..") || !/\.(jpe?g|png|webp|gif)$/i.test(rel)) {
    return new Response("Not found", { status: 404 });
  }
  const upstream = await fetch(`${REISECMS_BASE_URL}/${rel}`, {
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
