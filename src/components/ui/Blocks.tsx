import type { ReactNode } from "react";
import { ButtonLink } from "./Button";
import { Icon, type IconName } from "./Icon";
import { Pic } from "./Pic";
import { SplitText } from "./SplitText";
import { SITE } from "@/lib/site";

export function SectionHead({ eyebrow, title, lead, split = false }: { eyebrow?: string; title: string; lead?: ReactNode; split?: boolean }) {
  return (
    <div className={`section-head${split ? " section-head--split" : ""}`}>
      <div>
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h2 className="h2">
          <SplitText text={title} />
        </h2>
      </div>
      {lead ? (
        <div className="lead" data-reveal="up">
          {lead}
        </div>
      ) : null}
    </div>
  );
}

export function FeatureGrid({ items, cols = 3 }: { items: { icon?: IconName; title: string; text: ReactNode }[]; cols?: 2 | 3 | 4 }) {
  return (
    <ul className={`fgrid fgrid--${cols}`} role="list">
      {items.map((it, i) => (
        <li key={it.title} className="fgrid__item" data-reveal="up" style={{ ["--rv-delay" as string]: `${(i % cols) * 80}ms` }}>
          {it.icon ? <Icon name={it.icon} size={26} className="fgrid__icon" /> : null}
          <h3 className="h4">{it.title}</h3>
          <div className="fgrid__text">{it.text}</div>
        </li>
      ))}
    </ul>
  );
}

export function Split({
  image,
  alt,
  children,
  reverse = false,
  caption,
}: {
  image: string;
  alt: string;
  children: ReactNode;
  reverse?: boolean;
  caption?: string;
}) {
  return (
    <div className={`split-block${reverse ? " split-block--rev" : ""}`}>
      <figure className="split-block__img" data-reveal="image" style={{ ["--img-radius" as string]: "24px" }}>
        <Pic src={image} alt={alt} sizes="(min-width: 900px) 48vw, 100vw" />
        {caption ? <figcaption>{caption}</figcaption> : null}
      </figure>
      <div className="split-block__body stack">{children}</div>
    </div>
  );
}

export function Steps({ items }: { items: { title: string; text: string }[] }) {
  return (
    <ol className="steps" role="list">
      {items.map((s, i) => (
        <li key={s.title} data-reveal="up" style={{ ["--rv-delay" as string]: `${i * 90}ms` }}>
          <span className="steps__n num">{String(i + 1).padStart(2, "0")}</span>
          <h3 className="h4">{s.title}</h3>
          <p>{s.text}</p>
        </li>
      ))}
    </ol>
  );
}

export function FaqList({ items }: { items: { q: string; a: ReactNode }[] }) {
  return (
    <div className="faq">
      {items.map((it) => (
        <details key={it.q} className="faq__item">
          <summary>
            <span>{it.q}</span>
            <Icon name="plus" className="faq__icon" />
          </summary>
          <div className="faq__a">{it.a}</div>
        </details>
      ))}
    </div>
  );
}

export function CtaBand({
  title = "Bus anfragen.",
  text = "Sagen Sie uns Ziel, Datum und Gruppengröße – Sie erhalten ein unverbindliches Angebot.",
  href = "/busanfrage",
  label = "Angebot anfragen",
}: {
  title?: string;
  text?: string;
  href?: string;
  label?: string;
}) {
  return (
    <section className="ctaband">
      <div className="container ctaband__inner">
        <div>
          <h2 className="h2">
            <SplitText text={title} />
          </h2>
          <p className="ctaband__text" data-reveal="up">
            {text}
          </p>
        </div>
        <div className="ctaband__actions" data-reveal="up">
          <ButtonLink href={href} variant="light" cursor="Start">
            {label}
          </ButtonLink>
          <a href={SITE.phone.href} className="ctaband__phone">
            <Icon name="phone" /> {SITE.phone.display}
          </a>
          <span className="ctaband__hours">Büro {SITE.hours.label}</span>
        </div>
      </div>
    </section>
  );
}

export function LegalNote() {
  if (process.env.NEXT_PUBLIC_LEGAL_REVIEW === "done") return null;
  return (
    <p className="legal-note" role="note">
      Hinweis: Dieser Text wurde unverändert von der bisherigen Website übernommen. Durch den Relaunch geänderte technische Angaben
      (Hosting, Formularversand, Cookies) werden vor Veröffentlichung rechtlich geprüft und ergänzt.
    </p>
  );
}
