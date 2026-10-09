import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { CtaBand, SectionHead, Split } from "@/components/ui/Blocks";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { getBus } from "@/data/fleet";
import { JsonLd, pageMeta, serviceLd } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Shuttle & Transfer in Hannover – Messe, Flughafen, Events",
  description:
    "Shuttlebus und Transfers in Hannover: Messe-Shuttle, Flughafen-Shuttle, Transfers für Sport und Events, Zubringer für Gruppen – mit Reisebussen von 48 bis 80 Plätzen.",
  path: "/shuttle-transfer",
  image: "/img/galerie/atletico/04.jpg",
});

export default function ShuttlePage() {
  const linienbus = getBus("linienbus");
  return (
    <>
      <PageHero
        eyebrow="Shuttle & Transfer"
        title={"Hin. Zurück.\nPünktlich."}
        crumbs={[{ name: "Shuttle & Transfer", path: "/shuttle-transfer" }]}
        image="/img/galerie/atletico/04.jpg"
        imageAlt="Scholkemper-Reisebus beim Transfer für Atlético Madrid in Hannover"
        lead={<p>Transfers und Shuttle-Dienste für Messen, Flughafen, Sport und Veranstaltungen – in Hannover und der Region.</p>}
      >
        <ButtonLink href="/busanfrage?anlass=Messe" variant="primary">
          Shuttle anfragen
        </ButtonLink>
      </PageHero>

      <section className="section">
        <div className="container stack" style={{ ["--stack" as string]: "clamp(4rem,8vw,8rem)" }}>
          <Split image="/img/galerie/abf-2011/02.jpg" alt="Scholkemper-Reisebus in einer Messehalle in Hannover" caption="Ausstellung auf der ABF Hannover">
            <p className="eyebrow">Messe-Shuttle</p>
            <h2 className="h3">Zwischen Hotel und Messe.</h2>
            <p>Hannover ist Messestadt. Wir fahren Aussteller, Besucher und Delegationen zwischen Hotel, Bahnhof und Messegelände – im Pendelverkehr oder zu festen Zeiten.</p>
            <ButtonLink href="/busanfrage?anlass=Messe" variant="outline" size="sm">
              Messe-Shuttle anfragen
            </ButtonLink>
          </Split>
          <Split image="/img/galerie/atletico/01.jpg" alt="Stadion beim Europa-League-Spiel Hannover 96 gegen Atlético Madrid" reverse caption="Hannover 96 – Atlético Madrid">
            <p className="eyebrow">Sport &amp; Events</p>
            <h2 className="h3">Mannschaft, Gäste, Fans.</h2>
            <p>
              Beim Europa-League-Spiel gegen Hannover 96 fuhren wir für Atlético Madrid die Mannschaft, den Vorstand, VIPs, Presse und Fans. Bei der
              EuroDeaf 2015 waren wir für die Mannschaften unterwegs.
            </p>
            <ButtonLink href="/busanfrage?anlass=Event%20%2F%20Sport" variant="outline" size="sm">
              Event-Transfer anfragen
            </ButtonLink>
          </Split>
          <Split image="/img/galerie/eurodeaf/02.jpg" alt="Scholkemper-Reisebus mit Mannschaft bei der EuroDeaf 2015">
            <p className="eyebrow">Flughafen &amp; Transfers</p>
            <h2 className="h3">Abholen. Bringen.</h2>
            <p>Flughafen-Shuttle für Gruppen, Hotel- und Veranstaltungstransfers, Zubringer zu Reisen und Feiern. Ein Ansprechpartner, feste Zeiten.</p>
            <ButtonLink href="/busanfrage?anlass=Flughafen" variant="outline" size="sm">
              Transfer anfragen
            </ButtonLink>
          </Split>
        </div>
      </section>

      {linienbus ? (
        <section className="section section--sand">
          <div className="container">
            <SectionHead eyebrow="Für kurze Strecken" title={"Linienbus mit\n81 Plätzen."} split lead={<p>{linienbus.seatsLabel}, Rampe und Klimaanlage – geeignet für Shuttle-Verkehre mit vielen Fahrgästen auf kurzen Strecken.</p>} />
            <p className="label">
              <Icon name="ramp" size={18} /> Rampe · <Icon name="wind" size={18} /> Klimaanlage · Euro 6
            </p>
          </div>
        </section>
      ) : null}
      <CtaBand title="Shuttle anfragen." />
      <JsonLd
        data={serviceLd({
          name: "Shuttle- und Transferdienste in Hannover",
          description: "Messe-Shuttle, Flughafen-Shuttle, Event- und Sporttransfers sowie Zubringer für Gruppen in Hannover und Region.",
          path: "/shuttle-transfer",
          serviceType: "Shuttle- und Transferdienst",
        })}
      />
    </>
  );
}
