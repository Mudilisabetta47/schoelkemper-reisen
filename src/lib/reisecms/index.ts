import "server-only";
import { cacheLife, cacheTag } from "next/cache";
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
 * Gecacht (Cache Components), Revalidierung alle 15 Minuten bzw. sofort über
 * /api/revalidate. Ist das CMS nicht erreichbar, wird der letzte Snapshot
 * (npm run reisen:sync) verwendet – die Website bleibt also nie leer.
 */
export async function getCatalog(): Promise<Catalog> {
  "use cache";
  cacheLife({ stale: 300, revalidate: 900, expire: 86400 });
  cacheTag("reisen");
  const now = new Date();
  const today = now.toISOString().slice(0, 10);
  if (process.env.REISECMS_MODE === "snapshot") return refresh(snapshot, today);
  try {
    return refresh(await fetchCatalog(REISECMS_BASE_URL, now), today);
  } catch (err) {
    console.warn("[reise-CMS] Live-Abruf fehlgeschlagen, nutze Snapshot:", (err as Error).message);
    return refresh(snapshot, today);
  }
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

/** Snapshot-Slugs für generateStaticParams (Build braucht mindestens einen Wert) */
export function snapshotSlugs(): string[] {
  return snapshot.trips.map((t) => t.slug);
}
