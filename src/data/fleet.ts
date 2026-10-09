/**
 * Fuhrpark – Angaben 1:1 aus /scholkemper/reisebusse.php (Stand 09.10.2026).
 * Bilder: Fuhrpark-Galerie der bisherigen Website.
 * Keine Ausstattung ergänzen, die dort nicht steht.
 */
export type FeatureKey =
  | "klima"
  | "wc"
  | "kueche"
  | "kuehlschrank"
  | "usb"
  | "steckdose"
  | "gurte"
  | "dvd"
  | "mikrofon"
  | "kaffee"
  | "tische"
  | "kofferraum"
  | "sitzabstand"
  | "rampe";

export interface Bus {
  slug: string;
  name: string;
  make: string;
  model: string;
  type: string;
  emission: string;
  seats: number;
  seatsLabel: string;
  standing?: number;
  pitchCm?: number;
  since?: string;
  features: { key: FeatureKey; label: string }[];
  /** Ausstattung wörtlich wie auf der bisherigen Website */
  sourceText: string;
  images: { src: string; alt: string }[];
  /** neutraler Hinweis, abgeleitet aus Kapazität/Ausstattung */
  fit: string;
}

export const FLEET: Bus[] = [
  {
    slug: "neoplan-skyliner-80",
    name: "Neoplan Skyliner",
    make: "Neoplan",
    model: "Skyliner",
    type: "Doppeldecker",
    emission: "Euro 6",
    seats: 80,
    seatsLabel: "80 Plätze",
    since: "seit 01.03.2025",
    features: [
      { key: "klima", label: "Klimaanlage" },
      { key: "wc", label: "WC" },
      { key: "kuehlschrank", label: "2 Kühlschränke" },
      { key: "kueche", label: "2 Würstchenkocher" },
      { key: "kaffee", label: "2 Kaffeemaschinen" },
      { key: "dvd", label: "DVD" },
      { key: "mikrofon", label: "Mikrofon" },
      { key: "tische", label: "2 Tische im Unterdeck" },
      { key: "usb", label: "USB-Anschlüsse" },
      { key: "steckdose", label: "220-V-Steckdosen" },
      { key: "gurte", label: "Sicherheitsgurte an allen Plätzen" },
    ],
    sourceText:
      "Klimaanlage, WC, 2 Kühlschränke, 2x Würstchenkocher, 2x Kaffeemaschinen, DVD, Mikrofon, 2 Tische im Unterdeck, USB-Anschlüsse + 220 V Steckdosen, Sicherheitsgurte an allen Plätzen",
    images: [{ src: "/img/fuhrpark/skyliner-80/aussen.jpg", alt: "Neoplan Skyliner Doppeldecker mit 80 Plätzen, Seitenansicht" }],
    fit: "Für große Gruppen bis 80 Personen",
  },
  {
    slug: "neoplan-skyliner-76",
    name: "Neoplan Skyliner",
    make: "Neoplan",
    model: "Skyliner",
    type: "Doppeldecker",
    emission: "Euro 6",
    seats: 76,
    seatsLabel: "76 Plätze",
    features: [
      { key: "klima", label: "Klimaanlage" },
      { key: "wc", label: "WC" },
      { key: "kuehlschrank", label: "2 Kühlschränke" },
      { key: "kueche", label: "2 Würstchenkocher" },
      { key: "kaffee", label: "2 Kaffeemaschinen" },
      { key: "dvd", label: "DVD" },
      { key: "mikrofon", label: "Mikrofon" },
      { key: "tische", label: "2 Tische im Unterdeck" },
      { key: "usb", label: "teilweise USB-Anschlüsse" },
      { key: "steckdose", label: "teilweise 220-V-Steckdosen" },
      { key: "gurte", label: "Sicherheitsgurte an allen Plätzen" },
    ],
    sourceText:
      "Klimaanlage, WC, 2 Kühlschränke, 2x Würstchenkocher, 2x Kaffeemaschinen, DVD, Mikrofon, 2 Tische im Unterdeck, teilweise USB-Anschlüsse + 220 V Steckdosen, Sicherheitsgurte an allen Plätzen",
    images: [
      { src: "/img/fuhrpark/skyliner-76/aussen.jpg", alt: "Neoplan Skyliner Doppeldecker mit 76 Plätzen im Gegenlicht" },
      { src: "/img/fuhrpark/skyliner-76/innen-tische.jpg", alt: "Unterdeck des Skyliner mit Tischen" },
      { src: "/img/fuhrpark/skyliner-76/innen-oberdeck.jpg", alt: "Oberdeck des Skyliner mit Ledersitzen" },
      { src: "/img/fuhrpark/skyliner-76/innen-unterdeck.jpg", alt: "Sitzbereich im Skyliner" },
    ],
    fit: "Für große Gruppen bis 76 Personen",
  },
  {
    slug: "neoplan-cityliner-50",
    name: "Neoplan Cityliner",
    make: "Neoplan",
    model: "Cityliner",
    type: "3-Achser",
    emission: "Euro 6",
    seats: 50,
    seatsLabel: "50 Sitzplätze",
    pitchCm: 86,
    features: [
      { key: "sitzabstand", label: "86 cm Sitzabstand" },
      { key: "kofferraum", label: "Große Kofferräume" },
      { key: "klima", label: "Klimaanlage" },
      { key: "wc", label: "WC" },
      { key: "kueche", label: "Küche" },
      { key: "kuehlschrank", label: "2 Kühlschränke" },
      { key: "dvd", label: "DVD" },
      { key: "mikrofon", label: "Funk-Mikrofon" },
      { key: "gurte", label: "Sicherheitsgurte" },
      { key: "usb", label: "USB-Anschlüsse an allen Plätzen" },
    ],
    sourceText:
      "86 cm Sitzabstand, große Kofferräume, Klimaanlage, WC, Küche, 2 Kühlschränke, DVD, Funk-Mikrofon, Sicherheitsgurte + USB-Anschlüsse an allen Plätzen",
    images: [
      { src: "/img/fuhrpark/cityliner-50/aussen-nacht.jpg", alt: "Scholkemper Cityliner bei Nacht vor einem Hotel" },
      { src: "/img/fuhrpark/cityliner-50/innen.jpg", alt: "Innenraum des Cityliner mit Ledersitzen" },
    ],
    fit: "Für Gruppen bis 50 Personen, viel Beinfreiheit",
  },
  {
    slug: "neoplan-cityliner-48",
    name: "Neoplan Cityliner",
    make: "Neoplan",
    model: "Cityliner",
    type: "3-Achser",
    emission: "Euro 6",
    seats: 48,
    seatsLabel: "48 Sitzplätze",
    pitchCm: 83,
    features: [
      { key: "sitzabstand", label: "83 cm Sitzabstand" },
      { key: "kofferraum", label: "Große Kofferräume" },
      { key: "klima", label: "Klimaanlage" },
      { key: "wc", label: "WC" },
      { key: "kueche", label: "Heckküche" },
      { key: "kuehlschrank", label: "3 Kühlschränke" },
      { key: "mikrofon", label: "Mikrofon" },
      { key: "gurte", label: "Sicherheitsgurte" },
      { key: "steckdose", label: "Steckdose mit USB in jeder Reihe" },
    ],
    sourceText:
      "83 cm Sitzabstand, große Kofferräume, Klimaanlage, WC, Heckküche, 3 Kühlschränke, Mikrofon, Sicherheitsgurte, Steckdose mit USB-Anschluss in jeder Reihe",
    images: [
      { src: "/img/fuhrpark/cityliner-48/aussen.jpg", alt: "Roter Neoplan Cityliner in der Halle" },
      { src: "/img/fuhrpark/cityliner-48/heckkueche.jpg", alt: "Heckküche mit Kaffeemaschinen im Cityliner" },
      { src: "/img/fuhrpark/cityliner-48/innen-gang.jpg", alt: "Mittelgang mit Reisesitzen im Cityliner" },
      { src: "/img/fuhrpark/cityliner-48/innen-sitze.jpg", alt: "Reisesitze mit roter Naht" },
      { src: "/img/fuhrpark/cityliner-48/innen-licht.jpg", alt: "Innenraum mit blauer Ambientebeleuchtung" },
    ],
    fit: "Für Gruppen bis 48 Personen, mit Heckküche",
  },
  {
    slug: "scania-touring-57",
    name: "Scania Touring",
    make: "Scania",
    model: "Touring",
    type: "3-Achser",
    emission: "Euro 6",
    seats: 57,
    seatsLabel: "57 Sitzplätze",
    features: [
      { key: "klima", label: "Klimaanlage" },
      { key: "wc", label: "WC" },
      { key: "kueche", label: "Küche" },
      { key: "kuehlschrank", label: "2 Kühlschränke" },
      { key: "dvd", label: "DVD" },
      { key: "usb", label: "USB-Anschlüsse" },
      { key: "gurte", label: "Sicherheitsgurte an allen Plätzen" },
    ],
    sourceText: "Klimaanlage, WC, Küche, 2 Kühlschränke, DVD, USB-Anschlüsse, Sicherheitsgurte an allen Plätzen",
    images: [
      { src: "/img/fuhrpark/scania-57/aussen.jpg", alt: "Scania Touring Reisebus vor der Halle" },
      { src: "/img/fuhrpark/scania-57/sitze.jpg", alt: "Reisesitze im Scania Touring" },
      { src: "/img/fuhrpark/scania-57/innen.jpg", alt: "Innenraum des Scania Touring" },
      { src: "/img/fuhrpark/scania-57/cockpit.jpg", alt: "Fahrerplatz im Scania Touring" },
    ],
    fit: "Für Gruppen bis 57 Personen",
  },
  {
    slug: "scania-touring-49",
    name: "Scania Touring",
    make: "Scania",
    model: "Touring",
    type: "Reisebus",
    emission: "Euro 6",
    seats: 49,
    seatsLabel: "49 Sitzplätze",
    features: [
      { key: "klima", label: "Klimaanlage" },
      { key: "wc", label: "WC" },
      { key: "kueche", label: "Küche" },
      { key: "kuehlschrank", label: "2 Kühlschränke" },
      { key: "dvd", label: "DVD" },
      { key: "usb", label: "USB-Anschlüsse" },
      { key: "gurte", label: "Sicherheitsgurte an allen Plätzen" },
    ],
    sourceText: "Klimaanlage, WC, Küche, 2 Kühlschränke, DVD, USB-Anschlüsse, Sicherheitsgurte an allen Plätzen",
    images: [{ src: "/img/fuhrpark/scania-49/aussen.jpg", alt: "Scania Touring mit 49 Sitzplätzen am Betriebshof" }],
    fit: "Für Gruppen bis 49 Personen",
  },
  {
    slug: "linienbus",
    name: "Linienbus",
    make: "",
    model: "Linienbus",
    type: "Linienbus",
    emission: "Euro 6",
    seats: 41,
    seatsLabel: "41 Sitz- + 40 Stehplätze",
    standing: 40,
    features: [
      { key: "rampe", label: "Rampe" },
      { key: "klima", label: "Klimaanlage" },
    ],
    sourceText: "41 Sitzplätze + 40 Stehplätze, Rampe, Klimaanlage",
    images: [],
    fit: "Für kurze Shuttle- und Transferstrecken",
  },
];

/** Gemeinsame Ausstattung aller Mietomnibusse (Seite "Mietomnibusse") */
export const FLEET_COMMON = [
  "Klimaanlage",
  "Audio- und Mikrofonsystem",
  "Sicherheitsgurte",
  "Komfortable Reisebestuhlung",
  "Winterausrüstung in den Wintermonaten (Winterreifen, Schneeketten)",
];

export const getBus = (slug: string) => FLEET.find((b) => b.slug === slug);
