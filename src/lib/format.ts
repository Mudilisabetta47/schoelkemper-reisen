/** Formatierung – client- und serverseitig nutzbar */
import type { Trip, TripStatus, TripVariant } from "./reisecms/types";

const TZ = "Europe/Berlin";

export function fmtPrice(n: number, opts: { cents?: boolean } = {}) {
  if (!Number.isFinite(n)) return "";
  const cents = opts.cents ?? !Number.isInteger(n);
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: cents ? 2 : 0,
    maximumFractionDigits: cents ? 2 : 0,
  }).format(n);
}

const d = (iso: string) => new Date(iso + "T12:00:00Z");

export function fmtDate(iso: string, style: "short" | "long" | "weekday" | "day" = "long") {
  const opts: Intl.DateTimeFormatOptions =
    style === "short"
      ? { day: "2-digit", month: "2-digit", year: "numeric", timeZone: TZ }
      : style === "weekday"
        ? { weekday: "short", day: "2-digit", month: "2-digit", year: "numeric", timeZone: TZ }
        : style === "day"
          ? { day: "numeric", month: "short", timeZone: TZ }
          : { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: TZ };
  return new Intl.DateTimeFormat("de-DE", opts).format(d(iso));
}

export function fmtRange(v: Pick<TripVariant, "start" | "end">) {
  if (v.start === v.end) return fmtDate(v.start, "weekday");
  return `${fmtDate(v.start, "weekday")} – ${fmtDate(v.end, "weekday")}`;
}

export function monthKey(iso: string) {
  return iso.slice(0, 7);
}

export function fmtMonth(key: string) {
  return new Intl.DateTimeFormat("de-DE", { month: "long", year: "numeric", timeZone: TZ }).format(d(key + "-15"));
}

export function fmtDays(n: number) {
  return n === 1 ? "1 Tag" : `${n} Tage`;
}

export const STATUS_LABEL: Record<TripStatus, string> = {
  verfuegbar: "Verfügbar",
  wenige: "Wenige Plätze",
  ausgebucht: "Ausgebucht",
  buchungsschluss: "Buchungsschluss",
};

/** Status einer Reise = bester Status ihrer Termine */
export function tripStatus(t: Trip): TripStatus {
  const order: TripStatus[] = ["verfuegbar", "wenige", "buchungsschluss", "ausgebucht"];
  return order.find((s) => t.variants.some((v) => v.status === s)) ?? "ausgebucht";
}

export function nextVariant(t: Trip): TripVariant {
  return t.variants.find((v) => v.status === "verfuegbar" || v.status === "wenige") ?? t.variants[0];
}

/** Titel ohne doppelte Anführungszeichen-Varianten */
export function plainText(html: string) {
  return html
    .replace(/<br\s*\/?>/g, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

export function truncate(s: string, n: number) {
  if (s.length <= n) return s;
  const cut = s.slice(0, n - 1);
  return cut.slice(0, cut.lastIndexOf(" ")) + "…";
}
