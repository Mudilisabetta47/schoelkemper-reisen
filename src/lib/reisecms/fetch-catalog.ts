/**
 * Liest den kompletten Reisekatalog aus dem reise-CMS und baut daraus das
 * Datenmodell der neuen Website. Wird von Next.js (gecacht, siehe index.ts)
 * und vom Snapshot-Skript (scripts/sync-reisen.ts) verwendet.
 */
import {
  FALLBACK_IMAGE_PATH,
  parseDetail,
  parseListing,
  parseNavCategories,
  slugify,
  toCmsImage,
  type DetailData,
  type ListingItem,
} from "./parse.ts";
import type { Catalog, Trip, TripCategory, TripStatus, TripVariant } from "./types.ts";

const UA = "Mozilla/5.0 (compatible; ScholkemperWebsite/1.0; +https://www.scholkemper-reisen.de)";

async function getHtml(base: string, path: string): Promise<string> {
  const res = await fetch(base + path, {
    headers: { "User-Agent": UA, Accept: "text/html" },
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) throw new Error(`reise-CMS ${path}: HTTP ${res.status}`);
  return res.text();
}

async function pool<T, R>(items: T[], size: number, fn: (t: T) => Promise<R>): Promise<R[]> {
  const out: R[] = new Array(items.length);
  let i = 0;
  await Promise.all(
    Array.from({ length: Math.min(size, items.length) }, async () => {
      while (i < items.length) {
        const idx = i++;
        out[idx] = await fn(items[idx]);
      }
    }),
  );
  return out;
}

function addDays(iso: string, n: number): string {
  const d = new Date(iso + "T12:00:00Z");
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

/** "Samstag 28.11.2026" → "2026-11-28" (Fallback, falls valid_from fehlt) */
function isoFromLabel(label: string): string {
  const m = label.match(/(\d{2})\.(\d{2})\.(\d{4})/);
  return m ? `${m[3]}-${m[2]}-${m[1]}` : "";
}

export function statusFor(
  item: Pick<ListingItem, "soldOut"> | undefined,
  detail: Pick<DetailData, "sold" | "bookingTo">,
  today: string,
): TripStatus {
  if (detail.sold || item?.soldOut) return "ausgebucht";
  if (detail.bookingTo && detail.bookingTo < today) return "buchungsschluss";
  return "verfuegbar";
}

const CATEGORY_LABELS: Record<string, string> = {
  Gruppenreise: "Für Gruppen",
  Weihnachtszeit: "Weihnachtszeit",
};

export function buildCatalog(input: {
  listing: ListingItem[];
  details: DetailData[];
  categories: { name: string; ids: number[] }[];
  today: string;
  fetchedAt: string;
  source: Catalog["source"];
}): Catalog {
  const { listing, details, today } = input;
  const byId = new Map(listing.map((l) => [l.id, l]));

  const variants: (TripVariant & { detail: DetailData; listingImage?: string })[] = details
    .filter((d) => d.id)
    .map((d) => {
      const item = byId.get(d.id);
      const start = d.start || isoFromLabel(d.dateLabel || item?.dateLabel || "");
      const days = d.days || item?.days || 1;
      return {
        id: d.id,
        cmsPath: item?.cmsPath ?? `/reise/${d.id}`,
        start,
        end: addDays(start, days - 1),
        days,
        dateLabel: d.dateLabel || item?.dateLabel || "",
        status: statusFor(item, d, today),
        bookingTo: d.bookingTo,
        prices: d.prices.length
          ? d.prices
          : item
            ? [{ label: item.priceLabel || "pro Person", amount: item.price }]
            : [],
        extras: d.extras,
        stops: d.stops,
        stopsNote: d.stopsNote,
        services: d.services,
        sections: d.sections,
        minParticipants: d.minParticipants,
        maxParticipants: d.maxParticipants,
        cancellation: d.cancellation,
        detail: d,
        listingImage: item?.image,
      };
    })
    // vergangene Termine nie anzeigen (auch nicht aus einem älteren Snapshot)
    .filter((v) => v.start && v.end >= today);

  // Termine gleichen Titels → eine Reise mit mehreren Terminen
  const groups = new Map<string, typeof variants>();
  for (const v of variants) {
    const key = slugify(v.detail.title || String(v.id));
    groups.set(key, [...(groups.get(key) ?? []), v]);
  }

  const catIndex = input.categories.map((c) => ({ ...c, set: new Set(c.ids) }));
  const usedSlugs = new Set<string>();

  const trips: Trip[] = [...groups.entries()].map(([key, vs]) => {
    vs.sort((a, b) => a.start.localeCompare(b.start));
    const primary = vs.find((v) => v.status === "verfuegbar") ?? vs[0];
    const d = primary.detail;
    const imagePaths = [
      ...new Set(
        vs.flatMap((v) => [...v.detail.images, v.listingImage ? v.listingImage.split("?")[0] : ""]).filter(Boolean),
      ),
    ];
    const realImages = imagePaths.filter((p) => p !== FALLBACK_IMAGE_PATH);
    const allPrices = vs.flatMap((v) => v.prices.map((p) => p.amount)).filter((n) => Number.isFinite(n));
    const priceFrom = allPrices.length ? Math.min(...allPrices) : NaN;
    const firstPriceLabel = primary.prices[0]?.label ?? "pro Person";

    let slug = key;
    if (usedSlugs.has(slug)) slug = `${key}-${primary.start.slice(0, 4)}`;
    usedSlugs.add(slug);

    const isNew = /\*+\s*NEU\s*\*+/i.test(d.subtitle ?? "");
    const subtitle = isNew ? undefined : d.subtitle;

    return {
      slug,
      title: d.title,
      subtitle,
      isNew,
      teaser: d.teaser,
      categories: catIndex
        .filter((c) => vs.some((v) => c.set.has(v.id)))
        .map((c) => slugify(c.name)),
      countries: [...new Set(vs.flatMap((v) => v.detail.countries))],
      images: realImages.map(toCmsImage),
      usesFallbackImage: realImages.length === 0,
      days: primary.days,
      priceFrom,
      priceLabel: vs.length > 1 || primary.prices.length > 1 ? `ab, ${firstPriceLabel}` : firstPriceLabel,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      variants: vs.map(({ detail: _d, listingImage: _l, ...v }) => v),
    };
  });

  // Reihenfolge wie im CMS ("Relevanz") – nächster Termin zuerst
  trips.sort((a, b) => a.variants[0].start.localeCompare(b.variants[0].start));

  const categories: TripCategory[] = input.categories.map((c) => ({
    slug: slugify(c.name),
    cmsName: c.name,
    label: CATEGORY_LABELS[c.name] ?? c.name,
    kind: "reiseart",
    tripIds: c.ids,
  }));
  const countries = [...new Set(trips.flatMap((t) => t.countries))];
  for (const name of countries) {
    categories.push({
      slug: slugify(name),
      cmsName: name,
      label: name,
      kind: "land",
      tripIds: trips.filter((t) => t.countries.includes(name)).flatMap((t) => t.variants.map((v) => v.id)),
    });
  }

  return { fetchedAt: input.fetchedAt, source: input.source, trips, categories };
}

export async function fetchCatalog(base: string, now = new Date()): Promise<Catalog> {
  const today = now.toISOString().slice(0, 10);
  const listHtml = await getHtml(base, "/reise/");
  const { items, found } = parseListing(listHtml);
  if (!found) throw new Error("reise-CMS: Reiseliste nicht erkannt (Markup geändert?)");

  const catNames = parseNavCategories(listHtml);
  const categories = await pool(catNames, 3, async (name) => {
    const html = await getHtml(base, `/reise/${encodeURIComponent(name)}`);
    return { name, ids: parseListing(html).items.map((i) => i.id) };
  });

  // Details: alle gelisteten Termine + verlinkte Alternativtermine
  const queue = items.map((i) => i.cmsPath);
  const seen = new Set<string>();
  const details: DetailData[] = [];
  while (queue.length) {
    const batch = queue.splice(0, queue.length).filter((p) => !seen.has(p));
    batch.forEach((p) => seen.add(p));
    const res = await pool(batch, 4, async (p) => parseDetail(await getHtml(base, p), p));
    for (const d of res) {
      details.push(d);
      for (const alt of d.alternativePaths) if (!seen.has(alt)) queue.push(alt);
    }
  }

  return buildCatalog({
    listing: items,
    details,
    categories,
    today,
    fetchedAt: now.toISOString(),
    source: "live",
  });
}
