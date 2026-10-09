export interface NavLink {
  label: string;
  href: string;
  desc?: string;
}

export const BUS_LINKS: NavLink[] = [
  { label: "Busvermietung", href: "/busvermietung", desc: "Reisebus mit Fahrer mieten – 48 bis 80 Plätze" },
  { label: "Bus anfragen", href: "/busanfrage", desc: "Angebot in wenigen Schritten anfragen" },
  { label: "Shuttle & Transfer", href: "/shuttle-transfer", desc: "Messe, Flughafen, Events, Hotels" },
  { label: "Klassenfahrten", href: "/klassenfahrten", desc: "Sichere Busse für Schulen und Kitas" },
  { label: "Gruppen & Vereine", href: "/gruppenreisen", desc: "Vereins-, Betriebs- und Jahrgangsausflüge" },
  { label: "Fuhrpark", href: "/fuhrpark", desc: "Doppeldecker, Cityliner, Scania Touring" },
  { label: "Bus-Catering", href: "/busvermietung/bus-catering", desc: "Lunchpakete und Bordservice" },
];

export const SERVICE_LINKS: NavLink[] = [
  { label: "Reise-Info A–Z", href: "/reiseinfo" },
  { label: "Reisekatalog", href: "/reisekatalog" },
  { label: "Bildergalerie", href: "/galerie" },
  { label: "Newsletter", href: "/newsletter" },
  { label: "Reisebedingungen Tagesfahrten", href: "/reisebedingungen" },
  { label: "AGB Anmietverkehr", href: "/agb-anmietverkehr" },
];

export const COMPANY_LINKS: NavLink[] = [
  { label: "Über uns", href: "/ueber-uns" },
  { label: "Team", href: "/ueber-uns#team" },
  { label: "Stellenangebote", href: "/jobs" },
  { label: "Kontakt & Anfahrt", href: "/kontakt" },
];

export const LEGAL_LINKS: NavLink[] = [
  { label: "Impressum", href: "/impressum" },
  { label: "Datenschutz", href: "/datenschutz" },
  { label: "Cookies", href: "/cookies" },
  { label: "Reisebedingungen", href: "/reisebedingungen" },
  { label: "AGB Anmietverkehr", href: "/agb-anmietverkehr" },
];
