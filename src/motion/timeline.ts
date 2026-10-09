/**
 * Scroll-Timelines: Fortschritt 0 → 1 eines Elements über eine Scrollstrecke.
 *
 *   track(el, { start: "top top", end: "bottom bottom", onUpdate: p => … })
 *
 * Kanten-Syntax: "<element> <viewport>" mit top|center|bottom|<n>%,
 * Offsets "+=120" / "-=10%", Kurzform end: "+=1200".
 * refreshAll() misst ALLE Trigger in einem Durchgang; pro Frame wird nur noch
 * (y - startY) / (endY - startY) gerechnet – keine Layout-Abfrage pro Frame.
 * Trigger außerhalb ihres Bereichs werden nicht aufgerufen (pausiert).
 */
export interface TrackOptions {
  start?: string;
  end?: string;
  onUpdate: (p: number) => void;
  /** zusätzlicher Puffer (px), in dem noch aktualisiert wird */
  margin?: number;
}

interface Trigger extends Required<Omit<TrackOptions, "margin">> {
  el: HTMLElement;
  margin: number;
  startY: number;
  endY: number;
  lastP: number;
}

const triggers = new Set<Trigger>();
let raf = 0;
let listening = false;

function edge(token: string, size: number): number {
  if (token === "top") return 0;
  if (token === "center") return size / 2;
  if (token === "bottom") return size;
  if (token.endsWith("%")) return (parseFloat(token) / 100) * size;
  return parseFloat(token) || 0;
}

function offset(token: string | undefined, vh: number): number {
  if (!token) return 0;
  const m = token.match(/^([+-])=(-?[\d.]+)(%|px)?$/);
  if (!m) return 0;
  const v = m[3] === "%" ? (parseFloat(m[2]) / 100) * vh : parseFloat(m[2]);
  return m[1] === "-" ? -v : v;
}

function resolve(spec: string, top: number, height: number, vh: number, startY?: number): number {
  const s = spec.trim();
  if (s.startsWith("+=") && startY !== undefined) return startY + offset(s, vh);
  const [elTok = "top", vpTok = "top", off] = s.split(/\s+/);
  return top + edge(elTok, height) - edge(vpTok, vh) + offset(off, vh);
}

function measure(t: Trigger) {
  const r = t.el.getBoundingClientRect();
  const top = r.top + window.scrollY;
  const vh = window.innerHeight;
  t.startY = resolve(t.start, top, r.height, vh);
  t.endY = resolve(t.end, top, r.height, vh, t.startY);
  if (t.endY <= t.startY) t.endY = t.startY + 1;
}

export function refreshAll() {
  triggers.forEach(measure);
  update(true);
}

function update(force = false) {
  const y = window.scrollY;
  triggers.forEach((t) => {
    if (!force && (y < t.startY - t.margin || y > t.endY + t.margin) && (t.lastP === 0 || t.lastP === 1)) return;
    const p = Math.min(1, Math.max(0, (y - t.startY) / (t.endY - t.startY)));
    if (p !== t.lastP || force) {
      t.lastP = p;
      t.onUpdate(p);
    }
  });
}

function onScroll() {
  if (raf) return;
  raf = requestAnimationFrame(() => {
    raf = 0;
    update();
  });
}

let resizeTimer = 0;
function onResize() {
  clearTimeout(resizeTimer);
  resizeTimer = window.setTimeout(refreshAll, 120);
}

let ro: ResizeObserver | null = null;

function listen() {
  if (listening) return;
  listening = true;
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onResize);
  window.addEventListener("load", refreshAll);
  ro = new ResizeObserver(onResize);
  ro.observe(document.body);
}

export function track(el: HTMLElement, opts: TrackOptions): () => void {
  listen();
  const t: Trigger = {
    el,
    start: opts.start ?? "top bottom",
    end: opts.end ?? "bottom top",
    onUpdate: opts.onUpdate,
    margin: opts.margin ?? 0,
    startY: 0,
    endY: 1,
    lastP: -1,
  };
  triggers.add(t);
  measure(t);
  const p = Math.min(1, Math.max(0, (window.scrollY - t.startY) / (t.endY - t.startY)));
  t.lastP = p;
  t.onUpdate(p);
  return () => {
    triggers.delete(t);
  };
}
