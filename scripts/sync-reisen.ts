/**
 * Reise-Snapshot aus dem reise-CMS erstellen.
 *   npm run reisen:sync
 * Läuft vor jedem Build (die Seiten werden daraus vorgerendert) und alle
 * 30 Minuten in der GitHub Action "reisen-sync": Ändert sich das Angebot im
 * CMS, wird der Snapshot committet – das löst den Cloudflare-Build aus.
 * Die Datei wird nur geschrieben, wenn sich Reisen oder Kategorien ändern.
 * Ist das CMS nicht erreichbar, bleibt der letzte Snapshot bestehen (Exit 0).
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { fetchCatalog } from "../src/lib/reisecms/fetch-catalog.ts";

const base = process.env.REISECMS_BASE_URL ?? "https://www.scholkemper-reisen.de";
const out = fileURLToPath(new URL("../src/data/reisen.snapshot.json", import.meta.url));

try {
  const catalog = await fetchCatalog(base);
  if (!catalog.trips.length && existsSync(out)) throw new Error("CMS lieferte keine Reisen – Snapshot bleibt unverändert");
  const essence = (c: { trips: unknown; categories: unknown }) => JSON.stringify({ trips: c.trips, categories: c.categories });
  const prev = existsSync(out) ? JSON.parse(readFileSync(out, "utf8")) : null;
  if (prev && essence(prev) === essence(catalog)) {
    console.log(`Snapshot unverändert (${catalog.trips.length} Reisen).`);
  } else {
    writeFileSync(out, JSON.stringify({ ...catalog, source: "snapshot" }, null, 1) + "\n");
    console.log(`Snapshot aktualisiert: ${catalog.trips.length} Reisen, ${catalog.trips.reduce((n, t) => n + t.variants.length, 0)} Termine.`);
  }
} catch (err) {
  console.warn(`[reisen:sync] ${(err as Error).message} – vorhandener Snapshot wird verwendet.`);
}
