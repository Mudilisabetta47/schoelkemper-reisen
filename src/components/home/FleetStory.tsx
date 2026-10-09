"use client";

import Link from "next/link";
import { useRef } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Pic } from "@/components/ui/Pic";
import { SplitText } from "@/components/ui/SplitText";
import type { Bus } from "@/data/fleet";
import { FEATURE_ICON } from "@/data/fleet-icons";
import { range } from "@/motion/env";
import { useTimeline } from "@/motion/react";


/**
 * 06 FUHRPARK – Sticky-Bühne. Pro Fahrzeug ein Abschnitt der Scrollstrecke:
 * Bild fährt per Maske ein, Daten wechseln. Mobil: horizontale Swipe-Karten.
 */
export function FleetStory({ buses }: { buses: Bus[] }) {
  const track = useRef<HTMLElement>(null);
  const last = useRef(-1);
  const frames = useRef<HTMLElement[]>([]);

  useTimeline(track, { start: "top top", end: "bottom bottom" }, (p, el) => {
    if (!frames.current.length) frames.current = [...el.querySelectorAll<HTMLElement>(".fleet__frame")];
    const n = buses.length;
    const x = p * n;
    const idx = Math.min(n - 1, Math.floor(x));
    if (idx !== last.current) {
      last.current = idx;
      el.dataset.active = String(idx);
    }
    el.style.setProperty("--fleet-p", String(p));
    // Maske des jeweils nächsten Bildes
    frames.current.forEach((f, i) => {
      const local = range(x, i - 0.35, i + 0.05);
      f.style.setProperty("--reveal", String(i === 0 ? 1 : local));
      f.style.setProperty("--drift", String(range(x, i - 0.3, i + 1)));
    });
  });

  return (
    <section
      ref={track}
      className="fleet"
      style={{ ["--fleet-n" as string]: buses.length }}
      data-header-theme="dark"
      data-active="0"
      aria-labelledby="fleet-title"
    >
      <div className="fleet__stage">
        <div className="fleet__head container">
          <p className="eyebrow">Fuhrpark</p>
          <h2 id="fleet-title" className="h2">
            <SplitText text="Unsere Busse." />
          </h2>
        </div>

        <div className="fleet__frames" aria-hidden="true">
          {buses.map((b, i) => (
            <div key={b.slug} className="fleet__frame" style={{ zIndex: i + 1 }}>
              {b.images[0] ? <Pic src={b.images[0].src} alt="" fill sizes="(min-width: 900px) 62vw, 100vw" quality={75} /> : null}
            </div>
          ))}
        </div>

        <div className="fleet__panels container">
          {buses.map((b, i) => (
            <article key={b.slug} className="fleet__panel" data-i={i} aria-label={`${b.name}, ${b.seatsLabel}`}>
              <p className="fleet__count num">
                {String(i + 1).padStart(2, "0")} <span>/ {String(buses.length).padStart(2, "0")}</span>
              </p>
              <p className="fleet__seats num">
                {b.seats}
                {b.standing ? <small>+{b.standing}</small> : null}
              </p>
              <p className="fleet__seats-l">{b.standing ? "Sitz- + Stehplätze" : "Plätze"}</p>
              <h3 className="fleet__name">
                {b.name}
                <span>
                  {b.type} · {b.emission}
                  {b.since ? ` · ${b.since}` : ""}
                </span>
              </h3>
              <ul className="fleet__features" role="list">
                {b.features.slice(0, 6).map((f) => (
                  <li key={f.label}>
                    <Icon name={FEATURE_ICON[f.key]} size={18} />
                    {f.label}
                  </li>
                ))}
              </ul>
              <div className="fleet__actions">
                <Link href={`/fuhrpark/${b.slug}`} className="link-arrow" tabIndex={-1}>
                  <span>Details</span>
                  <Icon name="arrow" />
                </Link>
              </div>
            </article>
          ))}
        </div>

        <ol className="fleet__index container" role="list" aria-label="Fahrzeuge">
          {buses.map((b, i) => (
            <li key={b.slug} data-i={i}>
              <Link href={`/fuhrpark/${b.slug}`}>
                <span className="num">{String(i + 1).padStart(2, "0")}</span> {b.name} · {b.seats}
              </Link>
            </li>
          ))}
        </ol>

        <div className="fleet__cta container">
          <ButtonLink href="/busanfrage" variant="primary" size="sm" cursor="Anfragen">
            Bus anfragen
          </ButtonLink>
          <ButtonLink href="/fuhrpark" variant="ghost" size="sm">
            Ganzer Fuhrpark
          </ButtonLink>
        </div>
      </div>

      {/* Mobil / reduzierte Bewegung: Swipe-Karten */}
      <div className="fleet__swipe" data-native-scroll>
        {buses.map((b) => (
          <Link key={b.slug} href={`/fuhrpark/${b.slug}`} className="fleet__card">
            <span className="fleet__card-img">
              {b.images[0] ? <Pic src={b.images[0].src} alt={b.images[0].alt} fill sizes="80vw" /> : <Icon name="bus" size={48} />}
            </span>
            <span className="fleet__card-body">
              <span className="fleet__card-seats num">{b.seatsLabel}</span>
              <span className="fleet__card-name">{b.name}</span>
              <span className="fleet__card-type">
                {b.type} · {b.emission}
              </span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

/** Doppeldecker als Premium-Moment – Maske öffnet sich, am Ende Bühnen-Rückzug */
export function SkylinerMoment({ buses }: { buses: Bus[] }) {
  const seats = buses.map((b) => b.seats).sort((a, b) => a - b);
  const track = useRef<HTMLElement>(null);
  useTimeline(track, { start: "top bottom", end: "bottom bottom" }, (p, el) => {
    const open = range(p, 0.05, 0.5);
    el.style.setProperty("--sk-open", String(open));
    el.style.setProperty("--sk-scale", String(1.28 - open * 0.28));
    const r = range(p, 0.72, 1);
    el.style.setProperty("--sk-retreat", String(r));
  });
  const img = "/img/fuhrpark/skyliner-76/aussen.jpg";
  return (
    <section ref={track} className="skyliner" aria-labelledby="sky-title">
      <div className="skyliner__stage" data-header-theme="dark">
        <div className="skyliner__media">
          <Pic src={img} alt="Neoplan Skyliner Doppeldecker (76 Plätze) von Scholkemper Reisen im Gegenlicht" fill sizes="100vw" quality={85} />
        </div>
        <div className="skyliner__copy container">
          <p className="eyebrow">Doppeldecker · Neoplan Skyliner</p>
          <h2 id="sky-title" className="display skyliner__title">
            <SplitText text={"Platz für\ngroße Pläne."} />
          </h2>
          <ul className="skyliner__facts" role="list" data-reveal="stagger">
            <li style={{ ["--i" as string]: 0 }}>
              <strong className="num">{buses.length}</strong> Doppeldecker
            </li>
            <li style={{ ["--i" as string]: 1 }}>
              <strong className="num">{seats.join(" & ")}</strong> Plätze
            </li>
            <li style={{ ["--i" as string]: 2 }}>
              <strong>2</strong> Tische im Unterdeck
            </li>
            <li style={{ ["--i" as string]: 3 }}>
              <strong>Euro 6</strong>
            </li>
          </ul>
          <ButtonLink href="/busanfrage?fahrzeug=doppeldecker" variant="light" cursor="Anfragen">
            Doppeldecker anfragen
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
