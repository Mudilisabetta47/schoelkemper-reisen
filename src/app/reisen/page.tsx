import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/layout/PageHero";
import { TripsView } from "@/components/reisen/TripsView";
import { getCatalog } from "@/lib/reisecms";
import { JsonLd, abs, pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Busreisen & Tagesfahrten ab Hannover",
  description:
    "Aktuelle Busreisen ab Hannover und Ronnenberg-Empelde: Tagesfahrten, Weihnachtsmärkte, Mehrtagesfahrten – mit Terminen, Preisen und Verfügbarkeit.",
  path: "/reisen",
});

export default async function ReisenPage() {
  const catalog = await getCatalog();
  const cats = catalog.categories.filter((c) => c.kind === "reiseart");
  return (
    <>
      <PageHero
        eyebrow="Reisen"
        title={"Busreisen\nab Hannover."}
        crumbs={[{ name: "Reisen", path: "/reisen" }]}
        lead={
          <p>
            Tagesfahrten, Weihnachtsmärkte und Mehrtagesreisen – mit Zustieg in Ronnenberg-Empelde und Hannover. Alle Termine kommen direkt aus
            unserem Buchungssystem.
          </p>
        }
      >
        <ul className="pills" role="list">
          {cats.map((c) => (
            <li key={c.slug}>
              <Link href={`/reisen/kategorie/${c.slug}`} className="pill">
                {c.label}
              </Link>
            </li>
          ))}
          <li>
            <Link href="/reisekatalog" className="pill pill--ghost">
              Reisekatalog
            </Link>
          </li>
        </ul>
      </PageHero>
      <section className="section section--tight reisen-list">
        <div className="container">
          <TripsView />
        </div>
      </section>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Aktuelle Busreisen",
          itemListElement: catalog.trips.map((t, i) => ({ "@type": "ListItem", position: i + 1, url: abs(`/reisen/${t.slug}`), name: t.title })),
        }}
      />
    </>
  );
}
