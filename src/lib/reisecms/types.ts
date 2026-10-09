/**
 * Datenmodell der Reisen, wie sie aus dem bestehenden reise-CMS kommen.
 * Das reise-CMS bleibt führendes System (Pflege, Buchung, Kontingente).
 * Diese Typen beschreiben nur, was die neue Website daraus liest.
 */

export type TripStatus =
  /** buchbar */
  | "verfuegbar"
  /** wenige Plätze – nur gesetzt, wenn die Quelle das ausdrücklich meldet */
  | "wenige"
  /** im CMS als ausgebucht markiert */
  | "ausgebucht"
  /** Buchungsschluss überschritten */
  | "buchungsschluss";

export interface CmsImage {
  /** Pfad im reise-CMS, z. B. /media/image/weihnachten/leipzig.jpg */
  path: string;
  /** aus dem Dateinamen abgeleiteter Bildnachweis, falls vorhanden */
  credit?: string;
}

export interface TripPrice {
  label: string;
  amount: number;
}

export interface TripStop {
  time: string;
  place: string;
}

export interface TripSection {
  /** CSS-Klasse des Reiters im CMS, z. B. "verlauf", "hotel" */
  key: string;
  title: string;
  /** bereinigtes HTML (nur p, br, ul, li, strong, em) */
  html: string;
}

export interface CancellationScale {
  name: string;
  rows: { period: string; fee: string }[];
}

/** Ein buchbarer Termin = ein Datensatz (ID) im reise-CMS */
export interface TripVariant {
  id: number;
  /** alte URL im CMS, z. B. /reise/2328_Weihnachtsmarkt_Leipzig */
  cmsPath: string;
  start: string; // ISO yyyy-mm-dd
  end: string; // ISO yyyy-mm-dd
  days: number;
  dateLabel: string;
  status: TripStatus;
  bookingTo?: string;
  prices: TripPrice[];
  extras: TripPrice[];
  stops: TripStop[];
  stopsNote?: string;
  services: string[];
  sections: TripSection[];
  minParticipants?: number;
  maxParticipants?: number;
  cancellation?: CancellationScale;
}

/** Eine Reise auf der neuen Website – fasst Termine gleichen Inhalts zusammen */
export interface Trip {
  slug: string;
  title: string;
  subtitle?: string;
  isNew: boolean;
  teaser?: string;
  categories: string[];
  countries: string[];
  images: CmsImage[];
  /** true, wenn das CMS nur das Platzhalterbild liefert */
  usesFallbackImage: boolean;
  days: number;
  priceFrom: number;
  priceLabel: string;
  variants: TripVariant[];
}

export interface TripCategory {
  slug: string;
  /** Name im CMS, z. B. "Tagesfahrten" – wird für Redirects gebraucht */
  cmsName: string;
  label: string;
  kind: "reiseart" | "land";
  tripIds: number[];
}

export interface Catalog {
  fetchedAt: string;
  source: "live" | "snapshot";
  trips: Trip[];
  categories: TripCategory[];
}
