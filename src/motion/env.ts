/**
 * Laufzeit-Umgebung für das Motion-System.
 * Nur im Browser verwenden (alle Aufrufer sind Client-Code).
 */
export interface MotionEnv {
  reduced: boolean;
  hasPointer: boolean;
  touch: boolean;
  mobile: boolean;
}

let cached: MotionEnv | null = null;

export function getEnv(): MotionEnv {
  if (typeof window === "undefined") return { reduced: false, hasPointer: false, touch: false, mobile: false };
  if (cached) return cached;
  const mq = (q: string) => window.matchMedia(q).matches;
  cached = {
    reduced: mq("(prefers-reduced-motion: reduce)") || document.documentElement.dataset.motion === "reduced",
    hasPointer: mq("(hover: hover) and (pointer: fine)"),
    touch: mq("(pointer: coarse)"),
    mobile: mq("(max-width: 899px)"),
  };
  return cached;
}

export function resetEnv() {
  cached = null;
}

export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
/** Teilfortschritt: p im Fenster [a,b] → 0..1 */
export const range = (p: number, a: number, b: number) => clamp((p - a) / (b - a));
export const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
export const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
export const easeIn = (t: number) => t * t * t;
/** rahmenratenunabhängiges Dämpfen */
export const damp = (a: number, b: number, lambda: number, dt: number) => lerp(a, b, 1 - Math.exp(-lambda * dt));
