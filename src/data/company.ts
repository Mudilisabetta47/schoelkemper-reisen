/**
 * Team, Stellen, Reise-Info – übernommen von der bisherigen Website
 * (mitarbeiter.php, stellenangebote.php, reise_info.php), Stand 09.10.2026.
 * Namen und Funktionen unverändert wie veröffentlicht. Fotos nur, wo die
 * bisherige Seite ein echtes Porträt zeigt (sonst Initialen statt Platzhalter-Busbild).
 */
export interface TeamMember {
  name: string;
  role: string;
  photo?: string;
}

export const TEAM: TeamMember[] = [
  { name: "A. Scholkemper", role: "Geschäftsführung", photo: "/img/team/annemarie-scholkemper.jpg" },
  { name: "Heiko Scholkemper", role: "Disponent / Reisebusfahrer", photo: "/img/team/heiko-scholkemper.jpg" },
  { name: "Martin, Witzger Nierhehn", role: "Reisebusfahrer, Disposition", photo: "/img/team/martin-witzger-nierhehn.jpg" },
  { name: "Rinker, Andreas", role: "Reisebusfahrer", photo: "/img/team/andreas-rinker.jpg" },
  { name: "Göktas, Recep", role: "Reisebusfahrer" },
  { name: "Oliver, Prehn", role: "Reisebusfahrer", photo: "/img/team/oliver-prehn.jpg" },
  { name: "Klaus, Tennhardt", role: "Reisebusfahrer", photo: "/img/team/klaus-tennhardt.jpg" },
  { name: "Kühn, Manfred", role: "Reisebusfahrer" },
  { name: "Porada Michael", role: "Reisebusfahrer" },
  { name: "Heising Michael", role: "Reisebusfahrer" },
  { name: "Gottschalk, Lutz", role: "Reisebusfahrer" },
  { name: "Oelmann, Bernd", role: "Reisebusfahrer" },
  { name: "Schacht, Silke", role: "Fahrzeugaufbereitung" },
];

export interface Job {
  slug: string;
  title: string;
  employment: string[];
  schemaEmployment: string[];
  intro: string;
  tasks: string[];
  requirements: string[];
  notes: string[];
  /** Für JobPosting-Schema erforderlich – Veröffentlichungsdatum vom Kunden bestätigen lassen */
  datePosted?: string;
}

export const JOBS: Job[] = [
  {
    slug: "reisebusfahrer",
    title: "Reisebusfahrer (m/w/d)",
    employment: ["Vollzeit", "Aushilfe"],
    schemaEmployment: ["FULL_TIME", "PART_TIME"],
    intro: "Zur Unterstützung unserer Kollegen suchen wir in Vollzeit und zur Aushilfe Reisebusfahrer/innen.",
    tasks: ["Tages- und Mehrtagesfahrten im In- und Ausland", "Transfers mit Reisegruppen aller Altersstufen"],
    requirements: [
      "Freundlichkeit und Zuverlässigkeit",
      "Reisebereitschaft",
      "Kenntnis von Lenk- und Ruhezeiten",
      "Gültiger Personenbeförderungsschein für Omnibus (Klasse D)",
      "Berufserfahrung, Erfahrung im In- und Ausland",
      "Sehr hohe Flexibilität, ab sofort einsetzbar",
      "Gepflegter Auftritt und Bereitschaft zur Fahrzeugpflege",
      "Viel Freude am Umgang mit unseren Kunden",
    ],
    notes: [
      "Wegen der spontanen und täglich wechselnden Einsätze ist es uns wichtig, dass Sie aus dem Raum Hannover kommen.",
      "Sie sollten kein Problem damit haben, den Reisebus auch nachts zu fahren.",
    ],
  },
  {
    slug: "fahrzeugpfleger",
    title: "Fahrzeugpfleger / Fahrzeugaufbereiter (m/w/d)",
    employment: ["600-€-Basis"],
    schemaEmployment: ["PART_TIME"],
    intro:
      "Für unsere gepflegte Fahrzeugflotte suchen wir eine/n zuverlässige/n Wagenpfleger / Fahrzeugaufbereiter (m/w/d) auf 600-€-Basis, auf unserem Betriebshof in Empelde/Hannover.",
    tasks: ["Sie warten und pflegen unsere Flotte an Reisebussen."],
    requirements: [
      "Technisches Verständnis, Sorgfalt und Fleiß",
      "Von Vorteil: Erfahrung im Kfz-Bereich oder in der Wagenpflege",
    ],
    notes: ["Arbeitszeit im Wechseldienst, auch an Wochenenden und Feiertagen."],
  },
];

/** Reise-Info von A bis Z – Wortlaut der bisherigen Seite, sprachlich nur minimal geglättet */
export const REISE_INFO: { term: string; text: string; href?: string }[] = [
  { term: "Abfahrtszeiten", text: "Online und im Katalog informativ – in der Reisebestätigung verbindlich (siehe auch Zustiege)." },
  { term: "Allgemeine Reisebedingungen", text: "Können Sie hier abrufen und ausdrucken.", href: "/reisebedingungen" },
  { term: "Anmeldungen", text: "Können telefonisch oder schriftlich erfolgen. Auch Ihre telefonische Anmeldung ist verbindlich." },
  {
    term: "Ausflüge, Stadtrundfahrten, Schifffahrten",
    text: "Bei einigen wenigen Reisen werden zusätzliche Leistungen angeboten, erkennbar an der Formulierung „Gelegenheit bzw. Möglichkeit zu …“. Die Kosten sind nicht im Reisepreis enthalten und hängen von der Teilnehmerzahl sowie den Angeboten der Leistungsträger vor Ort ab. Ihr Busfahrer berät Sie gern.",
  },
  { term: "Buchungsmöglichkeiten", text: "Buchungen nehmen wir telefonisch oder schriftlich entgegen. Unsere Mitarbeiter sind Montag bis Freitag von 9.00 bis 13.00 Uhr für Sie da." },
  { term: "Busfahrer", text: "Zuverlässig, erfahren, gut geschult und um Ihr Wohl bemüht." },
  {
    term: "Einzelreisende",
    text: "Einzelzimmer stehen nicht immer in ausreichender Zahl zur Verfügung – bitte buchen Sie frühzeitig, dann können wir Ihr Zimmer garantieren. Wenn Sie Interesse an einem halben Doppelzimmer haben, sagen Sie es uns. Wir helfen, einen passenden Partner zu finden.",
  },
  { term: "Ermäßigungen", text: "Grundsätzlich kann nur eine Ermäßigungsart angewendet werden." },
  {
    term: "Frühbucher-Bonus = Wunsch-Sitzplätze",
    text: "Für alle, die gern bevorzugte Sitzplätze möchten. Bis 60 Tage vor Reisebeginn berechnen wir keine Stornokosten. „Last-Minute-Angebote“ oder Nachlässe für kurzfristige Buchungen gibt es bei uns nicht.",
  },
  {
    term: "Gepäck",
    text: "Wir müssen die gesetzlichen Vorgaben zum Gesamtgewicht des Reisebusses einhalten. Pro Reisegast kann daher nur ein Gepäckstück mit maximal 20 kg befördert werden – möglichst keine Hartschalenkoffer.",
  },
  { term: "Gesetzliche Vorschriften", text: "Fahrerlenk- und Ruhezeiten werden zu Ihrer Sicherheit eingehalten." },
  { term: "Gruppenrabatt", text: "Gemeinsam fahren – Geld sparen: gilt für Clubs und Gruppen bei gemeinsamer Buchung direkt bei uns." },
  {
    term: "Gruppenreisen",
    text: "Sie planen einen Vereins- oder Jahrgangsausflug, Betriebsausflug, Messe- oder Flughafentransfer oder eine Incentive-Reise? Teilen Sie uns Ihre Wünsche mit, wir arbeiten Ihnen ein Angebot aus.",
    href: "/gruppenreisen",
  },
  {
    term: "Komfortable Reisebusse",
    text: "Eingesetzt werden ausnahmslos Fahrzeuge mit mindestens 77 cm Sitzabstand, Schlafsesselbestuhlung mit verstellbaren Rückenlehnen und Seitenabstand, Kühlbar und Bordküche, Bord-WC mit Waschgelegenheit (umweltschonende Wassertoiletten, von November bis März nur eingeschränkt geöffnet) sowie Düsenbelüftung und Klimaanlage.",
    href: "/fuhrpark",
  },
  { term: "Leistungen", text: "Die Leistungen finden Sie in der jeweiligen Reisebeschreibung." },
  {
    term: "Mindestteilnehmerzahl",
    text: "Ab 30 Personen wird die Reise durchgeführt. Wird diese Zahl nicht erreicht, kann die Reise bis 21 Tage vor Reisebeginn abgesagt werden. Wir bemühen uns dann um eine Alternative. (Abweichende Angaben stehen in der jeweiligen Reise.)",
  },
  { term: "Nichtraucher", text: "Unsere Busse sind Nichtraucher-Busse. Regelmäßige Pausen berücksichtigen auch die Raucher." },
  { term: "Notruf – 24-Stunden-Service", text: "In dringenden Fällen erreichen Sie uns rund um die Uhr unter 0151 22 94 81 92." },
  {
    term: "Pkw-Abstellplätze",
    text: "Stehen kostenlos (begrenzt) auf unserem Betriebsgelände zur Verfügung. Sie steigen direkt in Ihren Reisebus ein. Bitte bei der Buchung angeben.",
  },
  {
    term: "Reisepapiere",
    text: "Für Reisen ins Ausland brauchen Sie gültige Ausweispapiere. Besonderheiten stehen in der jeweiligen Reise. Für Reisegäste aus dem Ausland gelten oft andere Einreisebestimmungen.",
  },
  {
    term: "Sicherheit",
    text: "Unsere Fahrer sind gut ausgebildet und durch regelmäßige Sicherheitstrainings geschult. Alle Reisebusse werden in der betriebseigenen Kfz-Werkstatt gewartet, jährlich bei der TÜV/DEKRA-Hauptuntersuchung kontrolliert und alle 3 Monate einem intensiven Sicherheitscheck (SP-Prüfung) unterzogen.",
  },
  { term: "Sitzplätze", text: "Werden in der Reihenfolge der Anmeldung vergeben. Sitzplatzwünsche berücksichtigen wir gern – je früher Sie buchen, desto größer die Auswahl." },
  {
    term: "Versicherungen",
    text: "Wir empfehlen eine Reise-Rücktrittskosten-Versicherung. Zu Reisekranken- und Gepäckversicherung beraten wir Sie gern oder Sie fragen Ihre Versicherungsagentur.",
  },
  { term: "Wartung", text: "Unsere Reisebusse werden in der betriebseigenen Werkstatt oder in der Fachwerkstatt sorgfältig gewartet." },
  { term: "Zahlung", text: "Per Überweisung oder per EC-Zahlung im Büro." },
  { term: "Zubringer-Service", text: "Für Gruppen bieten wir einen Zubringerdienst an. Die Kosten werden mit dem Gruppenrabatt verrechnet." },
];

/** Bus-Catering – Seite /busvermietung/essen.php */
export const CATERING = {
  packages: [
    { name: "Variante 1", items: ["1 belegtes Brötchen nach Wahl (Schinken, Käse oder Wurst)", "1 Stück Obst (Apfel, Banane oder Birne)", "1 Riegel (Schoko- oder Müsliriegel)", "1 Soft- oder Warmgetränk nach Wahl"] },
    { name: "Variante 2", items: ["1 Sandwich (2 Scheiben Weißbrot) mit Remoulade, Schinken und Käse oder Tomate/Mozzarella", "1 Stück Obst (Apfel, Banane oder Birne)", "1 Riegel (Schoko- oder Müsliriegel)", "1 Soft- oder Warmgetränk nach Wahl"] },
    { name: "Variante 3", items: ["1 belegtes Baguette nach Wahl (Schinken, Käse oder Wurst)", "1 Stück Obst (Apfel, Banane oder Birne)", "1 Riegel (Schoko- oder Müsliriegel)", "1 Soft- oder Warmgetränk nach Wahl"] },
    { name: "Variante 4", items: ["1 belegtes Brötchen nach Wahl (Schinken, Käse oder Wurst)", "1 Soft- oder Warmgetränk nach Wahl", "1 Glas Sekt"] },
    { name: "Imbiss 1", items: ["1 Bockwurst mit Brot und Senf", "1 Softgetränk"] },
  ],
  onboard: ["Mineralwasser", "Coca-Cola", "Bier", "Apfelschorle", "Piccolo", "div. Schnäpse", "Kaffee"],
  leadTime: "Bitte sagen Sie uns 4 Tage vor der Fahrt Bescheid, wenn Sie einen Imbiss wünschen.",
};
