/**
 * Zentrale Unternehmensdaten (NAP). Alle Angaben stammen von der bisherigen
 * Website (Impressum, Kontakt, Reise-Info A–Z), Stand 09.10.2026.
 * Überall auf der Website wird ausschließlich von hier gelesen.
 */
export const SITE = {
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.scholkemper-reisen.de").replace(/\/$/, ""),
  name: "Scholkemper Reisen",
  legalName: "Scholkemper Reisen GmbH",
  slogan: "Für Ihre „schönsten Tage des Jahres“ machen wir uns stark.",
  address: {
    street: "Apollostraße 10",
    zip: "30952",
    city: "Ronnenberg",
    district: "Empelde",
    region: "Region Hannover",
    state: "Niedersachsen",
    country: "DE",
  },
  geo: { lat: 52.3440521, lng: 9.648115 },
  phone: { display: "0511 47 30 10 96", href: "tel:+4951147301096", e164: "+49 511 47301096" },
  fax: { display: "0511 47 36 36 2" },
  emergency: { display: "0151 22 94 81 92", href: "tel:+4915122948192" },
  email: "info@scholkemper-reisen.de",
  /** "Unsere Mitarbeiter stehen für Sie von Montag–Freitag von 09.00 bis 13.00 Uhr zur Verfügung." */
  hours: { label: "Mo–Fr 9–13 Uhr", schema: ["Mo-Fr 09:00-13:00"] },
  register: { court: "Amtsgericht Hannover", number: "HRB 214614" },
  vatId: "DE 309621359",
  managingDirector: "Annemarie Scholkemper",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Scholkemper+Reisen+Apollostra%C3%9Fe+10+30952+Ronnenberg",
} as const;

export const ADDRESS_LINE = `${SITE.address.street}, ${SITE.address.zip} ${SITE.address.city}-${SITE.address.district}`;

/** Belegte Fakten für Trust-Bereiche – Quelle jeweils in Klammern */
export const FACTS = {
  family: "Familienunternehmen", // Über uns
  seats: "48 bis 80 Sitzplätze je Reisebus", // Fuhrpark
  workshop: "Wartung in der betriebseigenen Werkstatt", // Reise-Info "Sicherheit", Mietomnibusse
  spCheck: "Sicherheitscheck (SP-Prüfung) alle 3 Monate", // Reise-Info "Sicherheit"
  inspection: "Jährliche Hauptuntersuchung bei TÜV/DEKRA", // Reise-Info "Sicherheit"
  training: "Regelmäßige Sicherheitstrainings für unsere Fahrer", // Reise-Info "Sicherheit"
  restTimes: "Lenk- und Ruhezeiten werden ohne Ausnahme eingehalten", // Mietomnibusse
  languages: "Auf Wunsch Fahrer mit Englisch- oder Spanischkenntnissen", // Mietomnibusse
  parking: "Kostenlose Pkw-Stellplätze am Betriebshof (begrenzt)", // Reise-Info
  hotline: "24-Stunden-Notruf während der Reise", // Reise-Info
  winter: "Winterausrüstung in den Wintermonaten", // Mietomnibusse
} as const;
