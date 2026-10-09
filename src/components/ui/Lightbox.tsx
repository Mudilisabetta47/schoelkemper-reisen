"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { lockScroll } from "@/motion/scroll";
import { Icon } from "./Icon";
import { picSize } from "./Pic";

export interface LbImage {
  src: string;
  alt: string;
  caption?: string;
}

/**
 * Galerie mit Vollbild-Ansicht. Tastatur (←/→/Esc), Wischen, Fokusfalle.
 * Die Vorschau-Elemente rendert der Aufrufer über render(); jedes bekommt open(i).
 */
export function Lightbox({
  images,
  render,
}: {
  images: LbImage[];
  render: (open: (i: number) => void) => React.ReactNode;
}) {
  const [idx, setIdx] = useState<number | null>(null);
  const dialog = useRef<HTMLDivElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const touchX = useRef(0);

  const open = useCallback((i: number) => {
    opener.current = document.activeElement as HTMLElement;
    setIdx(i);
  }, []);
  const close = useCallback(() => setIdx(null), []);
  const step = useCallback((d: number) => setIdx((i) => (i === null ? i : (i + d + images.length) % images.length)), [images.length]);

  useEffect(() => {
    const isOpen = idx !== null;
    lockScroll(isOpen);
    document.documentElement.style.overflow = isOpen ? "hidden" : "";
    if (!isOpen) {
      opener.current?.focus();
      return;
    }
    dialog.current?.querySelector<HTMLElement>(".lb__close")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
      if (e.key === "Tab" && dialog.current) {
        const f = [...dialog.current.querySelectorAll<HTMLElement>("button")];
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [idx, close, step]);

  const cur = idx !== null ? images[idx] : null;
  const size = cur ? picSize(cur.src) : null;

  return (
    <>
      {render(open)}
      {cur && size ? (
        <div
          ref={dialog}
          className="lb"
          role="dialog"
          aria-modal="true"
          aria-label={`Bild ${idx! + 1} von ${images.length}`}
          onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
          onTouchEnd={(e) => {
            const dx = e.changedTouches[0].clientX - touchX.current;
            if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
          }}
        >
          <button type="button" className="lb__scrim" onClick={close} aria-label="Schließen" tabIndex={-1} />
          <figure className="lb__fig">
            <Image key={cur.src} src={cur.src} alt={cur.alt} width={size.width} height={size.height} sizes="100vw" quality={85} className="lb__img" />
            <figcaption className="lb__cap">
              <span>{cur.caption ?? cur.alt}</span>
              <span className="num">
                {idx! + 1} / {images.length}
              </span>
            </figcaption>
          </figure>
          <button type="button" className="lb__btn lb__prev" onClick={() => step(-1)} aria-label="Vorheriges Bild">
            <Icon name="arrowLeft" size={26} />
          </button>
          <button type="button" className="lb__btn lb__next" onClick={() => step(1)} aria-label="Nächstes Bild">
            <Icon name="arrow" size={26} />
          </button>
          <button type="button" className="lb__btn lb__close" onClick={close} aria-label="Schließen">
            <Icon name="close" size={26} />
          </button>
        </div>
      ) : null}
    </>
  );
}
