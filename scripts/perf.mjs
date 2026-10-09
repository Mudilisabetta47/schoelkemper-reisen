/**
 * Frame-Zeiten beim kompletten Scroll-Durchlauf der Startseite.
 *   BASE_URL=http://localhost:3211 node scripts/perf.mjs
 */
import { chromium } from "playwright";
const base = process.env.BASE_URL ?? "http://localhost:3211";
const browser = await chromium.launch();
for (const [w, h] of [[390, 844], [1440, 900], [2560, 1440]]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, isMobile: w < 768, hasTouch: w < 768 });
  const page = await ctx.newPage();
  await page.addInitScript(() => (window.__noSmooth = true));
  await page.goto(base + "/", { waitUntil: "networkidle" });
  await page.waitForTimeout(2500);
  const r = await page.evaluate(async () => {
    const H = document.documentElement.scrollHeight - innerHeight;
    const times = [];
    let last = performance.now();
    let y = 0;
    await new Promise((res) => {
      const tick = (t) => {
        times.push(t - last);
        last = t;
        y += 40;
        window.scrollTo(0, y);
        if (y < H) requestAnimationFrame(tick);
        else res();
      };
      requestAnimationFrame(tick);
    });
    times.sort((a, b) => a - b);
    const q = (p) => times[Math.floor(times.length * p)];
    return { frames: times.length, median: q(0.5).toFixed(1), p95: q(0.95).toFixed(1), cls: 0 };
  });
  const lcp = await page.evaluate(
    () => new Promise((res) => new PerformanceObserver((l) => res(Math.round(l.getEntries().at(-1).startTime))).observe({ type: "largest-contentful-paint", buffered: true })),
  );
  const cls = await page.evaluate(
    () => new Promise((res) => { let s = 0; new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) s += e.value; }).observe({ type: "layout-shift", buffered: true }); setTimeout(() => res(s.toFixed(3)), 300); }),
  );
  console.log(`${w}×${h}: ${r.frames} Frames, Median ${r.median} ms, p95 ${r.p95} ms, LCP ${lcp} ms, CLS ${cls}`);
  await ctx.close();
}
await browser.close();
