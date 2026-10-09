"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState, type FormEvent } from "react";
import { Icon } from "@/components/ui/Icon";
import { Logo } from "@/components/ui/Logo";
import { cmsSrc } from "@/components/ui/Pic";
import { BUS_LINKS, COMPANY_LINKS, SERVICE_LINKS } from "@/lib/nav";
import { SITE } from "@/lib/site";
import { lockScroll } from "@/motion/scroll";

export interface HeaderData {
  categories: { slug: string; label: string; count: number }[];
  featured?: { slug: string; title: string; date: string; price: string; image?: string };
  tripCount: number;
}

type MenuKey = "reisen" | "bus" | "service" | "firma" | null;

const TOP: { key: Exclude<MenuKey, null> | null; label: string; href: string }[] = [
  { key: "reisen", label: "Reisen", href: "/reisen" },
  { key: "bus", label: "Bus mieten", href: "/busvermietung" },
  { key: null, label: "Fuhrpark", href: "/fuhrpark" },
  { key: null, label: "Gruppen", href: "/gruppenreisen" },
  { key: "service", label: "Service", href: "/reiseinfo" },
  { key: "firma", label: "Über uns", href: "/ueber-uns" },
  { key: null, label: "Kontakt", href: "/kontakt" },
];

function SearchBox({ onDone, autoFocus }: { onDone?: () => void; autoFocus?: boolean }) {
  const router = useRouter();
  const id = useId();
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const q = String(new FormData(e.currentTarget).get("q") ?? "").trim();
    router.push(q ? `/reisen?q=${encodeURIComponent(q)}` : "/reisen");
    onDone?.();
  };
  return (
    <form className="navsearch" role="search" onSubmit={submit} action="/reisen">
      <label htmlFor={id} className="sr-only">
        Reisen durchsuchen
      </label>
      <Icon name="search" />
      <input id={id} name="q" type="search" placeholder="Wohin möchten Sie? z. B. Leipzig" autoFocus={autoFocus} />
      <button type="submit" className="navsearch__go" aria-label="Suchen">
        <Icon name="arrow" />
      </button>
    </form>
  );
}

export function Header({ data }: { data: HeaderData }) {
  const pathname = usePathname();
  const [open, setOpen] = useState<MenuKey>(null);
  const [mobile, setMobile] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [dark, setDark] = useState(false);
  const closeTimer = useRef<number>(0);
  const headerRef = useRef<HTMLElement>(null);

  // Menüs bei Routenwechsel schließen
  const [prevPath, setPrevPath] = useState(pathname);
  if (prevPath !== pathname) {
    setPrevPath(pathname);
    setOpen(null);
    setMobile(false);
  }

  // Scrollzustand: solide Fläche, Ein-/Ausblenden
  useEffect(() => {
    let lastY = window.scrollY;
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const y = window.scrollY;
        setScrolled(y > 12);
        if (Math.abs(y - lastY) > 6) {
          setHidden(y > lastY && y > 420);
          lastY = y;
        }
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Dunkle Bühnen unter dem Header erkennen → helle Schrift
  useEffect(() => {
    const els = new Map<Element, boolean>();
    let io: IntersectionObserver | null = null;
    const bind = () => {
      io?.disconnect();
      els.clear();
      const h = headerRef.current?.offsetHeight ?? 72;
      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => els.set(e.target, e.isIntersecting));
          setDark([...els.entries()].some(([el, on]) => on && (el as HTMLElement).dataset.headerTheme === "dark"));
        },
        { rootMargin: `-${Math.round(h / 2)}px 0px -${Math.max(0, window.innerHeight - Math.round(h / 2) - 1)}px 0px` },
      );
      document.querySelectorAll("[data-header-theme]").forEach((el) => io!.observe(el));
    };
    const t = window.setTimeout(bind, 30);
    window.addEventListener("resize", bind);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("resize", bind);
      io?.disconnect();
    };
  }, [pathname]);

  useEffect(() => {
    lockScroll(mobile);
    document.documentElement.classList.toggle("menu-open", mobile);
  }, [mobile]);

  const onKey = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") {
      setOpen(null);
      setMobile(false);
    }
  }, []);
  useEffect(() => {
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onKey]);

  const enter = (k: MenuKey) => {
    window.clearTimeout(closeTimer.current);
    setOpen(k);
  };
  const leave = () => {
    closeTimer.current = window.setTimeout(() => setOpen(null), 160);
  };

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  const onDark = dark && !open;

  return (
    <>
      <header
        ref={headerRef}
        className={`site-header${scrolled ? " is-scrolled" : ""}${hidden && !open && !mobile ? " is-hidden" : ""}${onDark ? " is-dark" : ""}${open ? " is-open" : ""}`}
        onMouseLeave={leave}
      >
        <div className="site-header__bar container">
          <Link href="/" className="site-header__logo" aria-label="Scholkemper Reisen – Startseite">
            <Logo tone={onDark ? "light" : "color"} />
          </Link>

          <nav className="mainnav" aria-label="Hauptnavigation">
            <ul role="list">
              {TOP.map((item) => (
                <li key={item.label} onMouseEnter={() => (item.key ? enter(item.key) : enter(null))}>
                  {item.key ? (
                    <button
                      type="button"
                      className={`mainnav__link${isActive(item.href) ? " is-active" : ""}`}
                      aria-expanded={open === item.key}
                      aria-controls={`mega-${item.key}`}
                      onClick={() => setOpen(open === item.key ? null : item.key)}
                    >
                      {item.label}
                      <svg className="mainnav__caret" width="10" height="6" viewBox="0 0 10 6" aria-hidden="true">
                        <path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.6" />
                      </svg>
                    </button>
                  ) : (
                    <Link href={item.href} className={`mainnav__link${isActive(item.href) ? " is-active" : ""}`}>
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <div className="site-header__actions">
            <a className="site-header__phone" href={SITE.phone.href}>
              <Icon name="phone" size={18} />
              <span>{SITE.phone.display}</span>
            </a>
            <Link href="/reisen" className="btn btn--primary btn--sm site-header__cta" data-magnetic="0.2">
              <span>Reise finden</span>
            </Link>
            <button
              type="button"
              className="burger"
              aria-expanded={mobile}
              aria-controls="mobile-menu"
              onClick={() => setMobile((m) => !m)}
            >
              <span className="sr-only">{mobile ? "Menü schließen" : "Menü öffnen"}</span>
              <span className="burger__l" />
              <span className="burger__l" />
            </button>
          </div>
        </div>

        {/* Mega-Menüs */}
        <div className="mega" data-open={open ?? undefined} onMouseEnter={() => window.clearTimeout(closeTimer.current)}>
          <div id="mega-reisen" className="mega__panel" hidden={open !== "reisen"}>
            <div className="container mega__grid mega__grid--reisen">
              <div>
                <p className="mega__title">Reiseart</p>
                <ul role="list" className="mega__list">
                  {data.categories.map((c) => (
                    <li key={c.slug}>
                      <Link href={`/reisen/kategorie/${c.slug}`}>
                        <span>{c.label}</span>
                        <span className="mega__count num">{c.count}</span>
                      </Link>
                    </li>
                  ))}
                  <li>
                    <Link href="/reisen" className="mega__all">
                      <span>Alle Reisen</span>
                      <span className="mega__count num">{data.tripCount}</span>
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <p className="mega__title">Reisesuche</p>
                <SearchBox onDone={() => setOpen(null)} />
                <ul role="list" className="mega__links">
                  <li>
                    <Link href="/gruppenreisen">Gruppen- &amp; Vereinsreisen planen</Link>
                  </li>
                  <li>
                    <Link href="/reisekatalog">Reisekatalog ansehen</Link>
                  </li>
                  <li>
                    <Link href="/reiseinfo">Reise-Info A–Z</Link>
                  </li>
                </ul>
              </div>
              {data.featured ? (
                <Link href={`/reisen/${data.featured.slug}`} className="mega__feature">
                  {data.featured.image ? (
                    <span className="mega__feature-img">
                      <Image src={cmsSrc(data.featured.image)} alt="" fill sizes="360px" />
                    </span>
                  ) : null}
                  <span className="mega__feature-body">
                    <span className="label">Nächste Reise</span>
                    <span className="mega__feature-title">{data.featured.title}</span>
                    <span className="mega__feature-meta">
                      {data.featured.date} · {data.featured.price}
                    </span>
                  </span>
                </Link>
              ) : null}
            </div>
          </div>

          <div id="mega-bus" className="mega__panel" hidden={open !== "bus"}>
            <div className="container mega__grid mega__grid--bus">
              <ul role="list" className="mega__cards">
                {BUS_LINKS.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href}>
                      <span className="mega__card-title">{l.label}</span>
                      <span className="mega__card-desc">{l.desc}</span>
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="mega__aside">
                <p className="mega__title">Direkt anfragen</p>
                <p className="muted">Wir melden uns mit einem unverbindlichen Angebot.</p>
                <Link href="/busanfrage" className="btn btn--primary btn--sm">
                  <span>Bus anfragen</span>
                  <Icon name="arrow" className="btn__icon" />
                </Link>
                <a href={SITE.phone.href} className="mega__phone">
                  {SITE.phone.display}
                </a>
              </div>
            </div>
          </div>

          <div id="mega-service" className="mega__panel" hidden={open !== "service"}>
            <div className="container mega__grid mega__grid--simple">
              <ul role="list" className="mega__list mega__list--plain">
                {SERVICE_LINKS.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href}>{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div id="mega-firma" className="mega__panel" hidden={open !== "firma"}>
            <div className="container mega__grid mega__grid--simple">
              <ul role="list" className="mega__list mega__list--plain">
                {COMPANY_LINKS.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href}>{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </header>
      <div className={`mega-scrim${open ? " is-on" : ""}`} onClick={() => setOpen(null)} aria-hidden="true" />

      {/* Mobiles Menü */}
      <div id="mobile-menu" className={`mobile-menu${mobile ? " is-open" : ""}`} hidden={!mobile} data-native-scroll>
        <div className="mobile-menu__inner">
          <SearchBox onDone={() => setMobile(false)} />
          <nav aria-label="Mobile Navigation">
            <details className="mm-group" open>
              <summary>Reisen</summary>
              <ul role="list">
                <li>
                  <Link href="/reisen">Alle Reisen ({data.tripCount})</Link>
                </li>
                {data.categories.map((c) => (
                  <li key={c.slug}>
                    <Link href={`/reisen/kategorie/${c.slug}`}>{c.label}</Link>
                  </li>
                ))}
              </ul>
            </details>
            <details className="mm-group">
              <summary>Bus mieten</summary>
              <ul role="list">
                {BUS_LINKS.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href}>{l.label}</Link>
                  </li>
                ))}
              </ul>
            </details>
            <details className="mm-group">
              <summary>Service</summary>
              <ul role="list">
                {SERVICE_LINKS.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href}>{l.label}</Link>
                  </li>
                ))}
              </ul>
            </details>
            <details className="mm-group">
              <summary>Unternehmen</summary>
              <ul role="list">
                {COMPANY_LINKS.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href}>{l.label}</Link>
                  </li>
                ))}
              </ul>
            </details>
          </nav>
          <div className="mobile-menu__contact">
            <a href={SITE.phone.href} className="btn btn--light btn--block">
              <Icon name="phone" className="btn__icon" />
              <span>{SITE.phone.display}</span>
            </a>
            <a href={`mailto:${SITE.email}`} className="mobile-menu__mail">
              {SITE.email}
            </a>
            <p className="mobile-menu__hours">Büro: {SITE.hours.label}</p>
          </div>
        </div>
      </div>
    </>
  );
}
