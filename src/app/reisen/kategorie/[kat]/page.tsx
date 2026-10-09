import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { PageHero } from "@/components/layout/PageHero";
import { TripsView } from "@/components/reisen/TripsView";
import { getCatalog } from "@/lib/reisecms";
import snapshot from "@/data/reisen.snapshot.json";
import { pageMeta } from "@/lib/seo";

/** Texte je Reiseart – kurz, sachlich, ohne erfundene Details */
const COPY: Record<string, { title: string; lead: string; meta: string }> = {
  tagesfahrten: {
    title: "Tagesfahrten\nab Hannover.",
    lead: "Morgens los, abends zurück: Märkte, Städte, Ausflüge mit Programm. Zustieg in Ronnenberg-Empelde und Hannover.",
    meta: "Tagesfahrten mit dem Bus ab Hannover und Ronnenberg-Empelde: Weihnachtsmärkte, Märkte und Ausflüge – aktuelle Termine und Preise.",
  },
  mehrtagesfahrten: {
    title: "Mehrtages-\nfahrten.",
    lead: "Reisen mit Übernachtung – Bus, Hotel und Leistungen aus einer Hand.",
    meta: "Mehrtägige Busreisen ab Hannover mit Übernachtung – aktuelle Termine, Leistungen und Preise bei Scholkemper Reisen.",
  },
  weihnachtszeit: {
    title: "Reisen in der\nWeihnachtszeit.",
    lead: "Weihnachtsmärkte und Adventsfahrten mit dem Bus – entspannt hin und zurück.",
    meta: "Busfahrten zu Weihnachtsmärkten und Adventsausflüge ab Hannover – aktuelle Termine der Weihnachtszeit.",
  },
  gruppenreise: {
    title: "Reisen für\nGruppen.",
    lead: "Ausflüge, die sich für Gruppen eignen. Für eine eigene Gruppenreise nach Ihren Wünschen sprechen Sie uns an.",
    meta: "Busreisen, die sich für Gruppen eignen – ab Hannover. Individuelle Gruppen- und Vereinsreisen auf Anfrage.",
  },
  polenmarkt: {
    title: "Polenmarkt\nSlubice.",
    lead: "Tagesfahrt zum Markt in Slubice – Termine und Preise.",
    meta: "Busfahrt zum Polenmarkt Slubice ab Hannover – aktuelle Termine und Preise bei Scholkemper Reisen.",
  },
};

export async function generateStaticParams() {
  const cats = (snapshot as { categories: { slug: string; kind: string }[] }).categories.filter((c) => c.kind === "reiseart");
  return cats.length ? cats.map((c) => ({ kat: c.slug })) : [{ kat: "tagesfahrten" }];
}

export async function generateMetadata({ params }: PageProps<"/reisen/kategorie/[kat]">): Promise<Metadata> {
  const { kat } = await params;
  const cat = (await getCatalog()).categories.find((c) => c.slug === kat && c.kind === "reiseart");
  if (!cat) return { title: "Reiseart nicht gefunden", robots: { index: false } };
  const copy = COPY[kat];
  return pageMeta({
    title: `${cat.label} – Busreisen ab Hannover`,
    description: copy?.meta ?? `${cat.label}: aktuelle Busreisen von Scholkemper Reisen ab Ronnenberg-Empelde und Hannover.`,
    path: `/reisen/kategorie/${kat}`,
  });
}

async function Content({ params }: { params: Promise<{ kat: string }> }) {
  const { kat } = await params;
  const catalog = await getCatalog();
  const cat = catalog.categories.find((c) => c.slug === kat && c.kind === "reiseart");
  if (!cat) notFound();
  const copy = COPY[kat];
  return (
    <>
      <PageHero
        eyebrow="Reiseart"
        title={copy?.title ?? cat.label}
        crumbs={[
          { name: "Reisen", path: "/reisen" },
          { name: cat.label, path: `/reisen/kategorie/${kat}` },
        ]}
        lead={<p>{copy?.lead ?? `Aktuelle Reisen: ${cat.label}.`}</p>}
      />
      <section className="section section--tight reisen-list">
        <div className="container">
          <TripsView fixedArt={kat} />
        </div>
      </section>
    </>
  );
}

export default function KategoriePage(props: PageProps<"/reisen/kategorie/[kat]">) {
  return (
    <Suspense fallback={<div className="page-loading" />}>
      <Content params={props.params} />
    </Suspense>
  );
}
