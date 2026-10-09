"use client";

import { useEffect, useRef } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { Pic } from "@/components/ui/Pic";
import { clamp, easeInOut, getEnv, lerp, range } from "@/motion/env";
import { useTimeline } from "@/motion/react";
import { BusSide } from "./BusSide";

/**
 * 05 SIGNATURE JOURNEY
 * Bus steht → Motor/Licht → fährt los → Landschaft → Autobahn → Stadt →
 * Reiseziel → Ankunft. Der Scrollfortschritt (0..1) ist die einzige Eingabe;
 * jedes Bild ist eine reine Funktion davon – zurückscrollen spielt rückwärts.
 * Bewegt werden nur transform/opacity (+ eine clip-path-Maske beim Übergang).
 */

const ACTS = [
  { at: 0.0, n: "01", t: "Betriebshof Empelde", s: "Apollostraße 10. Hier beginnt jede Fahrt." },
  { at: 0.11, n: "02", t: "Licht an.", s: "Türen zu, Gurte an – es geht los." },
  { at: 0.21, n: "03", t: "Abfahrt.", s: "Zustieg in Empelde, in Hannover – weitere Abfahrtsorte auf Anfrage." },
  { at: 0.34, n: "04", t: "Landschaft.", s: "Zeit, um anzukommen, bevor man ankommt." },
  { at: 0.5, n: "05", t: "Autobahn.", s: "Lenk- und Ruhezeiten werden eingehalten. Ohne Ausnahme." },
  { at: 0.64, n: "06", t: "Stadt.", s: "Ankommen, wo etwas los ist." },
  { at: 0.8, n: "07", t: "Reiseziel.", s: "Der Bus hält. Das Fenster wird zum Bild." },
  { at: 0.9, n: "08", t: "Angekommen.", s: "Costa Brava – fotografiert auf einer Scholkemper-Reise." },
] as const;

/** Geschwindigkeitsprofil → integrierte Wegstrecke (Tabelle, einmal berechnet) */
function speedAt(p: number) {
  if (p < 0.2) return 0;
  if (p < 0.3) return easeInOut(range(p, 0.2, 0.3));
  if (p < 0.76) return 1;
  if (p < 0.86) return 1 - easeInOut(range(p, 0.76, 0.86));
  return 0;
}
const N = 600;
const TABLE = (() => {
  const t = new Float32Array(N + 1);
  for (let i = 1; i <= N; i++) {
    const a = (i - 1) / N;
    const b = i / N;
    t[i] = t[i - 1] + ((speedAt(a) + speedAt(b)) / 2) * (b - a);
  }
  const total = t[N];
  for (let i = 0; i <= N; i++) t[i] /= total;
  return t;
})();
function distanceAt(p: number) {
  const x = clamp(p) * N;
  const i = Math.floor(x);
  const f = x - i;
  return i >= N ? 1 : TABLE[i] * (1 - f) + TABLE[i + 1] * f;
}

const mod = (a: number, n: number) => ((a % n) + n) % n;

export function BusJourney() {
  const track = useRef<HTMLElement>(null);
  const geo = useRef({ w: 1440, h: 900, win: { x1: 0, y1: 0, x2: 0, y2: 0 }, mobile: false });
  const lastAct = useRef(-1);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const measure = () => {
      const stage = el.querySelector<HTMLElement>(".journey__stage");
      const bus = el.querySelector<HTMLElement>(".journey__bus");
      if (!stage || !bus) return;
      const w = stage.clientWidth;
      const h = stage.clientHeight;
      // Fensterband im Bus-SVG (viewBox 1220×330): x 44–1176, y 62–172
      const L = bus.offsetLeft;
      const T = bus.offsetTop;
      const BW = bus.offsetWidth;
      const BH = bus.offsetHeight;
      geo.current = {
        w,
        h,
        mobile: w < 900,
        win: { x1: L + (BW * 60) / 1220, x2: L + (BW * 1150) / 1220, y1: T + (BH * 64) / 330, y2: T + (BH * 170) / 330 },
      };
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useTimeline(track, { start: "top top", end: "bottom bottom" }, (p, el) => {
    const { w, h, win, mobile } = geo.current;
    const s = el.style;
    const d = distanceAt(p);
    const world = d * w * (mobile ? 9 : 12);

    // Himmel & Licht
    s.setProperty("--j-night", String(1 - range(p, 0.1, 0.3)));
    s.setProperty("--j-dawn", String(range(p, 0.1, 0.24) * (1 - range(p, 0.32, 0.44))));
    s.setProperty("--j-day", String(range(p, 0.3, 0.42) * (1 - range(p, 0.6, 0.72))));
    s.setProperty("--j-dusk", String(range(p, 0.6, 0.72)));
    s.setProperty("--j-sun-y", `${lerp(40, -10, range(p, 0.1, 0.42)) + lerp(0, 60, range(p, 0.48, 0.66))}vh`);
    s.setProperty("--j-sun-o", String(range(p, 0.12, 0.3) * (1 - range(p, 0.58, 0.66))));

    // Ebenen (Parallaxe)
    s.setProperty("--j-hills", `${-mod(world * 0.08, w)}px`);
    s.setProperty("--j-trees", `${-mod(world * 0.42, w)}px`);
    s.setProperty("--j-city", `${-mod(world * 0.3, w)}px`);
    s.setProperty("--j-lights", `${-mod(world * 0.95, 420)}px`);
    s.setProperty("--j-guard", `${-mod(world, 140)}px`);
    s.setProperty("--j-lane", `${-mod(world, 180)}px`);
    s.setProperty("--j-trees-o", String(range(p, 0.24, 0.32) * (1 - range(p, 0.48, 0.54))));
    s.setProperty("--j-hills-o", String(1 - range(p, 0.6, 0.68)));
    s.setProperty("--j-auto-o", String(range(p, 0.46, 0.52) * (1 - range(p, 0.62, 0.68))));
    s.setProperty("--j-city-o", String(range(p, 0.6, 0.68)));

    // Schilderbrücke: einmal während der Autobahn
    const gx = w * 1.05 - (d - distanceAt(0.49)) * w * (mobile ? 9 : 12);
    s.setProperty("--j-gantry", `${gx}px`);

    // Bus: Stand, Licht, Anfahren (leichter Vorlauf), Räder, Federung
    const accel = range(p, 0.2, 0.3) * (1 - range(p, 0.3, 0.42)) - range(p, 0.76, 0.84) * (1 - range(p, 0.84, 0.9));
    s.setProperty("--j-bus-x", `${accel * (mobile ? 3 : 5)}vw`);
    s.setProperty("--j-bus-y", `${Math.sin(world * 0.045) * (speedAt(p) > 0 ? 1.2 : 0)}px`);
    s.setProperty("--wheel", `${(world / (mobile ? 18 : 40)) * 57.3}deg`);
    const lights = range(p, 0.1, 0.16) * (1 - range(p, 0.36, 0.44)) + range(p, 0.64, 0.72) * (1 - range(p, 0.84, 0.88));
    s.setProperty("--j-beam", String(clamp(lights)));
    s.setProperty("--glow", String(clamp(range(p, 0.11, 0.17) * (1 - range(p, 0.32, 0.4)) + range(p, 0.66, 0.74))));

    // Signature-Übergang: Fenster → Reisebild übernimmt
    const r = easeInOut(range(p, 0.8, 0.92));
    const top = lerp(win.y1, 0, r);
    const left = lerp(win.x1, 0, r);
    const right = lerp(w - win.x2, 0, r);
    const bottom = lerp(h - win.y2, 0, r);
    s.setProperty("--j-clip", `inset(${top}px ${right}px ${bottom}px ${left}px round ${lerp(14, 0, r)}px)`);
    s.setProperty("--j-reveal", String(range(p, 0.78, 0.82)));
    s.setProperty("--j-photo-scale", String(lerp(1.35, 1, r)));
    s.setProperty("--j-photo-dim", String(lerp(0.55, 0.12, range(p, 0.84, 0.96))));
    s.setProperty("--j-scene-dim", String(range(p, 0.74, 0.82) * 0.5));
    s.setProperty("--j-final", String(range(p, 0.9, 0.97)));
    s.setProperty("--j-progress", String(p));

    let act = 0;
    for (let i = 0; i < ACTS.length; i++) if (p >= ACTS[i].at) act = i;
    if (act !== lastAct.current) {
      lastAct.current = act;
      el.dataset.act = String(act);
    }
  });

  // Reduzierte Bewegung: Endzustand direkt herstellen
  useEffect(() => {
    if (getEnv().reduced && track.current) track.current.dataset.act = String(ACTS.length - 1);
  }, []);

  return (
    <section ref={track} className="journey" data-header-theme="dark" aria-labelledby="journey-title" data-act="0">
      <div className="journey__stage">
        <h2 id="journey-title" className="sr-only">
          Eine Fahrt mit Scholkemper – vom Betriebshof bis zum Reiseziel
        </h2>
        <div className="journey__scene" aria-hidden="true">
          <div className="journey__sky journey__sky--night" />
          <div className="journey__sky journey__sky--dawn" />
          <div className="journey__sky journey__sky--day" />
          <div className="journey__sky journey__sky--dusk" />
          <div className="journey__stars" />
          <div className="journey__sun" />

          <div className="journey__layer journey__hills">
            {[0, 1].map((i) => (
              <svg key={i} viewBox="0 0 1600 300" preserveAspectRatio="none">
                <path d="M0 210 C160 120 280 170 420 130 S700 60 860 140 S1150 210 1290 120 S1500 110 1600 210 V300 H0Z" fill="var(--j-hill-far)" />
                <path d="M0 250 C200 190 330 230 520 200 S860 160 1010 220 S1340 250 1600 250 V300 H0Z" fill="var(--j-hill-near)" />
              </svg>
            ))}
          </div>

          <div className="journey__layer journey__trees">
            {[0, 1].map((i) => (
              <svg key={i} viewBox="0 0 1600 200" preserveAspectRatio="none">
                {Array.from({ length: 22 }, (_, k) => {
                  const x = k * 74 + ((k * 37) % 30);
                  const hgt = 70 + ((k * 53) % 70);
                  return (
                    <g key={k} fill="var(--j-tree)">
                      <path d={`M${x} 200 L${x + 22} ${200 - hgt} L${x + 44} 200Z`} />
                      <rect x={x + 19} y={192} width={6} height={8} />
                    </g>
                  );
                })}
              </svg>
            ))}
          </div>

          <div className="journey__layer journey__city">
            {[0, 1].map((i) => (
              <svg key={i} viewBox="0 0 1600 360" preserveAspectRatio="none">
                {Array.from({ length: 26 }, (_, k) => {
                  const x = k * 62;
                  const hgt = 90 + ((k * 71) % 190);
                  const wdt = 46 + ((k * 13) % 24);
                  return (
                    <g key={k}>
                      <rect x={x} y={360 - hgt} width={wdt} height={hgt} fill="var(--j-city-fill)" />
                      {Array.from({ length: Math.floor(hgt / 34) }, (_, r) => (
                        <rect
                          key={r}
                          x={x + 8 + ((r + k) % 3) * 12}
                          y={360 - hgt + 14 + r * 30}
                          width={7}
                          height={10}
                          fill="var(--j-city-win)"
                          opacity={(r * 7 + k) % 4 === 0 ? 0.2 : 0.85}
                        />
                      ))}
                    </g>
                  );
                })}
                <path d="M1180 360 V160 L1200 120 L1220 160 V360Z M1196 120 V90 h8 V120Z" fill="var(--j-city-fill)" />
              </svg>
            ))}
          </div>

          <div className="journey__ground" />
          <div className="journey__layer journey__guard" />
          <div className="journey__layer journey__lights" />
          <div className="journey__gantry">
            <span className="journey__sign">
              <span>Ihr Reiseziel</span>
              <span className="journey__sign-arrow">↗</span>
            </span>
          </div>
          <div className="journey__road">
            <div className="journey__lane" />
          </div>

          <div className="journey__bus">
            <div className="journey__beam" />
            <div className="journey__shadow" />
            <BusSide className="journey__bus-svg" />
          </div>
          <div className="journey__dim" />
        </div>

        {/* Fenster → Reiseziel */}
        <div className="journey__reveal" aria-hidden="true">
          <Pic src="/img/galerie/costa-brava/03.jpg" alt="" fill sizes="100vw" quality={75} className="journey__photo" />
        </div>

        <div className="journey__copy container">
          <ol className="journey__acts" role="list">
            {ACTS.map((a, i) => (
              <li key={a.n} className="journey__act" data-i={i}>
                <span className="journey__act-n num">{a.n}</span>
                <p className="journey__act-t display">{a.t}</p>
                <p className="journey__act-s">{a.s}</p>
              </li>
            ))}
          </ol>
          <div className="journey__final">
            <ButtonLink href="/reisen" variant="light" cursor="Los">
              Reiseziele ansehen
            </ButtonLink>
          </div>
        </div>

        <div className="journey__hud" aria-hidden="true">
          <span className="journey__hud-bar">
            <span />
          </span>
          <span className="journey__hud-labels">
            {ACTS.map((a) => (
              <span key={a.n}>{a.n}</span>
            ))}
          </span>
        </div>
      </div>
    </section>
  );
}
