/**
 * Magnetische Buttons und eigener Cursor mit Zuständen – nur bei feinem Zeiger.
 *   data-magnetic="0.3"            Stärke
 *   data-cursor="cta|view|drag"    Cursorzustand
 *   data-cursor-label="Ansehen"    Beschriftung im Cursor
 */
export function initPointer(): () => void {
  const cursor = document.createElement("div");
  cursor.className = "cursor";
  cursor.setAttribute("aria-hidden", "true");
  cursor.innerHTML = '<span class="cursor__dot"></span><span class="cursor__ring"><span class="cursor__label"></span></span>';
  document.body.appendChild(cursor);
  const label = cursor.querySelector<HTMLElement>(".cursor__label")!;

  let x = window.innerWidth / 2;
  let y = window.innerHeight / 2;
  let rx = x;
  let ry = y;
  let raf = 0;
  let visible = false;
  let magnet: HTMLElement | null = null;
  let mStrength = 0.3;
  let mRect: DOMRect | null = null;

  const loop = () => {
    rx += (x - rx) * 0.2;
    ry += (y - ry) * 0.2;
    cursor.style.setProperty("--x", `${x}px`);
    cursor.style.setProperty("--y", `${y}px`);
    cursor.style.setProperty("--rx", `${rx}px`);
    cursor.style.setProperty("--ry", `${ry}px`);
    if (magnet && mRect) {
      const dx = (x - (mRect.left + mRect.width / 2)) * mStrength;
      const dy = (y - (mRect.top + mRect.height / 2)) * mStrength;
      magnet.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
    }
    raf = Math.abs(x - rx) + Math.abs(y - ry) > 0.2 || magnet ? requestAnimationFrame(loop) : 0;
  };
  const kick = () => {
    if (!raf) raf = requestAnimationFrame(loop);
  };

  const onMove = (e: PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    x = e.clientX;
    y = e.clientY;
    if (!visible) {
      visible = true;
      rx = x;
      ry = y;
      cursor.classList.add("is-visible");
    }
    kick();
  };

  const onOver = (e: PointerEvent) => {
    const t = e.target as HTMLElement;
    const c = t.closest<HTMLElement>("[data-cursor]");
    const interactive = t.closest("a, button, [role='button'], input, select, textarea, label, summary");
    cursor.dataset.state = c?.dataset.cursor ?? (interactive ? "link" : "");
    label.textContent = c?.dataset.cursorLabel ?? "";
    const m = t.closest<HTMLElement>("[data-magnetic]");
    if (m !== magnet) {
      if (magnet) {
        magnet.style.transform = "";
        magnet.classList.remove("is-magnet");
      }
      magnet = m;
      if (m) {
        mStrength = parseFloat(m.dataset.magnetic || "0.3") || 0.3;
        mRect = m.getBoundingClientRect();
        m.classList.add("is-magnet");
        kick();
      }
    }
  };

  const onLeaveWindow = () => {
    visible = false;
    cursor.classList.remove("is-visible");
  };
  const onDown = () => cursor.classList.add("is-down");
  const onUp = () => cursor.classList.remove("is-down");
  const onScroll = () => {
    if (magnet) mRect = magnet.getBoundingClientRect();
  };

  window.addEventListener("pointermove", onMove, { passive: true });
  document.addEventListener("pointerover", onOver, { passive: true });
  document.documentElement.addEventListener("pointerleave", onLeaveWindow);
  window.addEventListener("pointerdown", onDown, { passive: true });
  window.addEventListener("pointerup", onUp, { passive: true });
  window.addEventListener("scroll", onScroll, { passive: true });
  document.documentElement.classList.add("has-cursor");

  return () => {
    cancelAnimationFrame(raf);
    window.removeEventListener("pointermove", onMove);
    document.removeEventListener("pointerover", onOver);
    document.documentElement.removeEventListener("pointerleave", onLeaveWindow);
    window.removeEventListener("pointerdown", onDown);
    window.removeEventListener("pointerup", onUp);
    window.removeEventListener("scroll", onScroll);
    document.documentElement.classList.remove("has-cursor");
    cursor.remove();
  };
}
