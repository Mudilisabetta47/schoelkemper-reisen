import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/layout/PageHero";
import { CtaBand } from "@/components/ui/Blocks";
import { REISE_INFO } from "@/data/company";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Reise-Info von A bis Z",
  description: "Abfahrtszeiten, Gepäck, Sitzplätze, Gruppenrabatt, Notruf, Pkw-Stellplätze und mehr – alle Informationen zu Busreisen mit Scholkemper Reisen.",
  path: "/reiseinfo",
});

export default function ReiseInfoPage() {
  const letters = [...new Set(REISE_INFO.map((r) => r.term[0].toUpperCase()))];
  return (
    <>
      <PageHero
        eyebrow="Service"
        title={"Reise-Info\nvon A bis Z."}
        crumbs={[{ name: "Reise-Info", path: "/reiseinfo" }]}
        lead={<p>Allgemeine Informationen zu unseren Reisen. Was für eine bestimmte Reise gilt, steht in der jeweiligen Reisebeschreibung.</p>}
      />
      <section className="section section--tight">
        <div className="container abc">
          <nav className="abc__nav" aria-label="Buchstaben">
            {letters.map((l) => (
              <a key={l} href={`#abc-${l}`}>
                {l}
              </a>
            ))}
          </nav>
          <dl className="abc__list">
            {REISE_INFO.map((r, i) => {
              const first = i === REISE_INFO.findIndex((x) => x.term[0] === r.term[0]);
              return (
                <div key={r.term} id={first ? `abc-${r.term[0].toUpperCase()}` : undefined} className="abc__item">
                  <dt>{r.term}</dt>
                  <dd>
                    {r.text}
                    {r.href ? (
                      <>
                        {" "}
                        <Link href={r.href}>Mehr</Link>
                      </>
                    ) : null}
                  </dd>
                </div>
              );
            })}
          </dl>
        </div>
      </section>
      <CtaBand title="Noch Fragen?" text="Wir beraten Sie gern telefonisch." href="/kontakt" label="Kontakt" />
    </>
  );
}
