import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Pic } from "@/components/ui/Pic";
import { SplitText } from "@/components/ui/SplitText";
import galerie from "@/data/galerie.json";
import { SITE } from "@/lib/site";

const OCCASIONS: { label: string; href: string; note: string }[] = [
  { label: "Gruppen", href: "/gruppenreisen", note: "Ausflüge & Reisen" },
  { label: "Vereine", href: "/gruppenreisen", note: "Vereins- & Jahrgangsfahrten" },
  { label: "Unternehmen", href: "/gruppenreisen", note: "Betriebsausflüge, Incentives" },
  { label: "Messen", href: "/shuttle-transfer", note: "Messe-Shuttle" },
  { label: "Flughafen", href: "/shuttle-transfer", note: "Flughafen-Shuttle" },
  { label: "Schulklassen", href: "/klassenfahrten", note: "Klassenfahrten & Kita-Ausflüge" },
  { label: "Transfers", href: "/shuttle-transfer", note: "Zubringer & Transfers" },
  { label: "Events", href: "/shuttle-transfer", note: "Sport & Veranstaltungen" },
];

/** 04 BUS CHARTER */
export function CharterSection() {
  return (
    <section className="section charter" aria-labelledby="charter-title">
      <div className="container charter__grid">
        <div className="charter__lead">
          <p className="eyebrow">Bus Charter</p>
          <h2 id="charter-title" className="h2">
            <SplitText text={"Der richtige Bus\nfür Ihre Reise."} accent={["Bus"]} />
          </h2>
          <p className="lead" data-reveal="up">
            Reisebus mit Fahrer, von 48 bis 80 Plätzen. Sie sagen uns, wohin – wir planen die Fahrt und fahren sie.
          </p>
          <figure className="charter__img" data-reveal="image" style={{ ["--img-radius" as string]: "24px" }}>
            <Pic
              src="/img/bus/betriebshof-reihe.jpg"
              alt="Reihe von Scholkemper-Reisebussen am Betriebshof"
              sizes="(min-width: 900px) 45vw, 100vw"
            />
          </figure>
        </div>
        <div className="charter__list">
          <ul role="list" className="occasions">
            {OCCASIONS.map((o, i) => (
              <li key={o.label} data-reveal="up" style={{ ["--rv-delay" as string]: `${i * 50}ms` }}>
                <Link href={o.href}>
                  <span className="occasions__n num">{String(i + 1).padStart(2, "0")}</span>
                  <span className="occasions__l">{o.label}</span>
                  <span className="occasions__note">{o.note}</span>
                  <Icon name="arrow" className="occasions__arrow" />
                </Link>
              </li>
            ))}
          </ul>
          <div className="charter__ctas" data-reveal="up">
            <ButtonLink href="/busanfrage" variant="primary" cursor="Anfragen">
              Bus anfragen
            </ButtonLink>
            <ButtonLink href="/busvermietung" variant="outline">
              Busvermietung
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}

/** 07 GRUPPEN & VEREINE */
export function GroupsSection() {
  return (
    <section className="section groups" aria-labelledby="groups-title">
      <div className="container groups__grid">
        <div className="groups__collage" aria-hidden="true">
          <figure className="groups__img groups__img--a" data-reveal="image">
            <Pic src="/img/galerie/eurodeaf/03.jpg" alt="" sizes="(min-width: 900px) 34vw, 70vw" />
          </figure>
          <figure className="groups__img groups__img--b" data-reveal="image" style={{ ["--rv-delay" as string]: "150ms" }}>
            <Pic src="/img/galerie/wintertraum-2015/01.jpg" alt="" sizes="(min-width: 900px) 26vw, 60vw" />
          </figure>
          <figure className="groups__img groups__img--c" data-reveal="image" style={{ ["--rv-delay" as string]: "300ms" }}>
            <Pic src="/img/galerie/erlebnistag-2022/01.jpg" alt="" sizes="(min-width: 900px) 22vw, 50vw" />
          </figure>
        </div>
        <div className="groups__copy">
          <p className="eyebrow">Gruppen &amp; Vereine</p>
          <h2 id="groups-title" className="h2">
            <SplitText text={"Ihre Gruppe.\nIhr Plan."} />
          </h2>
          <p className="lead" data-reveal="up">
            Vereinsausflug, Betriebsfahrt, Jahrgangstreffen oder Seniorengruppe: Wir arbeiten Ihre Reise nach Ihren Wünschen aus – Bus,
            Hotel und Programm aus einer Hand.
          </p>
          <ul className="tags" role="list" data-reveal="stagger">
            {["Vereine", "Betriebe", "Clubs", "Seniorengruppen", "Schulen", "Private Gruppen"].map((t, i) => (
              <li key={t} style={{ ["--i" as string]: i }}>
                {t}
              </li>
            ))}
          </ul>
          <p className="groups__fact" data-reveal="up">
            <Icon name="users" /> Gruppenrabatt bei gemeinsamer Buchung direkt bei uns. Für Gruppen gibt es außerdem einen Zubringerdienst.
          </p>
          <div data-reveal="up">
            <ButtonLink href="/gruppenreisen" variant="primary">
              Gruppenreise planen
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}

const SHUTTLES: { icon: IconName; t: string; d: string; img: string }[] = [
  {
    icon: "grid",
    t: "Messe-Shuttle",
    d: "Pendelverkehr zwischen Hotel, Bahnhof und Messegelände – planbar für Aussteller und Besucher.",
    img: "/img/galerie/abf-2011/02.jpg",
  },
  {
    icon: "globe",
    t: "Flughafen-Shuttle",
    d: "Gruppen pünktlich zum Abflug und zurück, mit Platz für das Gepäck.",
    img: "/img/galerie/atletico/04.jpg",
  },
  {
    icon: "sparkle",
    t: "Sport & Events",
    d: "Mannschaften, Fans und Gäste – etwa für Atlético Madrid beim Europa-League-Spiel in Hannover.",
    img: "/img/galerie/atletico/01.jpg",
  },
  {
    icon: "pin",
    t: "Transfers & Zubringer",
    d: "Hotel, Bahnhof, Veranstaltungsort: kurze Wege, feste Zeiten, ein Ansprechpartner.",
    img: "/img/galerie/eurodeaf/05.jpg",
  },
];

/** 08 SHUTTLE / TRANSFER */
export function ShuttleSection() {
  return (
    <section className="section section--sand shuttle" aria-labelledby="shuttle-title">
      <div className="container">
        <div className="section-head section-head--split">
          <div>
            <p className="eyebrow">Shuttle &amp; Transfer</p>
            <h2 id="shuttle-title" className="h2">
              <SplitText text={"Hin. Zurück.\nPünktlich."} />
            </h2>
          </div>
          <p className="lead" data-reveal="up">
            Shuttle- und Transferdienste für Messen, Flughafen, Sport und Veranstaltungen in Hannover und der Region.
          </p>
        </div>
        <ul className="shuttle__grid" role="list">
          {SHUTTLES.map((s, i) => (
            <li key={s.t} className="shuttle__card" data-reveal="up" style={{ ["--rv-delay" as string]: `${i * 80}ms` }}>
              <div className="shuttle__img">
                <Pic src={s.img} alt="" fill sizes="(min-width: 1100px) 25vw, (min-width: 700px) 50vw, 100vw" />
              </div>
              <div className="shuttle__body">
                <Icon name={s.icon} size={22} />
                <h3 className="h4">{s.t}</h3>
                <p>{s.d}</p>
              </div>
            </li>
          ))}
        </ul>
        <div className="shuttle__cta" data-reveal="up">
          <ButtonLink href="/shuttle-transfer" variant="outline">
            Shuttle &amp; Transfer
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}

/** 09 WARUM SCHOLKEMPER – nur belegte Fakten */
export function WhySection() {
  const facts: { k: string; v: string; d: string }[] = [
    { k: "3", v: "Monate", d: "Abstand des Sicherheitschecks (SP-Prüfung) an allen Fahrzeugen." },
    { k: "48–80", v: "Plätze", d: "Vom Cityliner bis zum Doppeldecker – der Bus passt zur Gruppe." },
    { k: "24", v: "Stunden", d: "Notruf-Nummer während der Reise – rund um die Uhr erreichbar." },
    { k: "Eigene", v: "Werkstatt", d: "Wartung und Pflege im eigenen Betrieb, größere Reparaturen in Vertragswerkstätten." },
  ];
  return (
    <section className="section why" aria-labelledby="why-title">
      <div className="container why__grid">
        <div className="why__media" data-reveal="image" style={{ ["--img-radius" as string]: "24px" }}>
          <Pic
            src="/img/bus/fahrsicherheitstraining-2025.jpg"
            alt="Scholkemper-Reisebus beim Fahrsicherheitstraining 2025"
            sizes="(min-width: 900px) 46vw, 100vw"
          />
          <span className="why__caption">Fahrsicherheitstraining 2025</span>
        </div>
        <div className="why__copy">
          <p className="eyebrow">Warum Scholkemper</p>
          <h2 id="why-title" className="h2">
            <SplitText text={"Familienbetrieb.\nMit eigener\nWerkstatt."} />
          </h2>
          <p className="lead" data-reveal="up">
            Erfahrene Fahrer, regelmäßige Sicherheitstrainings, jährliche Hauptuntersuchung bei TÜV oder DEKRA. Und ein Büro in Empelde, in
            dem Sie jemanden erreichen.
          </p>
          <dl className="why__facts">
            {facts.map((f, i) => (
              <div key={f.v} data-reveal="up" style={{ ["--rv-delay" as string]: `${i * 90}ms` }}>
                <dt>
                  <span className="num">{f.k}</span> {f.v}
                </dt>
                <dd>{f.d}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

type Album = { slug: string; title: string; intro: string; images: string[] };

/** 10 REISEINSPIRATION – echte Bilder vergangener Scholkemper-Reisen */
export function InspirationSection() {
  const pick: [string, number][] = [
    ["lido-de-jesolo-venedig", 4],
    ["keukenhof-tulpenbluete", 0],
    ["wintertraum-2015", 3],
    ["200908-tessin", 0],
    ["mosel", 2],
    ["costa-brava", 7],
    ["heidefahrt", 0],
  ];
  const albums = galerie as Album[];
  const items = pick
    .map(([slug, i]) => {
      const a = albums.find((x) => x.slug === slug);
      return a ? { src: a.images[Math.min(i, a.images.length - 1)], title: a.title, slug } : null;
    })
    .filter(Boolean) as { src: string; title: string; slug: string }[];
  return (
    <section className="section section--soft inspo" aria-labelledby="inspo-title">
      <div className="container">
        <div className="section-head section-head--split">
          <div>
            <p className="eyebrow">Reiseinspiration</p>
            <h2 id="inspo-title" className="h2">
              <SplitText text={"Unterwegs\nfotografiert."} />
            </h2>
          </div>
          <p className="lead" data-reveal="up">
            Venedig, Keukenhof, der Harz im Schnee, das Tessin: Bilder von Reisen, die wir gefahren sind.
          </p>
        </div>
        <ul className="inspo__grid" role="list">
          {items.map((it, i) => (
            <li key={it.slug} className={`inspo__item inspo__item--${i}`}>
              <Link href={`/galerie#${it.slug}`} data-cursor="view" data-cursor-label="Galerie">
                <figure data-reveal="image" style={{ ["--rv-delay" as string]: `${(i % 3) * 120}ms` }}>
                  <Pic src={it.src} alt={`${it.title} – Foto einer Scholkemper-Reise`} sizes="(min-width: 900px) 33vw, 50vw" />
                  <figcaption>{it.title}</figcaption>
                </figure>
              </Link>
            </li>
          ))}
        </ul>
        <div className="inspo__cta" data-reveal="up">
          <ButtonLink href="/galerie" variant="outline">
            Zur Bildergalerie
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}

/** 11 KONTAKT / BUS ANFRAGEN – Finale vor dem Footer */
export function FinaleSection() {
  return (
    <section className="finale" aria-labelledby="finale-title">
      <div className="container finale__grid">
        <div>
          <p className="eyebrow eyebrow--light">Bus anfragen</p>
          <h2 id="finale-title" className="display finale__title">
            <SplitText text={"Sagen Sie uns,\nwohin."} />
          </h2>
        </div>
        <div className="finale__side" data-reveal="up">
          <ol className="finale__steps" role="list">
            <li>
              <span className="num">01</span> Fahrt, Datum und Gruppengröße angeben
            </li>
            <li>
              <span className="num">02</span> Wir prüfen Fahrzeug und Route
            </li>
            <li>
              <span className="num">03</span> Sie erhalten ein unverbindliches Angebot
            </li>
          </ol>
          <div className="finale__ctas">
            <ButtonLink href="/busanfrage" variant="light" cursor="Start">
              Angebot anfragen
            </ButtonLink>
            <a href={SITE.phone.href} className="finale__phone">
              <Icon name="phone" /> {SITE.phone.display}
            </a>
          </div>
          <p className="finale__note">
            Büro {SITE.hours.label} · <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
          </p>
        </div>
      </div>
    </section>
  );
}
