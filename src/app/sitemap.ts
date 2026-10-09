import type { MetadataRoute } from "next";
import { FLEET } from "@/data/fleet";
import { getCatalog } from "@/lib/reisecms";
import { SITE } from "@/lib/site";

/** Dynamisch: Reisen und Reisearten kommen live aus dem reise-CMS (gecacht). Nur indexierbare Seiten. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const catalog = await getCatalog();
  const u = (p: string) => `${SITE.url}${p}`;
  const now = catalog.fetchedAt;
  const statics: [string, number, MetadataRoute.Sitemap[number]["changeFrequency"]][] = [
    ["/", 1, "daily"],
    ["/reisen", 0.9, "daily"],
    ["/busvermietung", 0.9, "monthly"],
    ["/busanfrage", 0.8, "yearly"],
    ["/fuhrpark", 0.8, "monthly"],
    ["/gruppenreisen", 0.8, "monthly"],
    ["/klassenfahrten", 0.8, "monthly"],
    ["/shuttle-transfer", 0.8, "monthly"],
    ["/busvermietung/bus-catering", 0.5, "yearly"],
    ["/reisekatalog", 0.6, "monthly"],
    ["/galerie", 0.5, "monthly"],
    ["/reiseinfo", 0.5, "yearly"],
    ["/ueber-uns", 0.6, "yearly"],
    ["/jobs", 0.5, "monthly"],
    ["/kontakt", 0.7, "yearly"],
    ["/newsletter", 0.3, "yearly"],
    ["/reisebedingungen", 0.2, "yearly"],
    ["/agb-anmietverkehr", 0.2, "yearly"],
    ["/impressum", 0.1, "yearly"],
    ["/datenschutz", 0.1, "yearly"],
    ["/cookies", 0.1, "yearly"],
  ];
  return [
    ...statics.map(([p, priority, changeFrequency]) => ({ url: u(p), priority, changeFrequency })),
    ...catalog.categories
      .filter((c) => c.kind === "reiseart" && catalog.trips.some((t) => t.categories.includes(c.slug)))
      .map((c) => ({ url: u(`/reisen/kategorie/${c.slug}`), lastModified: now, changeFrequency: "daily" as const, priority: 0.7 })),
    ...catalog.trips.map((t) => ({ url: u(`/reisen/${t.slug}`), lastModified: now, changeFrequency: "daily" as const, priority: 0.8 })),
    ...FLEET.map((b) => ({ url: u(`/fuhrpark/${b.slug}`), changeFrequency: "yearly" as const, priority: 0.5 })),
  ];
}
