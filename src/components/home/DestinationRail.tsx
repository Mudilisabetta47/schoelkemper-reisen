"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { Icon } from "@/components/ui/Icon";
import { CmsPic, Pic } from "@/components/ui/Pic";
import { SplitText } from "@/components/ui/SplitText";
import { getEnv } from "@/motion/env";
import { refreshAll } from "@/motion/timeline";
import { useTimeline } from "@/motion/react";

export interface RailItem {
  slug: string;
  title: string;
  subtitle?: string;
  image?: string;
  credit?: string;
  dateLabel: string;
  moreDates: number;
  daysLabel: string;
  price: string;
  priceLabel: string;
  status: string;
  statusLabel: string;
  category?: string;
  isNew: boolean;
}

/**
 * 03 UNSERE REISEN – vertikales Scrollen steuert die horizontale Spur (Desktop).
 * Mobil: normale Swipe-Karten mit Scroll-Snap.
 */
export function DestinationRail({ items, total }: { items: RailItem[]; total: number }) {
  const section = useRef<HTMLElement>(null);
  const trackEl = useRef<HTMLDivElement>(null);
  const dist = useRef(0);

  useEffect(() => {
    const sec = section.current;
    const tr = trackEl.current;
    if (!sec || !tr) return;
    const env = getEnv();
    const measure = () => {
      const pinned = window.innerWidth >= 900 && !env.reduced;
      sec.dataset.pinned = pinned ? "true" : "false";
      if (!pinned) {
        sec.style.removeProperty("--rail-h");
        tr.style.transform = "";
        return;
      }
      dist.current = Math.max(0, tr.scrollWidth - window.innerWidth);
      sec.style.setProperty("--rail-h", `${dist.current + window.innerHeight}px`);
      refreshAll();
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(tr);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  useTimeline(section, { start: "top top", end: "bottom bottom" }, (p, el) => {
    if (el.dataset.pinned !== "true" || !trackEl.current) return;
    trackEl.current.style.transform = `translate3d(${-p * dist.current}px,0,0)`;
    el.style.setProperty("--rail-p", String(p));
  });

  return (
    <section ref={section} className="rail" aria-labelledby="rail-title">
      <div className="rail__stage">
        <div className="rail__track" ref={trackEl}>
          <div className="rail__intro">
            <p className="eyebrow">Unsere Reisen</p>
            <h2 id="rail-title" className="h2">
              <SplitText text={"Ziele für\ndie nächsten\nWochen."} />
            </h2>
            <p className="lead" data-reveal="up">
              Tagesfahrten, Weihnachtsmärkte und Mehrtagesreisen – direkt aus unserem aktuellen Reiseprogramm.
            </p>
            <Link href="/reisen" className="link-arrow" data-reveal="up">
              <span>Alle {total} Reisen</span>
              <Icon name="arrow" />
            </Link>
          </div>
          {items.map((it, i) => (
            <Link
              key={it.slug}
              href={`/reisen/${it.slug}`}
              className={`rail__card${i % 3 === 1 ? " rail__card--tall" : ""}`}
              data-cursor="view"
              data-cursor-label="Ansehen"
            >
              <span className="rail__img">
                {it.image ? (
                  <CmsPic path={it.image} alt="" sizes="(min-width: 900px) 34vw, 82vw" quality={75} />
                ) : (
                  <Pic src="/img/bus/betriebshof-reihe.jpg" alt="" fill sizes="(min-width: 900px) 34vw, 82vw" className="is-fallback" />
                )}
                <span className="rail__chips">
                  {it.isNew ? <span className="chip chip--brand">Neu</span> : null}
                  {it.category ? <span className="chip chip--glass">{it.category}</span> : null}
                </span>
                {it.credit ? <span className="credit">{it.credit}</span> : null}
              </span>
              <span className="rail__body">
                <span className="rail__date num">
                  {it.dateLabel}
                  {it.moreDates > 0 ? ` +${it.moreDates} Termin${it.moreDates > 1 ? "e" : ""}` : ""}
                </span>
                <span className="rail__title">{it.title}</span>
                {it.subtitle ? <span className="rail__sub">{it.subtitle}</span> : null}
                <span className="rail__meta">
                  <span className={`status status--${it.status}`}>{it.statusLabel}</span>
                  <span className="rail__price">
                    <small>{it.daysLabel} · ab</small> {it.price}
                  </span>
                </span>
              </span>
            </Link>
          ))}
          <Link href="/reisen" className="rail__more">
            <span className="rail__more-n num">{total}</span>
            <span className="rail__more-t">Alle Reisen ansehen</span>
            <Icon name="arrow" size={28} />
          </Link>
        </div>
        <div className="rail__progress" aria-hidden="true">
          <span />
        </div>
      </div>
    </section>
  );
}
