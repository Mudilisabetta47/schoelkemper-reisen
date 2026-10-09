import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

/**
 * Cloudflare Workers (OpenNext).
 * - `npm run build` erzeugt .open-next/; vorher wird das reise-CMS gelesen.
 * - Vorgerenderte Seiten werden direkt aus den statischen Assets ausgeliefert
 *   (schnell, keine Rechenzeit, keine zusätzlichen Cloudflare-Ressourcen nötig).
 * - Aktualisierung der Reisen per neuem Build (GitHub Action "reisen-sync").
 */
const config = defineCloudflareConfig({
  incrementalCache: staticAssetsIncrementalCache,
  enableCacheInterception: true,
});

export default { ...config, buildCommand: "node scripts/sync-reisen.ts && npx next build" };
