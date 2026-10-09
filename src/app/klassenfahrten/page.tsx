import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { InquiryForm } from "@/components/forms/InquiryForm";
import { PageHero } from "@/components/layout/PageHero";
import { FaqList, FeatureGrid, SectionHead, Steps } from "@/components/ui/Blocks";
import { ButtonLink } from "@/components/ui/Button";
import { faqLd, JsonLd, pageMeta, serviceLd } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Bus für Klassenfahrten in Hannover",
  description:
    "Bus mieten für Klassenfahrt, Schülerreise, Abschlussfahrt oder Kita-Ausflug ab Hannover – sichere Reisebusse mit Gurten, erfahrene Fahrer, Angebot binnen 48 Stunden.",
  path: "/klassenfahrten",
  image: "/img/bus/reisebus-front.jpg",
});

const FAQ = [
  { q: "Wie schnell bekommen wir ein Angebot?", a: "Sie erhalten binnen 48 Stunden ein unverbindliches Angebot von unserem Team." },
  { q: "Wie viele Schülerinnen und Schüler passen in einen Bus?", a: "Unsere Reisebusse haben 48 bis 80 Plätze. Für mehrere Klassen setzen wir mehrere Busse oder einen Doppeldecker ein." },
  { q: "Haben alle Plätze Sicherheitsgurte?", a: "Ja, unsere Reisebusse sind mit Sicherheitsgurten ausgestattet." },
  {
    q: "Übernimmt der Fahrer die Aufsicht?",
    a: "Nein. Die Beaufsichtigung der Fahrgäste – insbesondere von Kindern und Jugendlichen – ist nicht Teil der Beförderungsleistung und bleibt bei den begleitenden Lehrkräften bzw. Betreuern (siehe AGB Anmietverkehr, § 2).",
  },
  { q: "Fahren Sie auch ins Ausland?", a: "Ja – innerhalb Deutschlands und in Europa." },
];

export default function KlassenfahrtenPage() {
  return (
    <>
      <PageHero
        eyebrow="Klassenfahrten"
        title={"Sicher zur\nKlassenfahrt."}
        crumbs={[{ name: "Klassenfahrten", path: "/klassenfahrten" }]}
        image="/img/bus/betriebshof-reisebusse.jpg"
        imageAlt="Reisebusse von Scholkemper am Betriebshof"
        lead={
          <p>
            Bus für Klassenfahrt, Schülerreise, Abschlussfahrt oder Kindergartenausflug – innerhalb Deutschlands oder in Europa. Sie erhalten binnen 48
            Stunden ein unverbindliches Angebot.
          </p>
        }
      >
        <ButtonLink href="#anfrage" variant="primary" icon="arrowDown">
          Angebot anfordern
        </ButtonLink>
      </PageHero>

      <section className="section">
        <div className="container">
          <SectionHead eyebrow="Für Lehrkräfte & Eltern" title={"Was Sie wissen\nmüssen."} />
          <FeatureGrid
            cols={4}
            items={[
              { icon: "bus", title: "Bus", text: "Reisebusse mit 48 bis 80 Plätzen, Klimaanlage, WC und Sicherheitsgurten." },
              { icon: "calendar", title: "Planung", text: "Eigene Fahrt oder eine Reise aus unserem Programm – Angebot binnen 48 Stunden." },
              { icon: "shield", title: "Sicherheit", text: "SP-Prüfung alle 3 Monate, jährliche Hauptuntersuchung, Wartung in der eigenen Werkstatt." },
              { icon: "users", title: "Fahrer", text: "Erfahren, regelmäßig geschult, Lenk- und Ruhezeiten werden eingehalten." },
            ]}
          />
        </div>
      </section>

      <section className="section section--sand">
        <div className="container">
          <SectionHead eyebrow="Ablauf" title="In drei Schritten." />
          <Steps
            items={[
              { title: "Anfrage", text: "Ziel, Datum, Anzahl der Schüler und Begleitpersonen." },
              { title: "Angebot", text: "Binnen 48 Stunden – unverbindlich." },
              { title: "Fahrt", text: "Abholung an der Schule, Rückfahrt wie vereinbart." },
            ]}
          />
        </div>
      </section>

      <section className="section">
        <div className="container container--narrow">
          <SectionHead eyebrow="Fragen" title="Gut zu wissen." />
          <FaqList items={FAQ} />
          <p className="muted" style={{ marginTop: "1.5rem" }}>
            <Link href="/agb-anmietverkehr">AGB Anmietverkehr</Link>
          </p>
        </div>
      </section>

      <section className="section section--soft" id="anfrage">
        <div className="container form-layout">
          <div className="stack">
            <p className="eyebrow">Anfrage Klassenfahrt</p>
            <h2 className="h2">Angebot anfordern.</h2>
            <p className="lead">Unverbindlich – Antwort binnen 48 Stunden.</p>
          </div>
          <Suspense fallback={null}>
            <InquiryForm
              type="klassenfahrt"
              submitLabel="Angebot anfordern"
              doneText="Danke! Sie erhalten binnen 48 Stunden ein unverbindliches Angebot."
              fields={[
                { name: "schule", label: "Schule / Einrichtung", wide: true },
                { name: "klasse", label: "Klasse / Gruppe" },
                { name: "personen", label: "Personen inkl. Begleitung", type: "number" },
                { name: "ziel", label: "Ziel" },
                { name: "datum", label: "Datum", type: "date" },
                { name: "rueckdatum", label: "Rückfahrt", type: "date" },
                { name: "name", label: "Ansprechpartner/in", autoComplete: "name" },
                { name: "email", label: "E-Mail", type: "email", autoComplete: "email" },
                { name: "telefon", label: "Telefon", type: "tel", autoComplete: "tel" },
                { name: "bemerkungen", label: "Bemerkungen", type: "textarea" },
              ]}
            />
          </Suspense>
        </div>
      </section>
      <JsonLd
        data={[
          serviceLd({
            name: "Bus für Klassenfahrten in Hannover",
            description: "Reisebusse mit Fahrer für Klassenfahrten, Schülerreisen, Abschlussfahrten und Kita-Ausflüge.",
            path: "/klassenfahrten",
            serviceType: "Schülerbeförderung / Klassenfahrt",
          }),
          faqLd(FAQ),
        ]}
      />
    </>
  );
}
