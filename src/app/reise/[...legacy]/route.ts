import { findTripByLegacyId, getCategories } from "@/lib/reisecms";
import { slugify } from "@/lib/reisecms/parse";

/**
 * 301-Weiterleitungen der alten reise-CMS-URLs:
 *   /reise/2328_Weihnachtsmarkt_Leipzig → /reisen/weihnachtsmarkt-leipzig
 *   /reise/Tagesfahrten                → /reisen/kategorie/tagesfahrten
 *   /reise/Deutschland                 → /reisen?ziel=deutschland
 * Abgelaufene Reisen (ID nicht mehr im Katalog) → /reisen (statt 404),
 * damit Links aus Google, Newslettern und Flyern weiter funktionieren.
 */
export async function GET(req: Request, ctx: { params: Promise<{ legacy: string[] }> }) {
  const { legacy } = await ctx.params;
  const first = decodeURIComponent(legacy[0] ?? "");
  const to = (path: string) => Response.redirect(new URL(path, req.url), 301);

  const id = first.match(/^(\d+)_/)?.[1];
  if (id) {
    const trip = await findTripByLegacyId(Number(id));
    return to(trip ? `/reisen/${trip.slug}` : "/reisen");
  }
  if (!first || /^(index|reise)\.php$/i.test(first)) return to("/reisen");
  if (/^buchen\.php$/i.test(first)) return to("/reisen");

  const cats = await getCategories();
  const cat = cats.find((c) => c.cmsName.toLowerCase() === first.toLowerCase() || c.slug === slugify(first));
  if (cat?.kind === "reiseart") return to(`/reisen/kategorie/${cat.slug}`);
  if (cat?.kind === "land") return to(`/reisen?ziel=${cat.slug}`);
  // unbekannte Kategorie oder Land ohne aktuelle Reise
  return to(`/reisen?q=${encodeURIComponent(first)}`);
}
