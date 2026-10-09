import "server-only";
import snapshotJson from "@/data/reisen.snapshot.json";
import { fetchCatalog } from "./fetch-catalog.ts";
import type { Catalog, Trip, TripCategory, TripVariant } from "./types.ts";

export type { Catalog, Trip, TripCategory, TripVariant };

const snapshot = snapshotJson as unknown as Catalog;

export const REISECMS_BASE_URL = (process.env.REISECMS_BASE_URL ?? "https://www.scholkemper-reisen.de").replace(/\/$/, "");

/** Snapshot auf "heute" bringen: vergangene Termine raus, Buchungsschluss neu bewerten */
function refresh(c: Catalog, today: string): Catalog {
  const trips = c.trips
    .map((t) => ({
      ...t,
      variants: t.variants
        .filter((v) => v.end >= today)
        .map((v) =>
          v.status === "verfuegbar" && v.bookingTo && v.bookingTo < today ? { ...v, status: "buchungsschluss" as const } : v,
        ),
    }))
    .filter((t) => t.variants.length > 0);
  return { ...c, trips };
}

/**
 * Reisekatalog. Quelle ist das reise-CMS (führendes System).
 *
 * Hosting auf Cloudflare Workers (OpenNext): Seiten werden beim Build statisch
 * vorgerendert – dabei wird das CMS live gelesen. Aktualisiert wird per neuem
 * Build (GitHub Action "reisen-sync" prüft das CMS alle 30 Minuten und stößt
 * bei Änderungen einen Deploy an). Zur Laufzeit (Weiterleitungen alter URLs,
 * nicht vorgerenderte Seiten) hält jede Worker-Instanz das Ergebnis 15 Minuten.
 * Ist das CMS nicht erreichbar, wird der Snapshot (npm run reisen:sync) genutzt.
 */
const TTL = 15 * 60 * 1000;
let memo: { at: number; data: Catalog } | null = null;

export async function getCatalog(): Promise<Catalog> {
  const now = new Date();
  const today = now.toISOString().slice(0, 10);
  if (memo && now.getTime() - memo.at < TTL) return refresh(memo.data, today);
  // Beim Build liest "npm run build" das CMS einmal vorab (scripts/sync-reisen.ts)
  // in den Snapshot – so fragt nicht jeder Build-Worker das CMS einzeln ab.
  if (process.env.REISECMS_MODE === "snapshot" || process.env.NEXT_PHASE === "phase-production-build") {
    return refresh(snapshot, today);
  }
  let data: Catalog;
  try {
    data = await fetchCatalog(REISECMS_BASE_URL, now);
  } catch (err) {
    console.warn("[reise-CMS] Live-Abruf fehlgeschlagen, nutze Snapshot:", (err as Error).message);
    data = memo?.data ?? snapshot;
  }
  // nur fertige Daten merken (keine Promises über Requests teilen – workerd)
  memo = { at: now.getTime(), data };
  return refresh(data, today);
}

export async function getTrips(): Promise<Trip[]> {
  return (await getCatalog()).trips;
}

export async function getTrip(slug: string): Promise<Trip | undefined> {
  return (await getCatalog()).trips.find((t) => t.slug === slug);
}

export async function getCategories(): Promise<TripCategory[]> {
  return (await getCatalog()).categories;
}

/** Alte CMS-URL (/reise/2328_…) → neue Reise */
export async function findTripByLegacyId(id: number): Promise<Trip | undefined> {
  return (await getCatalog()).trips.find((t) => t.variants.some((v) => v.id === id));
}

/** Slugs für generateStaticParams – live beim Build, sonst Snapshot */
export async function staticTripSlugs(): Promise<string[]> {
  const slugs = (await getCatalog()).trips.map((t) => t.slug);
  return slugs.length ? slugs : snapshot.trips.map((t) => t.slug);
}
