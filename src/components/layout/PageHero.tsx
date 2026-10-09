import Link from "next/link";
import type { ReactNode } from "react";
import { Pic } from "@/components/ui/Pic";
import { SplitText } from "@/components/ui/SplitText";
import { breadcrumbLd, JsonLd } from "@/lib/seo";

export type Crumb = { name: string; path: string };

export function Breadcrumbs({ items, tone = "dark" }: { items: Crumb[]; tone?: "dark" | "light" }) {
  const all = [{ name: "Start", path: "/" }, ...items];
  return (
    <>
      <nav aria-label="Brotkrumen" className={`crumbs crumbs--${tone}`}>
        <ol role="list">
          {all.map((c, i) => (
            <li key={c.path + i}>
              {i < all.length - 1 ? <Link href={c.path}>{c.name}</Link> : <span aria-current="page">{c.name}</span>}
            </li>
          ))}
        </ol>
      </nav>
      <JsonLd data={breadcrumbLd(all)} />
    </>
  );
}

/**
 * Kopf der Unterseiten. Mit Bild: dunkle Bühne (Header hell), ohne Bild: helle Fläche.
 */
export function PageHero({
  eyebrow,
  title,
  lead,
  crumbs,
  image,
  imageAlt = "",
  children,
  size = "md",
  accent,
}: {
  eyebrow?: string;
  title: string;
  lead?: ReactNode;
  crumbs: Crumb[];
  image?: string;
  imageAlt?: string;
  children?: ReactNode;
  size?: "md" | "lg";
  accent?: string[];
}) {
  const dark = Boolean(image);
  return (
    <section
      className={`phero${dark ? " phero--image on-dark" : ""} phero--${size}`}
      data-header-theme={dark ? "dark" : undefined}
    >
      {image ? (
        <div className="phero__media" data-reveal="scale">
          <Pic src={image} alt={imageAlt} fill sizes="100vw" preload quality={80} />
        </div>
      ) : null}
      <div className="container phero__inner">
        <Breadcrumbs items={crumbs} tone={dark ? "light" : "dark"} />
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h1 className="h1 phero__title">
          <SplitText text={title} accent={accent} />
        </h1>
        {lead ? (
          <div className="lead phero__lead" data-reveal="up" style={{ ["--rv-delay" as string]: "250ms" }}>
            {lead}
          </div>
        ) : null}
        {children ? (
          <div className="phero__actions" data-reveal="up" style={{ ["--rv-delay" as string]: "380ms" }}>
            {children}
          </div>
        ) : null}
      </div>
    </section>
  );
}
