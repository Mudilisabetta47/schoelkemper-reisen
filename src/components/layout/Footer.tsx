import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { SplitText } from "@/components/ui/SplitText";
import { BUS_LINKS, COMPANY_LINKS, LEGAL_LINKS, SERVICE_LINKS } from "@/lib/nav";
import { SITE } from "@/lib/site";

export function Footer({ categories }: { categories: { slug: string; label: string }[] }) {
  return (
    <footer className="site-footer on-dark" data-header-theme="dark">
      <div className="container">
        <div className="site-footer__hero">
          <p className="eyebrow">Scholkemper Reisen</p>
          <SplitText as="p" className="display site-footer__headline" text={"Wohin geht\nIhre nächste Reise?"} />
          <div className="site-footer__ctas" data-reveal="up" style={{ ["--rv-delay" as string]: "200ms" }}>
            <ButtonLink href="/reisen" variant="primary" cursor="Los">
              Reise finden
            </ButtonLink>
            <ButtonLink href="/busanfrage" variant="ghost">
              Bus anfragen
            </ButtonLink>
          </div>
        </div>

        <div className="site-footer__grid">
          <div className="site-footer__col">
            <p className="site-footer__h">Reisen</p>
            <ul role="list">
              <li>
                <Link href="/reisen">Alle Reisen</Link>
              </li>
              {categories.map((c) => (
                <li key={c.slug}>
                  <Link href={`/reisen/kategorie/${c.slug}`}>{c.label}</Link>
                </li>
              ))}
              <li>
                <Link href="/reisekatalog">Reisekatalog</Link>
              </li>
            </ul>
          </div>
          <div className="site-footer__col">
            <p className="site-footer__h">Busvermietung</p>
            <ul role="list">
              {BUS_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="site-footer__col">
            <p className="site-footer__h">Service</p>
            <ul role="list">
              {SERVICE_LINKS.slice(0, 4).map((l) => (
                <li key={l.href}>
                  <Link href={l.href}>{l.label}</Link>
                </li>
              ))}
            </ul>
            <p className="site-footer__h">Unternehmen</p>
            <ul role="list">
              {COMPANY_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="site-footer__col site-footer__contact">
            <p className="site-footer__h">Kontakt</p>
            <address>
              {SITE.legalName}
              <br />
              {SITE.address.street}
              <br />
              {SITE.address.zip} {SITE.address.city}-{SITE.address.district}
            </address>
            <a className="site-footer__big" href={SITE.phone.href}>
              {SITE.phone.display}
            </a>
            <a className="site-footer__mail" href={`mailto:${SITE.email}`}>
              {SITE.email}
            </a>
            <p className="site-footer__note">Büro: {SITE.hours.label}</p>
            <p className="site-footer__note">
              Notruf unterwegs (24 h): <a href={SITE.emergency.href}>{SITE.emergency.display}</a>
            </p>
          </div>
        </div>

        <div className="site-footer__base">
          <Link href="/" aria-label="Startseite" className="site-footer__logo">
            <Logo tone="light" />
          </Link>
          <nav aria-label="Rechtliches">
            <ul role="list">
              {LEGAL_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
          <p className="site-footer__copy">
            © {SITE.legalName} · Reiseverwaltung mit reise-CMS<sup>®</sup>
          </p>
        </div>
      </div>
    </footer>
  );
}
