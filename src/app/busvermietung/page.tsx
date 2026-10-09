import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/layout/PageHero";
import { CtaBand, FaqList, SectionHead, Split, Steps } from "@/components/ui/Blocks";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Pic } from "@/components/ui/Pic";
import { FLEET, FLEET_COMMON } from "@/data/fleet";
import { faqLd, JsonLd, pageMeta, serviceLd } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Bus mieten in Hannover – Busvermietung mit Fahrer",
  description:
    "Reisebus mit Fahrer mieten in Hannover: 48 bis 80 Plätze, Doppeldecker, Cityliner, Scania Touring – für Gruppen, Vereine, Firmen, Messen und Schulen.",
  path: "/busvermietung",
  image: "/img/bus/betriebshof-panorama.jpg",
});

const OCCASIONS = [
  { icon: "users", title: "Gruppen & Vereine", text: "Vereinsausflug, Jahrgangstreffen, Clubfahrt – mit Planung von A bis Z.", href: "/gruppenreisen" },
  { icon: "grid", title: "Unternehmen", text: "Betriebsausflüge, Incentive-Reisen und Fahrten für Ihre Gäste.", href: "/gruppenreisen" },
  { icon: "sparkle", title: "Messen", text: "Messe-Shuttle zwischen Hotel, Bahnhof und Messegelände.", href: "/shuttle-transfer" },
  { icon: "globe", title: "Flughafen", text: "Flughafen-Shuttle für Gruppen – hin und zurück.", href: "/shuttle-transfer" },
  { icon: "shield", title: "Schulklassen", text: "Klassenfahrten, Schüler- und Abschlussreisen, Kita-Ausflüge.", href: "/klassenfahrten" },
  { icon: "pin", title: "Transfers", text: "Zubringer, Hotel- und Veranstaltungstransfers in der Region.", href: "/shuttle-transfer" },
  { icon: "calendar", title: "Events & Sport", text: "Mannschaften, Fans und Gäste – pünktlich zum Anpfiff.", href: "/shuttle-transfer" },
  { icon: "coffee", title: "Tagesfahrten", text: "Ein Bus für Ihre eigene Tagesfahrt – mit Catering an Bord.", href: "/busvermietung/bus-catering" },
] as const;

const FAQ = [
  {
    q: "Wie viele Personen passen in einen Bus?",
    a: "Unsere Reisebusse haben 48 bis 80 Plätze – vom Cityliner bis zum Doppeldecker. Für größere Gruppen setzen wir mehrere Fahrzeuge ein. Bei Kapazitätsengpässen arbeiten wir mit qualitativ hochwertigen Subunternehmen.",
  },
  {
    q: "Fahren Sie auch ins Ausland?",
    a: "Ja. Wir fahren Gruppen innerhalb Deutschlands und ins europäische Ausland. Die gesetzlichen Lenk- und Ruhezeiten planen wir ein.",
  },
  {
    q: "Können wir einen Fahrer mit Fremdsprachenkenntnissen bekommen?",
    a: "Auf Wunsch setzen wir Fahrer mit englischen oder spanischen Sprachkenntnissen ein.",
  },
  {
    q: "Was ist im Mietpreis enthalten?",
    a: "Fahrzeug der vereinbarten Art inklusive Fahrer und die Beförderung. Nebenkosten wie Straßen- und Parkgebühren oder Übernachtungskosten des Fahrers werden gesondert berechnet, sofern nichts anderes vereinbart ist.",
  },
  {
    q: "Wie kann ich stornieren?",
    a: "Bis 60 Tage vor Fahrtantritt kostenfrei. Danach gelten die Pauschalen aus unseren AGB für den Anmietverkehr (20 % bis 75 % des Mietpreises, je nach Zeitpunkt).",
  },
  {
    q: "Gibt es Verpflegung an Bord?",
    a: "Unsere Fahrer haben Getränke an Bord. Lunchpakete und Imbiss bestellen Sie bis 4 Tage vor der Fahrt mit.",
  },
];

export default function BusvermietungPage() {
  return (
    <>
      <PageHero
        eyebrow="Busvermietung Hannover"
        title={"Der richtige Bus\nfür Ihre Reise."}
        accent={["Bus"]}
        crumbs={[{ name: "Busvermietung", path: "/busvermietung" }]}
        image="/img/bus/betriebshof-panorama.jpg"
        imageAlt="Scholkemper-Reisebusse am Betriebshof in Empelde"
        size="lg"
        lead={
          <p>
            Sie möchten in Hannover und Umgebung einen Bus oder mehrere Busse mieten? Wir stellen Reisebus und Fahrer – und planen die Fahrt mit
            Ihnen. Von 48 bis 80 Plätzen.
          </p>
        }
      >
        <ButtonLink href="/busanfrage" variant="primary" cursor="Anfragen">
          Bus anfragen
        </ButtonLink>
        <ButtonLink href="/fuhrpark" variant="ghost">
          Fuhrpark ansehen
        </ButtonLink>
      </PageHero>

      <section className="section">
        <div className="container">
          <SectionHead eyebrow="Wofür" title={"Wofür Sie\nuns mieten."} split lead={<p>Planung, Fahrzeug, Fahrer und Durchführung aus einer Hand.</p>} />
          <ul className="occ-grid" role="list">
            {OCCASIONS.map((o, i) => (
              <li key={o.title} data-reveal="up" style={{ ["--rv-delay" as string]: `${(i % 4) * 70}ms` }}>
                <Link href={o.href} className="occ-card">
                  <Icon name={o.icon} size={26} />
                  <span className="occ-card__t">{o.title}</span>
                  <span className="occ-card__d">{o.text}</span>
                  <Icon name="arrow" className="occ-card__arrow" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section section--night on-dark" data-header-theme="dark">
        <div className="container">
          <SectionHead eyebrow="Fuhrpark" title={"48 bis 80\nPlätze."} split lead={<p>Alle Fahrzeuge Euro 6, mit Klimaanlage, Audio- und Mikrofonsystem und Sicherheitsgurten.</p>} />
          <ul className="fleet-mini" role="list">
            {FLEET.map((b) => (
              <li key={b.slug}>
                <Link href={`/fuhrpark/${b.slug}`} className="fleet-mini__card">
                  <span className="fleet-mini__img">
                    {b.images[0] ? <Pic src={b.images[0].src} alt="" fill sizes="(min-width: 900px) 25vw, 70vw" /> : <Icon name="bus" size={42} />}
                  </span>
                  <span className="fleet-mini__seats num">{b.seatsLabel}</span>
                  <span className="fleet-mini__name">{b.name}</span>
                  <span className="fleet-mini__type">
                    {b.type} · {b.emission}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section">
        <div className="container stack" style={{ ["--stack" as string]: "clamp(4rem,8vw,8rem)" }}>
          <Split image="/img/fuhrpark/cityliner-48/heckkueche.jpg" alt="Heckküche mit Kaffeemaschinen in einem Scholkemper-Reisebus">
            <p className="eyebrow">Ausstattung</p>
            <h2 className="h3">Komfort, der mitfährt.</h2>
            <p>Je nach Fahrzeug an Bord:</p>
            <ul className="checklist" role="list">
              {["WC / Waschraum", "Bordküche mit Kaffeemaschine", "Kühlschrank", "Navigationssystem", "DVD- und CD-Player, Audiosystem", "Großzügiger Sitzabstand"].map((x) => (
                <li key={x}>
                  <Icon name="check" size={18} /> {x}
                </li>
              ))}
            </ul>
            <p className="muted">Grundausstattung aller Mietomnibusse: {FLEET_COMMON.join(", ")}.</p>
          </Split>
          <Split image="/img/bus/fahrsicherheitstraining-2025.jpg" alt="Reisebus beim Fahrsicherheitstraining 2025" reverse caption="Fahrsicherheitstraining 2025">
            <p className="eyebrow">Fahrer &amp; Sicherheit</p>
            <h2 className="h3">Der Fahrer macht den Unterschied.</h2>
            <p>
              Trotz aller Technik ist ein besonnener, erfahrener und ausgeruhter Busfahrer das wichtigste Sicherheitsmerkmal. Schon bei der Bewerbung
              prüfen wir unsere Fahrer per Probefahrt und fragen die Unfallhistorie bei früheren Arbeitgebern ab. Langjährige Fahrpraxis ist
              Voraussetzung.
            </p>
            <ul className="checklist" role="list">
              {[
                "Lenk- und Ruhezeiten ohne Ausnahme",
                "Wartung in der eigenen Werkstatt",
                "SP-Prüfung alle 3 Monate",
                "Tägliche Reinigung der Fahrzeuge",
              ].map((x) => (
                <li key={x}>
                  <Icon name="check" size={18} /> {x}
                </li>
              ))}
            </ul>
          </Split>
        </div>
      </section>

      <section className="section section--sand">
        <div className="container">
          <SectionHead eyebrow="Incoming" title={"Sie kommen\nnach Hannover?"} split lead={<p>Wir holen Ihre Gruppe am Flughafen oder Bahnhof ab und fahren sie zu Hotel, Messe und Programmpunkten in der Region.</p>} />
          <Steps
            items={[
              { title: "Anfrage", text: "Ankunft, Teilnehmerzahl und Programm – per Formular, E-Mail oder Telefon." },
              { title: "Planung", text: "Wir stimmen Fahrzeuge, Zeiten und Wege mit Ihnen ab." },
              { title: "Durchführung", text: "Ein fester Ansprechpartner, ein Fahrer, der Hannover kennt." },
            ]}
          />
        </div>
      </section>

      <section className="section">
        <div className="container container--narrow">
          <SectionHead eyebrow="Fragen" title="Häufige Fragen." />
          <FaqList items={FAQ} />
          <p className="muted" style={{ marginTop: "1.5rem" }}>
            Alle Bedingungen: <Link href="/agb-anmietverkehr">AGB Anmietverkehr</Link>
          </p>
        </div>
      </section>

      <CtaBand />
      <JsonLd
        data={[
          serviceLd({
            name: "Busvermietung mit Fahrer in Hannover",
            description: "Reisebusse mit Fahrer für Gruppen, Vereine, Unternehmen, Messen, Flughafen-Transfers und Klassenfahrten – 48 bis 80 Plätze.",
            path: "/busvermietung",
            serviceType: "Busvermietung mit Fahrer",
          }),
          faqLd(FAQ.map((f) => ({ q: f.q, a: f.a }))),
        ]}
      />
    </>
  );
}
