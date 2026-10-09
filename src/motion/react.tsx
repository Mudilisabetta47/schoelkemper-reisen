"use client";

import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, type RefObject } from "react";
import { getEnv } from "./env";
import { initPointer } from "./pointer";
import { initReveal } from "./reveal";
import { initSmoothScroll, syncScroll } from "./scroll";
import { refreshAll, track, type TrackOptions } from "./timeline";

const useIso = typeof window === "undefined" ? useEffect : useLayoutEffect;

/** Einmal im Root-Layout: Smooth Scroll, Reveals, Cursor, Magnet */
export function MotionRoot() {
  const pathname = usePathname();

  useEffect(() => {
    const env = getEnv();
    const html = document.documentElement;
    html.dataset.motion = env.reduced ? "reduced" : "full";
    html.dataset.pointer = env.hasPointer ? "fine" : "coarse";
    const offs = [initReveal(env.reduced), initSmoothScroll()];
    if (env.hasPointer && !env.reduced) offs.push(initPointer());
    return () => offs.forEach((off) => off());
  }, []);

  useEffect(() => {
    syncScroll();
    const t = window.setTimeout(refreshAll, 60);
    return () => window.clearTimeout(t);
  }, [pathname]);

  return null;
}

/**
 * Scroll-Fortschritt eines Elements. onUpdate bekommt p (0..1) und darf nur
 * transform/opacity/CSS-Variablen schreiben.
 */
export function useTimeline<T extends HTMLElement>(
  ref: RefObject<T | null>,
  opts: Omit<TrackOptions, "onUpdate">,
  onUpdate: (p: number, el: T) => void,
  deps: unknown[] = [],
) {
  const cb = useRef(onUpdate);
  useIso(() => {
    cb.current = onUpdate;
  });
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    return track(el, { ...opts, onUpdate: (p) => cb.current(p, el) });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, opts.start, opts.end, ...deps]);
}
