import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FEATURE_ICON } from "@/data/fleet-icons";
import { Breadcrumbs } from "@/components/layout/PageHero";
import { CtaBand } from "@/components/ui/Blocks";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Pic } from "@/components/ui/Pic";
import { SplitText } from "@/components/ui/SplitText";
import { FLEET, getBus } from "@/data/fleet";
import { JsonLd, abs, pageMeta } from "@/lib/seo";

export function generateStaticParams() {
  return FLEET.map((b) => ({ bus: b.slug }));
}

export async function generateMetadata({ params }: PageProps<"/fuhrpark/[bus]">): Promise<Metadata> {
  const { bus } = await params;
  const b = getBus(bus);
  if (!b) return {};
  return pageMeta({
    title: `${b.name} ${b.type} – ${b.seatsLabel}`,
    description: `${b.name} (${b.type}, ${b.emission}) mit ${b.seatsLabel} mieten – Ausstattung: ${b.sourceText}. Busvermietung mit Fahrer ab Hannover.`.slice(0, 158),
    path: `/fuhrpark/${b.slug}`,
    image: b.images[0]?.src,
  });
}

export default async function BusPage({ params }: PageProps<"/fuhrpark/[bus]">) {
  const { bus } = await params;
  const b = getBus(bus);
  if (!b) notFound();
  const others = FLEET.filter((x) => x.slug !== b.slug).slice(0, 3);
  return (
    <>
      <section className={`bus-hero${b.images[0] ? " on-dark" : ""}`} data-header-theme={b.images[0] ? "dark" : undefined}>
        {b.images[0] ? (
          <div className="bus-hero__media" data-reveal="scale">
            <Pic src={b.images[0].src} alt={b.images[0].alt} fill sizes="100vw" preload quality={80} />
          </div>
        ) : null}
        <div className="container bus-hero__inner">
          <Breadcrumbs
            tone={b.images[0] ? "light" : "dark"}
            items={[
              { name: "Fuhrpark", path: "/fuhrpark" },
              { name: `${b.name} ${b.seats}`, path: `/fuhrpark/${b.slug}` },
            ]}
          />
          <p className="eyebrow">
            {b.type} · {b.emission}
            {b.since ? ` · ${b.since}` : ""}
          </p>
          <h1 className="h1">
            <SplitText text={b.name} />
          </h1>
          <p className="bus-hero__seats num">
            {b.seats}
            {b.standing ? <small> + {b.standing}</small> : null} <span>{b.standing ? "Sitz- + Stehplätze" : "Plätze"}</span>
          </p>
          <ButtonLink href={`/busanfrage?fahrzeug=${b.slug}`} variant="primary" cursor="Anfragen">
            Diesen Bus anfragen
          </ButtonLink>
        </div>
      </section>

      <section className="section">
        <div className="container grid-2">
          <div className="stack">
            <p className="eyebrow">Ausstattung</p>
            <h2 className="h3">An Bord.</h2>
            <ul className="feat-grid" role="list">
              {b.features.map((f) => (
                <li key={f.label}>
                  <Icon name={FEATURE_ICON[f.key]} size={24} />
                  <span>{f.label}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="stack">
            <p className="eyebrow">Einsatz</p>
            <h2 className="h3">{b.fit}.</h2>
            <dl className="infolist">
              <div>
                <dt>Fahrzeug</dt>
                <dd>
                  {b.make ? `${b.make} ` : ""}
                  {b.model}, {b.type}
                </dd>
              </div>
              <div>
                <dt>Plätze</dt>
                <dd>{b.seatsLabel}</dd>
              </div>
              {b.pitchCm ? (
                <div>
                  <dt>Sitzabstand</dt>
                  <dd>{b.pitchCm} cm</dd>
                </div>
              ) : null}
              <div>
                <dt>Abgasnorm</dt>
                <dd>{b.emission}</dd>
              </div>
            </dl>
            <p className="muted">Ausstattung laut Fahrzeugliste: {b.sourceText}.</p>
          </div>
        </div>
      </section>

      {b.images.length > 1 ? (
        <section className="section section--soft">
          <div className="container">
            <p className="eyebrow">Bilder</p>
            <div className="bus-gallery">
              {b.images.map((img, i) => (
                <figure key={img.src} className={i === 0 ? "is-wide" : ""} data-reveal="image">
                  <Pic src={img.src} alt={img.alt} sizes="(min-width: 900px) 45vw, 100vw" />
                </figure>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="section">
        <div className="container">
          <p className="eyebrow">Weitere Fahrzeuge</p>
          <ul className="fleet-mini fleet-mini--light" role="list">
            {others.map((o) => (
              <li key={o.slug}>
                <Link href={`/fuhrpark/${o.slug}`} className="fleet-mini__card">
                  <span className="fleet-mini__img">
                    {o.images[0] ? <Pic src={o.images[0].src} alt="" fill sizes="(min-width: 900px) 30vw, 80vw" /> : <Icon name="bus" size={42} />}
                  </span>
                  <span className="fleet-mini__seats num">{o.seatsLabel}</span>
                  <span className="fleet-mini__name">{o.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <CtaBand title={`${b.name} anfragen.`} href={`/busanfrage?fahrzeug=${b.slug}`} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BusOrCoach",
          name: `${b.name} ${b.type} – ${b.seatsLabel}`,
          description: b.sourceText,
          manufacturer: b.make ? { "@type": "Organization", name: b.make } : undefined,
          model: b.model,
          seatingCapacity: b.seats,
          image: b.images.map((i) => abs(i.src)),
          url: abs(`/fuhrpark/${b.slug}`),
        }}
      />
    </>
  );
}
