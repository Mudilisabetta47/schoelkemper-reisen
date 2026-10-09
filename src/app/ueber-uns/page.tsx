import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { CtaBand, SectionHead, Split } from "@/components/ui/Blocks";
import { ButtonLink } from "@/components/ui/Button";
import { Pic } from "@/components/ui/Pic";
import { TEAM } from "@/data/company";
import { pageMeta } from "@/lib/seo";
import { SITE } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "Über uns – Familienunternehmen aus Empelde",
  description:
    "Scholkemper Reisen GmbH: Familienunternehmen mit Reisebüro und Betriebshof in Ronnenberg-Empelde bei Hannover – Busreisen, Busvermietung und das Team.",
  path: "/ueber-uns",
  image: "/img/bus/betriebshof-reihe.jpg",
});

const MOMENTS = [
  { img: "/img/galerie/abf-2011/01.jpg", t: "ABF Hannover 2011", d: "Ausstellung von Scholkemper-Reisen auf der ABF in Hannover." },
  { img: "/img/galerie/atletico/02.jpg", t: "Hannover 96 – Atlético Madrid", d: "Wir fuhren Mannschaft, Vorstand, VIPs, Presse und Fans von Atlético Madrid beim Europa-League-Spiel." },
  { img: "/img/galerie/eurodeaf/05.jpg", t: "EuroDeaf 2015", d: "Fußball der Gehörlosen in Hannover – Scholkemper-Reisen hat die Mannschaften gefahren." },
  { img: "/img/galerie/hoffest/01.jpg", t: "5 Jahre Scholkemper-Reisen", d: "Hoffest am Betriebshof Empelde." },
  { img: "/img/bus/fahrsicherheitstraining-2025.jpg", t: "Fahrsicherheitstraining 2025", d: "Regelmäßige Sicherheitstrainings gehören für unsere Fahrer dazu." },
];

const initials = (n: string) =>
  n
    .replace(/[,.]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join("");

export default function UeberUnsPage() {
  return (
    <>
      <PageHero
        eyebrow="Über uns"
        title={"Familien-\nunternehmen."}
        crumbs={[{ name: "Über uns", path: "/ueber-uns" }]}
        image="/img/bus/betriebshof-reihe.jpg"
        imageAlt="Scholkemper-Reisebusse am Betriebshof in Empelde"
        lead={
          <p>
            Scholkemper Reisen GmbH ist ein Familienunternehmen aus Ronnenberg-Empelde. Unser Reisebüro und unser Betriebshof liegen an der
            Apollostraße – hier starten unsere Busse.
          </p>
        }
      />

      <section className="section">
        <div className="container">
          <Split image="/img/brand/slogan.jpg" alt="Scholkemper-Logo mit dem Satz: Für Ihre schönsten Tage des Jahres machen wir uns stark">
            <p className="eyebrow">Was wir machen</p>
            <h2 className="h3">Vom Bus bis zum Rahmenprogramm.</h2>
            <p>
              Wir bieten ein breites Spektrum an Reisedienstleistungen: Busanmietung, Hotelbuchung, Rahmenprogramme. Dazu Städte- und Studienreisen,
              Betriebs- und Vereinsausflüge, Transfers und Shuttle-Dienste.
            </p>
            <p className="serif" style={{ fontSize: "1.5rem" }}>
              „Wir wünschen Ihnen schöne Stunden und Tage, wenn Sie mit uns unterwegs sind.“
            </p>
            <p className="muted">– {SITE.managingDirector} und das Scholkemper-Team</p>
          </Split>
        </div>
      </section>

      <section className="section section--night on-dark" data-header-theme="dark">
        <div className="container">
          <SectionHead eyebrow="Momente" title={"Unterwegs\nseit Jahren."} />
          <ul className="moments" role="list" data-native-scroll>
            {MOMENTS.map((m) => (
              <li key={m.t} className="moment" data-reveal="up">
                <span className="moment__img">
                  <Pic src={m.img} alt={m.t} fill sizes="(min-width: 900px) 30vw, 80vw" />
                </span>
                <span className="moment__t">{m.t}</span>
                <span className="moment__d">{m.d}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section" id="team">
        <div className="container">
          <SectionHead eyebrow="Team" title={"Wir sind\nfür Sie da."} split lead={<p>Im Büro, in der Disposition, am Steuer und in der Fahrzeugpflege.</p>} />
          <ul className="team" role="list">
            {TEAM.map((m, i) => (
              <li key={m.name} className="team__item" data-reveal="up" style={{ ["--rv-delay" as string]: `${(i % 4) * 60}ms` }}>
                <span className="team__img">
                  {m.photo ? <Pic src={m.photo} alt={`Porträt: ${m.name}`} fill sizes="(min-width: 900px) 22vw, 45vw" /> : <span className="team__ini" aria-hidden="true">{initials(m.name)}</span>}
                </span>
                <span className="team__name">{m.name}</span>
                <span className="team__role">{m.role}</span>
              </li>
            ))}
          </ul>
          <div style={{ marginTop: "3rem" }}>
            <ButtonLink href="/jobs" variant="outline">
              Stellenangebote
            </ButtonLink>
          </div>
        </div>
      </section>
      <CtaBand title="Besuchen Sie uns." text={`${SITE.address.street}, ${SITE.address.zip} ${SITE.address.city}-${SITE.address.district} · Büro ${SITE.hours.label}`} href="/kontakt" label="Kontakt & Anfahrt" />
    </>
  );
}
