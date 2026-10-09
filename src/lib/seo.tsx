import type { Metadata } from "next";
import { FLEET } from "@/data/fleet";
import { cmsSrc } from "@/components/ui/Pic";
import { SITE } from "./site";
import type { Trip, TripVariant } from "./reisecms/types";
import { plainText } from "./format";

export const DEFAULT_OG = "/img/bus/betriebshof-reisebusse.jpg";

export function abs(path: string) {
  return path.startsWith("http") ? path : `${SITE.url}${path}`;
}

export function pageMeta({
  title,
  description,
  path,
  image = DEFAULT_OG,
  noindex = false,
  absoluteTitle = false,
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
  noindex?: boolean;
  absoluteTitle?: boolean;
}): Metadata {
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    robots: noindex ? { index: false, follow: true } : undefined,
    openGraph: {
      type: "website",
      locale: "de_DE",
      siteName: SITE.name,
      url: path,
      title: absoluteTitle ? title : `${title} | ${SITE.name}`,
      description,
      images: [{ url: image }],
    },
    twitter: { card: "summary_large_image" },
  };
}

/* ---------------- JSON-LD ---------------- */

export const ORG_ID = `${SITE.url}/#organization`;

/**
 * Schema-Typ: TravelAgency (Unterklasse von LocalBusiness) – Scholkemper
 * veranstaltet und verkauft Reisen und hat ein Reisebüro mit Betriebshof.
 * "BusOrCoachCompany" existiert in schema.org nicht; die Busvermietung wird
 * als Service (serviceType) beschrieben. Keine Bewertungen/AggregateRating.
 */
export function organizationLd() {
  return {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "@id": ORG_ID,
    name: SITE.legalName,
    alternateName: SITE.name,
    url: SITE.url,
    logo: abs("/icon.svg"),
    image: abs(DEFAULT_OG),
    telephone: SITE.phone.e164,
    faxNumber: "+49 511 4736362",
    email: SITE.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.address.street,
      postalCode: SITE.address.zip,
      addressLocality: `${SITE.address.city}-${SITE.address.district}`,
      addressRegion: SITE.address.state,
      addressCountry: SITE.address.country,
    },
    geo: { "@type": "GeoCoordinates", latitude: SITE.geo.lat, longitude: SITE.geo.lng },
    openingHours: SITE.hours.schema,
    areaServed: [
      { "@type": "AdministrativeArea", name: "Region Hannover" },
      { "@type": "City", name: "Hannover" },
      { "@type": "City", name: "Ronnenberg" },
    ],
    vatID: SITE.vatId.replace(/\s/g, ""),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Leistungen",
      itemListElement: [
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Busreisen und Tagesfahrten ab Hannover" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Busvermietung mit Fahrer" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Gruppen- und Vereinsreisen" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Shuttle und Transfer" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Busse für Klassenfahrten" } },
      ],
    },
  };
}

export function websiteLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE.url}/#website`,
    url: SITE.url,
    name: SITE.name,
    inLanguage: "de-DE",
    publisher: { "@id": ORG_ID },
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: `${SITE.url}/reisen?q={search_term_string}` },
      "query-input": "required name=search_term_string",
    },
  };
}

export function breadcrumbLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: abs(it.path),
    })),
  };
}

export function serviceLd({ name, description, path, serviceType }: { name: string; description: string; path: string; serviceType: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    serviceType,
    url: abs(path),
    provider: { "@id": ORG_ID },
    areaServed: { "@type": "AdministrativeArea", name: "Region Hannover" },
    availableChannel: {
      "@type": "ServiceChannel",
      servicePhone: { "@type": "ContactPoint", telephone: SITE.phone.e164, contactType: "Anfragen" },
      serviceUrl: abs("/busanfrage"),
    },
  };
}

export function faqLd(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: { "@type": "Answer", text: it.a },
    })),
  };
}

const availability = (v: TripVariant) =>
  v.status === "verfuegbar" || v.status === "wenige" ? "https://schema.org/InStock" : "https://schema.org/SoldOut";

/** TouristTrip mit je einem Offer pro Termin und Preisstufe */
export function tripLd(trip: Trip, path: string) {
  const desc = trip.teaser ? plainText(trip.teaser) : undefined;
  return {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: trip.title + (trip.subtitle ? ` – ${trip.subtitle}` : ""),
    description: desc,
    url: abs(path),
    image: trip.images.length ? trip.images.map((i) => abs(cmsSrc(i.path))) : undefined,
    touristType: trip.categories.includes("gruppenreise") ? "Gruppen" : undefined,
    provider: { "@id": ORG_ID },
    itinerary: trip.countries.length
      ? { "@type": "ItemList", itemListElement: trip.countries.map((c, i) => ({ "@type": "ListItem", position: i + 1, item: { "@type": "Country", name: c } })) }
      : undefined,
    offers: trip.variants.flatMap((v) =>
      v.prices.map((p) => ({
        "@type": "Offer",
        name: `${p.label} (${v.start})`,
        price: p.amount.toFixed(2),
        priceCurrency: "EUR",
        availability: availability(v),
        validThrough: v.bookingTo ?? v.start,
        url: abs(path),
        eligibleQuantity: v.maxParticipants ? { "@type": "QuantitativeValue", maxValue: v.maxParticipants } : undefined,
      })),
    ),
  };
}

export function fleetLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Fuhrpark Scholkemper Reisen",
    itemListElement: FLEET.map((b, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: abs(`/fuhrpark/${b.slug}`),
      name: `${b.name} – ${b.seatsLabel}`,
    })),
  };
}

export function JsonLd({ data }: { data: object | object[] }) {
  const json = JSON.stringify(data, (_k, v) => (v === undefined ? undefined : v)).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
