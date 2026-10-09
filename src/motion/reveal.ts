/**
 * Reveals: Ein IntersectionObserver setzt .is-in, alles Weitere ist CSS
 * (siehe styles/motion.css). Stagger über --i (Fragmentindex) und --rv-delay.
 * Neue Elemente (Routenwechsel, nachgeladene Inhalte) werden per
 * MutationObserver automatisch erfasst. Gebundene Elemente merkt sich ein
 * WeakSet – keine zusätzlichen DOM-Attribute (stört sonst die Hydration).
 */
export function initReveal(reduced: boolean): () => void {
  const showAll = () =>
    document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-in)").forEach((el) => el.classList.add("is-in"));

  if (reduced || !("IntersectionObserver" in window)) {
    showAll();
    const mo = new MutationObserver(showAll);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => mo.disconnect();
  }

  const bound = new WeakSet<Element>();
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add("is-in");
          io.unobserve(e.target);
        }
      }
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
  );
  // React hydriert gestreamte Bereiche zeitversetzt. Ein Element erst
  // beobachten, wenn React es übernommen hat – sonst meldet die Hydration
  // eine abweichende className. Nach 6 s wird alles Übrige gebunden.
  const t0 = performance.now();
  let retry = 0;
  const hydrated = (el: Element) => Object.keys(el).some((k) => k.startsWith("__reactFiber"));
  const scan = () => {
    let waiting = 0;
    const force = performance.now() - t0 > 6000;
    document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-in)").forEach((el) => {
      if (bound.has(el)) return;
      if (!force && !hydrated(el)) {
        waiting++;
        return;
      }
      bound.add(el);
      io.observe(el);
    });
    window.clearTimeout(retry);
    if (waiting) retry = window.setTimeout(scan, 120);
  };
  let pending = requestAnimationFrame(scan);
  const mo = new MutationObserver(() => {
    cancelAnimationFrame(pending);
    pending = requestAnimationFrame(scan);
  });
  mo.observe(document.body, { childList: true, subtree: true });
  return () => {
    window.clearTimeout(retry);
    cancelAnimationFrame(pending);
    io.disconnect();
    mo.disconnect();
  };
}
