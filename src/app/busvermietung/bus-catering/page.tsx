import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { CtaBand, SectionHead } from "@/components/ui/Blocks";
import { Icon } from "@/components/ui/Icon";
import { CATERING } from "@/data/company";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Bus-Catering – Lunchpakete & Bordservice",
  description: "Lunchpakete, Imbiss und Getränke an Bord: Bus-Catering von Scholkemper Reisen für Ihre gemietete Busfahrt ab Hannover.",
  path: "/busvermietung/bus-catering",
  image: "/img/bus/bordkueche-buffet.jpg",
});

export default function CateringPage() {
  return (
    <>
      <PageHero
        eyebrow="Bus-Catering"
        title={"Unterwegs\ngut versorgt."}
        crumbs={[
          { name: "Busvermietung", path: "/busvermietung" },
          { name: "Bus-Catering", path: "/busvermietung/bus-catering" },
        ]}
        image="/img/bus/bordkueche-buffet.jpg"
        imageAlt="Bordküche mit Buffet in einem Scholkemper-Reisebus"
        lead={
          <p>
            Sie möchten Ihre Gäste während der Fahrt mit einem Imbiss versorgen? Zusammen mit unserem Catering-Service bieten wir Lunchpakete an –
            der Fahrer bringt sie zum Abfahrtsort mit.
          </p>
        }
      />
      <section className="section">
        <div className="container">
          <SectionHead eyebrow="Lunchpakete" title="Zur Auswahl." />
          <ul className="packages" role="list">
            {CATERING.packages.map((p, i) => (
              <li key={p.name} className="package" data-reveal="up" style={{ ["--rv-delay" as string]: `${(i % 3) * 80}ms` }}>
                <p className="package__name">{p.name}</p>
                <ul role="list">
                  {p.items.map((it) => (
                    <li key={it}>
                      <Icon name="check" size={16} /> {it}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section className="section section--sand">
        <div className="container grid-2">
          <div className="stack">
            <p className="eyebrow">Bordservice</p>
            <h2 className="h3">Immer an Bord.</h2>
            <p>Diese Getränke haben unsere Fahrer immer dabei:</p>
            <ul className="tags" role="list">
              {CATERING.onboard.map((g) => (
                <li key={g}>{g}</li>
              ))}
            </ul>
          </div>
          <div className="notice">
            <Icon name="clock" size={26} />
            <p>{CATERING.leadTime}</p>
          </div>
        </div>
      </section>
      <CtaBand title="Bus mit Catering anfragen." />
    </>
  );
}
