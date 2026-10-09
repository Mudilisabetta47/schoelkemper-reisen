/**
 * Parser für die öffentlichen Seiten des reise-CMS (www.reise-cms.com).
 *
 * Das CMS bietet keine öffentlich dokumentierte API/kein Feed (geprüft:
 * rss/xml/json-Pfade liefern die CMS-Fehlerseite). Daher werden die
 * öffentlich gerenderten Listen- und Detailseiten gelesen. Alle Funktionen
 * hier sind rein (HTML rein, Daten raus) und damit ohne Netz testbar.
 *
 * Sobald der CMS-Anbieter eine XML/JSON-Schnittstelle freischaltet, wird
 * nur `fetch-catalog.ts` ausgetauscht – das Datenmodell bleibt.
 */
import { parse, type HTMLElement } from "node-html-parser";
import type {
  CancellationScale,
  CmsImage,
  TripPrice,
  TripSection,
  TripStop,
} from "./types.ts";

export interface ListingItem {
  id: number;
  cmsPath: string;
  title: string;
  days: number;
  dateLabel: string;
  soldOut: boolean;
  priceLabel: string;
  price: number;
  image?: string;
}

export interface DetailData {
  id: number;
  title: string;
  subtitle?: string;
  teaser?: string;
  start: string;
  days: number;
  dateLabel: string;
  sold: boolean;
  bookingTo?: string;
  prices: TripPrice[];
  extras: TripPrice[];
  stops: TripStop[];
  stopsNote?: string;
  services: string[];
  sections: TripSection[];
  countries: string[];
  minParticipants?: number;
  maxParticipants?: number;
  cancellation?: CancellationScale;
  images: string[];
  alternativePaths: string[];
}

const clean = (s: string | undefined | null) =>
  (s ?? "")
    .replace(/­/g, "")
    .replace(/&shy;/g, "")
    .replace(/\s+/g, " ")
    .trim();

export function parsePrice(raw: string): number {
  // "€ 54,00" | "42,- €" | "349.00"
  const s = raw.replace(/[^\d,.-]/g, "");
  if (/^\d+\.\d{2}$/.test(s)) return Number(s);
  const m = s.match(/(\d+(?:\.\d{3})*)(?:,(\d{1,2}|-))?/);
  if (!m) return NaN;
  const euros = Number(m[1].replace(/\./g, ""));
  const cents = m[2] && m[2] !== "-" ? Number(m[2].padEnd(2, "0")) : 0;
  return euros + cents / 100;
}

export function idFromPath(path: string): number | null {
  const m = path.match(/\/reise\/(\d+)_/);
  return m ? Number(m[1]) : null;
}

/** Pfad ohne Query (?crop=…) */
export function stripQuery(src: string) {
  return src.split("?")[0];
}

/** Bildnachweis aus dem Dateinamen: "..._-_Foto_Dan_Race_Dollarphotoclub_68157502.jpg" */
export function creditFromPath(path: string): string | undefined {
  const file = decodeURIComponent(path.split("/").pop() ?? "");
  const m = file.match(/[-_]foto[_-](.+)\.\w+$/i);
  if (!m) return undefined;
  const parts = m[1]
    .split(/_+/)
    .filter((p) => !/^\d+$/.test(p) && p.length > 0);
  const agencies = ["fotolia", "dollarphotoclub", "adobestock", "shutterstock"];
  const agency = parts.find((p) => agencies.includes(p.toLowerCase()));
  const names = parts.filter((p) => !agencies.includes(p.toLowerCase()));
  const who = names.join(" ").replace(/-/g, " ").trim();
  if (!who) return undefined;
  return `Foto: ${who}${agency ? ` / ${agency[0].toUpperCase()}${agency.slice(1)}` : ""}`;
}

export function toCmsImage(src: string): CmsImage {
  const path = stripQuery(src);
  return { path, credit: creditFromPath(path) };
}

export const FALLBACK_IMAGE_PATH = "/media/image/webseite/reisebus.jpg";

export function parseListing(html: string): { items: ListingItem[]; found: boolean } {
  const root = parse(html);
  const boxes = root.querySelectorAll(".tourbox");
  const found = boxes.length > 0 || /Suchergebnis/.test(html);
  // Bei leeren Ergebnissen zeigt das CMS "Wie wäre es mit…" – das sind keine Treffer
  const noResult = /Leider gibt es kein Ergebnis/.test(html);
  if (noResult) return { items: [], found: true };
  const items: ListingItem[] = [];
  for (const box of boxes) {
    const a = box.querySelector("a[href^='/reise/']");
    const href = a?.getAttribute("href") ?? "";
    const id = idFromPath(href);
    if (!id) continue;
    const priceAttr = box.getAttribute("data-price");
    const prLabel = box.querySelector(".preis > span");
    items.push({
      id,
      cmsPath: href,
      title: clean(box.querySelector(".tourtitle")?.getAttribute("title") ?? box.querySelector(".tourtitle")?.text),
      days: Number(clean(box.querySelector(".tage span")?.text)) || 1,
      dateLabel: clean(box.querySelector(".datum")?.text),
      soldOut: /ausgebucht/i.test(box.querySelector(".status")?.text ?? "") || /ausgebucht/.test(box.getAttribute("class") ?? ""),
      priceLabel: clean(prLabel?.text),
      price: priceAttr ? Number(priceAttr) : parsePrice(box.querySelector(".pr")?.text ?? ""),
      image: box.querySelector("img")?.getAttribute("src") ?? undefined,
    });
  }
  return { items, found };
}

/** Reiseart-Kategorien aus der Hauptnavigation ("Reiseart") */
export function parseNavCategories(html: string): string[] {
  const root = parse(html);
  const names = new Set<string>();
  for (const a of root.querySelectorAll("#navimain a[href^='/reise/']")) {
    const m = (a.getAttribute("href") ?? "").match(/^\/reise\/([^/?#]+)$/);
    if (m && !/^\d/.test(m[1])) names.add(decodeURIComponent(m[1]));
  }
  return [...names];
}

function sanitizeFragment(el: HTMLElement): string {
  const allowed = new Set(["p", "br", "ul", "ol", "li", "strong", "b", "em", "i"]);
  const walk = (node: HTMLElement): string =>
    node.childNodes
      .map((child) => {
        if (child.nodeType === 3) {
          return child.rawText.replace(/</g, "&lt;");
        }
        if (child.nodeType !== 1) return "";
        const c = child as HTMLElement;
        const tag = c.rawTagName?.toLowerCase();
        if (!tag || ["script", "style", "img", "form", "input", "iframe"].includes(tag)) return "";
        if (tag === "br") return "<br>";
        const inner = walk(c);
        if (tag === "div") return inner.trim() ? `<p>${inner}</p>` : "";
        return allowed.has(tag) ? `<${tag}>${inner}</${tag}>` : inner;
      })
      .join("");
  return walk(el)
    .replace(/(\s*<br>\s*)+$/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function parsePriceList(fragment: string): TripPrice[] {
  const root = parse(fragment);
  return root.querySelectorAll(".normpreis").map((n) => ({
    label: clean(n.querySelector(".title")?.text),
    amount: parsePrice(n.querySelector(".preis")?.text ?? ""),
  })).filter((p) => p.label && Number.isFinite(p.amount));
}

export function parseDetail(html: string, cmsPath: string): DetailData {
  const root = parse(html);
  const val = (sel: string) => root.querySelector(sel)?.getAttribute("value") ?? "";
  const id = Number(val("#reise")) || idFromPath(cmsPath) || 0;

  const h1 = root.querySelector(".reisedetails h1") ?? root.querySelector("h1");
  const sub = h1?.querySelector("span");
  const h2 = root.querySelector(".reisedetails h2");
  const subtitle = clean(sub?.text) || clean(h2?.text) || undefined;
  sub?.remove();
  const title = clean(h1?.text);

  const introEl = root.querySelector(".reisedetails .intro");
  introEl?.querySelectorAll(".clear").forEach((c) => c.remove());
  const teaser = introEl ? sanitizeFragment(introEl) : undefined;

  const firstBox = root.querySelector(".rightbox h3");
  const dateLabel = clean(firstBox?.querySelector("span")?.text);
  const days = Number((firstBox?.text ?? "").match(/(\d+)\s*Reisetag/)?.[1]) || 1;

  const countries: string[] = [];
  for (const box of root.querySelectorAll(".rightbox")) {
    if (/Reiseländer/.test(box.querySelector("h3")?.text ?? "")) {
      box.querySelectorAll("a").forEach((a) => countries.push(clean(a.getAttribute("title") ?? a.text)));
    }
  }

  const tnText = clean(root.querySelector(".teilnehmerzahlen")?.text);
  const minParticipants = Number(tnText.match(/Mindestteilnehmer:\s*(\d+)/)?.[1]) || undefined;
  const maxParticipants = Number(tnText.match(/maximale Anzahl:\s*(\d+)/)?.[1]) || undefined;

  let cancellation: CancellationScale | undefined;
  const staffelLink = root.querySelector("a.stornostaffel");
  const staffelTable = root.querySelector("#stornostaffelstufen table");
  if (staffelLink && staffelTable) {
    const name = clean(staffelLink.text).replace(/^Es gilt\s*/i, "");
    const rows = staffelTable
      .querySelectorAll("tr")
      .map((tr) => tr.querySelectorAll("td").map((td) => clean(td.text)))
      .filter((r) => r.length === 2)
      .map(([period, fee]) => ({ period, fee }));
    cancellation = { name, rows };
  }

  const prices: TripPrice[] = [];
  const extras: TripPrice[] = [];
  let stops: TripStop[] = [];
  let stopsNote: string | undefined;
  let services: string[] = [];
  const sections: TripSection[] = [];

  const titleFor = (key: string) =>
    clean(root.querySelector(`.schaltertitel[data-class='${key}']`)?.text) || key;

  for (const tab of root.querySelectorAll(".taboracordion .tab")) {
    const key = (tab.getAttribute("class") ?? "").split(/\s+/).find((c) => c && c !== "tab" && c !== "open") ?? "";
    if (key === "preise") {
      const inner = tab.innerHTML;
      const cut = inner.search(/<h3[^>]*>[^<]*(Sonderleistung|Zusatz|Aufpreis|Optional)/i);
      prices.push(...parsePriceList(cut >= 0 ? inner.slice(0, cut) : inner));
      if (cut >= 0) extras.push(...parsePriceList(inner.slice(cut)));
    } else if (key === "abfahrtsort") {
      stops = tab.querySelectorAll("ul.abftabl li").map((li) => {
        const time = clean(li.querySelector("b")?.text).replace(/:\s*$/, "");
        li.querySelector("b")?.remove();
        return { time, place: clean(li.text) };
      });
      tab.querySelector("ul")?.remove();
      stopsNote = clean(tab.text) || undefined;
    } else if (key === "leistungen") {
      const lis = tab.querySelectorAll("li").map((li) => clean(li.text)).filter(Boolean);
      services = lis.length ? lis : clean(tab.text) ? [clean(tab.text)] : [];
    } else if (key) {
      const htmlFrag = sanitizeFragment(tab);
      if (htmlFrag) sections.push({ key, title: titleFor(key), html: htmlFrag });
    }
  }

  const images: string[] = [];
  for (const span of root.querySelectorAll("#mainslider .aersatz")) {
    const m = (span.getAttribute("style") ?? "").match(/url\('([^']+)'\)/);
    if (m) images.push(stripQuery(m[1]));
  }
  for (const img of root.querySelectorAll("#mainslider .mslid img")) {
    const s = img.getAttribute("src");
    if (s) images.push(stripQuery(s));
  }

  const alternativePaths = root
    .querySelectorAll(".alttermine li a")
    .map((a) => a.getAttribute("href") ?? "")
    .filter((h) => idFromPath(h));

  const bookingTo = val("#booking_to");
  return {
    id,
    title,
    subtitle,
    teaser: teaser || undefined,
    start: val("#valid_from"),
    days,
    dateLabel,
    sold: val("#sold") === "1",
    bookingTo: bookingTo && !bookingTo.startsWith("0000") ? bookingTo : undefined,
    prices,
    extras,
    stops,
    stopsNote,
    services,
    sections,
    countries,
    minParticipants,
    maxParticipants,
    cancellation,
    images: [...new Set(images)],
    alternativePaths,
  };
}

export function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
