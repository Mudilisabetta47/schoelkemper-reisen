/**
 * Erstellt den Reise-Snapshot (Fallback, falls das reise-CMS beim Build
 * oder zur Laufzeit nicht erreichbar ist).
 *
 *   npm run reisen:sync
 */
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { fetchCatalog } from "../src/lib/reisecms/fetch-catalog.ts";

const base = process.env.REISECMS_BASE_URL ?? "https://www.scholkemper-reisen.de";
const out = fileURLToPath(new URL("../src/data/reisen.snapshot.json", import.meta.url));

const catalog = await fetchCatalog(base);
writeFileSync(out, JSON.stringify({ ...catalog, source: "snapshot" }, null, 1) + "\n");
console.log(
  `Snapshot: ${catalog.trips.length} Reisen, ${catalog.trips.reduce((n, t) => n + t.variants.length, 0)} Termine, ${catalog.categories.length} Kategorien → ${out}`,
);
for (const t of catalog.trips)
  console.log(` - /reisen/${t.slug} [${t.categories.join(",")}] ${t.variants.map((v) => `${v.start}:${v.status}`).join(" ")} ab ${t.priceFrom} €`);
