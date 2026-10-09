"use client";

import { useRef } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Logo } from "@/components/ui/Logo";
import { Pic } from "@/components/ui/Pic";
import { SplitText } from "@/components/ui/SplitText";
import { clamp, easeOut, range } from "@/motion/env";
import { useTimeline } from "@/motion/react";

/**
 * 01 HERO – Intro (zeitbasiert, einmalig): Logo → Bus → Headline → Licht → CTA.
 * Danach steuert der Scrollfortschritt (0..1) Kamera, Text und Bühnen-Rückzug.
 */
export function Hero() {
  const track = useRef<HTMLElement>(null);

  useTimeline(track, { start: "top top", end: "bottom top" }, (p, el) => {
    const s = el.style;
    const t = easeOut(clamp(p * 1.15));
    s.setProperty("--h-img-scale", String(1.06 + t * 0.14));
    s.setProperty("--h-img-x", `${-t * 4}%`);
    s.setProperty("--h-img-y", `${t * 6}%`);
    s.setProperty("--h-copy-y", `${-p * 18}vh`);
    s.setProperty("--h-copy-o", String(1 - range(p, 0.15, 0.55)));
    s.setProperty("--h-light", String(range(p, 0, 0.6)));
    const r = range(p, 0.55, 1);
    s.setProperty("--h-stage-scale", String(1 - r * 0.08));
    s.setProperty("--h-stage-radius", `${r * 32}px`);
    s.setProperty("--h-dim", String(0.25 + r * 0.45));
  });

  return (
    <section ref={track} className="hero" data-header-theme="dark" aria-labelledby="hero-title">
      <div className="hero__stage">
        <div className="hero__media">
          <Pic
            src="/img/bus/betriebshof-reisebusse.jpg"
            alt="Weiße Scholkemper-Reisebusse mit rotem Phoenix-Logo am Betriebshof in Empelde"
            preload
            fetchPriority="high"
            quality={85}
            sizes="100vw"
            className="hero__img"
          />
          <div className="hero__light" aria-hidden="true" />
          <div className="hero__shade" aria-hidden="true" />
        </div>

        <div className="hero__intro" aria-hidden="true">
          <div className="hero__intro-logo">
            <Logo tone="light" animated />
          </div>
        </div>

        <div className="hero__copy container">
          <p className="hero__kicker">
            <span>Busreisen</span>
            <span aria-hidden="true">·</span>
            <span>Gruppenreisen</span>
            <span aria-hidden="true">·</span>
            <span>Busvermietung</span>
          </p>
          <h1 id="hero-title" className="hero__title display">
            <SplitText text={"Wir bringen\nMenschen\nweiter."} delay={1350} accent={["weiter"]} />
          </h1>
          <p className="hero__sub">
            <span className="serif">Für Ihre schönsten Tage des Jahres</span> – aus Ronnenberg-Empelde bei Hannover.
          </p>
          <div className="hero__ctas">
            <ButtonLink href="/reisen" variant="primary" cursor="Entdecken">
              Reisen entdecken
            </ButtonLink>
            <ButtonLink href="/busanfrage" variant="ghost">
              Bus anfragen
            </ButtonLink>
          </div>
        </div>

        <a href="#reisefinder" className="hero__scroll" aria-label="Weiter zum Reisefinder">
          <span className="hero__scroll-line" />
          <Icon name="arrowDown" size={18} />
        </a>
      </div>
    </section>
  );
}
