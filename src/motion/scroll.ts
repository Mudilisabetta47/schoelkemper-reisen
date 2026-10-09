/**
 * Smooth Scrolling (nur Desktop mit Mausrad/Trackpad).
 *
 * Wie im Motion-Handover: Es wird NICHT der Inhalt transformiert, sondern der
 * echte Scrollwert gesetzt. Dadurch funktionieren position: sticky, fixed,
 * IntersectionObserver, Ankerlinks, Browsersuche und Screenreader unverändert.
 * Auf Touch-Geräten und bei prefers-reduced-motion bleibt natives Scrollen aktiv.
 */
import { clamp, damp, getEnv } from "./env";

let target = 0;
let current = 0;
let running = false;
let enabled = false;
let locked = false;
let last = 0;
let raf = 0;
let selfScroll = false;

const maxScroll = () => document.documentElement.scrollHeight - window.innerHeight;

function frame(now: number) {
  const dt = Math.min(0.05, (now - last) / 1000 || 0.016);
  last = now;
  current = damp(current, target, 11.5, dt);
  if (Math.abs(target - current) < 0.4) current = target;
  selfScroll = true;
  window.scrollTo(0, current);
  if (current !== target) raf = requestAnimationFrame(frame);
  else running = false;
}

function start() {
  if (running) return;
  running = true;
  last = performance.now();
  raf = requestAnimationFrame(frame);
}

function canScrollInside(el: Element | null, dy: number): boolean {
  while (el && el !== document.body) {
    if (el instanceof HTMLElement) {
      if (el.dataset.nativeScroll !== undefined) return true;
      const s = getComputedStyle(el);
      if (/(auto|scroll)/.test(s.overflowY) && el.scrollHeight > el.clientHeight) {
        if ((dy > 0 && el.scrollTop + el.clientHeight < el.scrollHeight - 1) || (dy < 0 && el.scrollTop > 0)) return true;
      }
    }
    el = el.parentElement;
  }
  return false;
}

function onWheel(e: WheelEvent) {
  if (!enabled || locked || e.ctrlKey || e.defaultPrevented) return;
  if (canScrollInside(e.target as Element, e.deltaY)) return;
  e.preventDefault();
  const unit = e.deltaMode === 1 ? 40 : e.deltaMode === 2 ? window.innerHeight : 1;
  if (!running) current = window.scrollY;
  target = clamp(target + e.deltaY * unit * 1.08, 0, maxScroll());
  start();
}

function onNativeScroll() {
  if (selfScroll) {
    selfScroll = false;
    return;
  }
  // Tastatur, Scrollbar, Anker, Suche: hart synchronisieren statt hinterherzukriechen
  if (!running || Math.abs(window.scrollY - current) > window.innerHeight * 1.5) {
    cancelAnimationFrame(raf);
    running = false;
    target = current = window.scrollY;
  }
}

export function initSmoothScroll(): () => void {
  const env = getEnv();
  if (env.reduced || !env.hasPointer || (window as unknown as { __noSmooth?: boolean }).__noSmooth) return () => {};
  enabled = true;
  target = current = window.scrollY;
  window.addEventListener("wheel", onWheel, { passive: false });
  window.addEventListener("scroll", onNativeScroll, { passive: true });
  document.documentElement.classList.add("has-smooth");
  return () => {
    enabled = false;
    window.removeEventListener("wheel", onWheel);
    window.removeEventListener("scroll", onNativeScroll);
    document.documentElement.classList.remove("has-smooth");
  };
}

/** z. B. bei geöffnetem Menü/Lightbox */
export function lockScroll(v: boolean) {
  locked = v;
  if (v) {
    cancelAnimationFrame(raf);
    running = false;
    target = current = window.scrollY;
  }
}

export function syncScroll() {
  cancelAnimationFrame(raf);
  running = false;
  target = current = window.scrollY;
}
