import type { Metadata } from "next";
import Link from "next/link";
import { FEATURE_ICON } from "@/data/fleet-icons";
import { PageHero } from "@/components/layout/PageHero";
import { CtaBand } from "@/components/ui/Blocks";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Pic } from "@/components/ui/Pic";
import { FLEET, FLEET_COMMON } from "@/data/fleet";
import { fleetLd, JsonLd, pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Fuhrpark – Reisebusse von 48 bis 80 Plätzen",
  description:
    "Unser Fuhrpark: Neoplan Skyliner Doppeldecker (76 und 80 Plätze), Neoplan Cityliner, Scania Touring und Linienbus – alle Euro 6, mit Klimaanlage und Sicherheitsgurten.",
  path: "/fuhrpark",
  image: "/img/fuhrpark/skyliner-76/aussen.jpg",
});

export default function FuhrparkPage() {
  return (
    <>
      <PageHero
        eyebrow="Fuhrpark"
        title={"Unsere\nBusse."}
        crumbs={[{ name: "Fuhrpark", path: "/fuhrpark" }]}
        image="/img/bus/flotte-reihe.jpg"
        imageAlt="Reihe von Scholkemper-Reisebussen"
        lead={<p>Doppeldecker, Cityliner, Scania Touring und Linienbus – gewartet in unserer eigenen Werkstatt, alle Euro 6.</p>}
      >
        <ButtonLink href="/busanfrage" variant="primary">
          Bus anfragen
        </ButtonLink>
      </PageHero>

      <section className="section">
        <div className="container fleet-list">
          {FLEET.map((b, i) => (
            <article key={b.slug} className={`fleet-row${i % 2 ? " fleet-row--rev" : ""}`}>
              <Link href={`/fuhrpark/${b.slug}`} className="fleet-row__img" data-reveal="image" data-cursor="view" data-cursor-label="Details" style={{ ["--img-radius" as string]: "24px" }}>
                {b.images[0] ? (
                  <Pic src={b.images[0].src} alt={b.images[0].alt} fill sizes="(min-width: 900px) 55vw, 100vw" />
                ) : (
                  <span className="fleet-row__noimg">
                    <Icon name="bus" size={64} />
                    <span>Foto folgt</span>
                  </span>
                )}
              </Link>
              <div className="fleet-row__body">
                <p className="fleet-row__seats num" data-reveal="up">
                  {b.seats}
                  {b.standing ? <small> + {b.standing}</small> : null}
                </p>
                <p className="label muted">{b.standing ? "Sitz- + Stehplätze" : "Plätze"}</p>
                <h2 className="h3">{b.name}</h2>
                <p className="muted">
                  {b.type} · {b.emission}
                  {b.since ? ` · ${b.since}` : ""}
                </p>
                <ul className="feat-list" role="list">
                  {b.features.map((f) => (
                    <li key={f.label}>
                      <Icon name={FEATURE_ICON[f.key]} size={18} /> {f.label}
                    </li>
                  ))}
                </ul>
                <div className="fleet-row__ctas">
                  <ButtonLink href={`/busanfrage?fahrzeug=${b.slug}`} variant="primary" size="sm">
                    Diesen Bus anfragen
                  </ButtonLink>
                  <Link href={`/fuhrpark/${b.slug}`} className="link-arrow">
                    <span>Details</span>
                    <Icon name="arrow" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section section--sand">
        <div className="container grid-2">
          <div className="stack">
            <p className="eyebrow">Alle Fahrzeuge</p>
            <h2 className="h3">Grundausstattung.</h2>
            <ul className="checklist" role="list">
              {FLEET_COMMON.map((x) => (
                <li key={x}>
                  <Icon name="check" size={18} /> {x}
                </li>
              ))}
            </ul>
          </div>
          <div className="stack">
            <p className="eyebrow">Pflege &amp; Wartung</p>
            <h2 className="h3">Eigene Werkstatt.</h2>
            <p>
              Wartung und Pflege übernehmen wir in unserer betriebseigenen Werkstatt, größere Reparaturen ausschließlich in Vertragswerkstätten. Alle 3
              Monate durchläuft jedes Fahrzeug einen intensiven Sicherheitscheck (SP-Prüfung), einmal im Jahr die Hauptuntersuchung bei TÜV oder DEKRA.
              Gereinigt und desinfiziert wird täglich – bei Bedarf mehrmals.
            </p>
          </div>
        </div>
      </section>
      <CtaBand />
      <JsonLd data={fleetLd()} />
    </>
  );
}
