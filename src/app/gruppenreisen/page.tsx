import type { Metadata } from "next";
import { Suspense } from "react";
import { InquiryForm } from "@/components/forms/InquiryForm";
import { PageHero } from "@/components/layout/PageHero";
import { TripCard, toCard } from "@/components/reisen/TripCard";
import { FeatureGrid, SectionHead, Split } from "@/components/ui/Blocks";
import { ButtonLink } from "@/components/ui/Button";
import { getCatalog } from "@/lib/reisecms";
import { JsonLd, pageMeta, serviceLd } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Gruppenreisen & Vereinsreisen ab Hannover",
  description:
    "Gruppen- und Vereinsreisen ab Hannover: Vereinsausflug, Betriebsausflug, Jahrgangsfahrt oder Seniorengruppe – Bus, Hotel und Programm nach Ihren Wünschen geplant.",
  path: "/gruppenreisen",
  image: "/img/galerie/eurodeaf/03.jpg",
});

async function GroupTrips() {
  const catalog = await getCatalog();
  const trips = catalog.trips.filter((t) => t.categories.includes("gruppenreise")).map((t) => toCard(t, catalog.categories));
  if (!trips.length) return null;
  return (
    <section className="section section--soft">
      <div className="container">
        <SectionHead eyebrow="Aus dem Programm" title="Geeignet für Gruppen." />
        <div className="tgrid">
          {trips.map((t) => (
            <TripCard key={t.slug} t={t} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function GruppenreisenPage() {
  return (
    <>
      <PageHero
        eyebrow="Gruppen & Vereine"
        title={"Ihre Gruppe.\nIhr Plan."}
        crumbs={[{ name: "Gruppenreisen", path: "/gruppenreisen" }]}
        image="/img/galerie/eurodeaf/03.jpg"
        imageAlt="Eine Mannschaft vor einem Scholkemper-Reisebus"
        lead={<p>Gern arbeiten wir Ihre persönliche Gruppen- oder Vereinsreise nach Ihren Wünschen aus – vom Bus über die Hotelbuchung bis zum Rahmenprogramm.</p>}
      >
        <ButtonLink href="#planen" variant="primary" icon="arrowDown">
          Gruppenreise planen
        </ButtonLink>
      </PageHero>

      <section className="section">
        <div className="container">
          <SectionHead eyebrow="Für wen" title={"Für alle, die\ngemeinsam fahren."} split lead={<p>Vereins- oder Jahrgangsausflug, Betriebsausflug, Messe- oder Flughafentransfer, Incentive-Reise: Sie sagen uns, was Sie vorhaben.</p>} />
          <FeatureGrid
            cols={3}
            items={[
              { icon: "users", title: "Vereine & Clubs", text: "Vereinsfahrt, Clubausflug, Mannschaftsfahrt." },
              { icon: "grid", title: "Betriebe", text: "Betriebsausflug, Incentive, Weihnachtsfeier mit Fahrt." },
              { icon: "coffee", title: "Seniorengruppen", text: "Entspannte Tagesfahrten mit Mittagessen und Kaffee." },
              { icon: "shield", title: "Schulen", text: "Klassenfahrten und Ausflüge – sicher geplant.", },
              { icon: "sparkle", title: "Private Gruppen", text: "Geburtstag, Jubiläum, Familientreffen." },
              { icon: "calendar", title: "Jahrgänge", text: "Jahrgangstreffen und Wiedersehensfahrten." },
            ]}
          />
        </div>
      </section>

      <section className="section">
        <div className="container stack" style={{ ["--stack" as string]: "clamp(4rem,8vw,8rem)" }}>
          <Split image="/img/galerie/wintertraum-2015/01.jpg" alt="Scholkemper-Reisebus auf einer Harzrundfahrt im Schnee" caption="Wintertraum – Harzrundfahrt">
            <p className="eyebrow">Alles aus einer Hand</p>
            <h2 className="h3">Bus, Hotel, Programm.</h2>
            <p>Wir übernehmen die Busfahrt, buchen Hotels und stellen das Rahmenprogramm zusammen. Sie haben einen Ansprechpartner für die ganze Reise.</p>
          </Split>
          <Split image="/img/galerie/erlebnistag-2022/01.jpg" alt="Reisegruppe am Scholkemper-Bus beim Erlebnistag" reverse>
            <p className="eyebrow">Vorteile für Gruppen</p>
            <h2 className="h3">Gemeinsam fahren – Geld sparen.</h2>
            <p>Bei gemeinsamer Buchung direkt bei uns gilt ein Gruppenrabatt. Für Gruppen bieten wir außerdem einen Zubringerdienst an – die Kosten werden mit dem Gruppenrabatt verrechnet.</p>
          </Split>
        </div>
      </section>

      <Suspense fallback={null}>
        <GroupTrips />
      </Suspense>

      <section className="section" id="planen">
        <div className="container form-layout">
          <div className="stack">
            <p className="eyebrow">Vereinsreise planen</p>
            <h2 className="h2">Erzählen Sie uns von Ihrer Reise.</h2>
            <p className="lead">Wir melden uns mit einem Vorschlag und Angebot.</p>
          </div>
          <Suspense fallback={null}>
            <InquiryForm
              type="gruppe"
              submitLabel="Reise anfragen"
              doneText="Danke! Wir arbeiten einen Vorschlag für Ihre Gruppe aus und melden uns."
              fields={[
                { name: "ziel", label: "Reiseziel", wide: true },
                { name: "abfahrt", label: "Abfahrt", type: "date" },
                { name: "rueckkehr", label: "Rückkehr", type: "date" },
                { name: "gruppenname", label: "Gruppenname / Verein" },
                { name: "personen", label: "Anzahl Personen", type: "number" },
                { name: "alter", label: "Alter der Teilnehmer" },
                { name: "unterkunft", label: "Unterkunft", type: "select", options: ["Keine (Tagesfahrt)", "Einfach", "Mittelklasse", "Gehoben", "Noch offen"] },
                { name: "name", label: "Name", autoComplete: "name" },
                { name: "strasse", label: "Straße, Nr.", autoComplete: "street-address" },
                { name: "ort", label: "PLZ, Ort", autoComplete: "postal-code" },
                { name: "email", label: "E-Mail", type: "email", autoComplete: "email" },
                { name: "telefon", label: "Telefon", type: "tel", autoComplete: "tel" },
                { name: "bemerkungen", label: "Bemerkungen", type: "textarea" },
              ]}
            />
          </Suspense>
        </div>
      </section>
      <JsonLd
        data={serviceLd({
          name: "Gruppen- und Vereinsreisen ab Hannover",
          description: "Individuell geplante Gruppen-, Vereins- und Betriebsreisen mit Bus, Hotel und Rahmenprogramm.",
          path: "/gruppenreisen",
          serviceType: "Gruppenreisen",
        })}
      />
    </>
  );
}
