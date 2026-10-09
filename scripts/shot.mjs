/**
 * Schnelle Screenshots für die Sichtprüfung.
 *   node scripts/shot.mjs <outDir> <width>x<height> <path>[@scrollY] ...
 * Beispiel: node scripts/shot.mjs /tmp/shots 1440x900 /@0 /@2400 /reisen
 */
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const [outDir, size, ...targets] = process.argv.slice(2);
const [width, height] = size.split("x").map(Number);
const base = process.env.BASE_URL ?? "http://localhost:3210";
mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width, height },
  deviceScaleFactor: 1,
  reducedMotion: process.env.REDUCED ? "reduce" : "no-preference",
  isMobile: width < 768,
  hasTouch: width < 768,
});
const page = await ctx.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(String(e)));
page.on("console", (m) => m.type() === "error" && errors.push(m.text().slice(0, 300)));
await page.addInitScript(() => (window.__noSmooth = true));

let lastPath = "";
for (const t of targets) {
  const [path, y = "0", full] = t.split("@");
  if (path !== lastPath) {
    await page.goto(base + path, { waitUntil: "networkidle" });
    await page.waitForTimeout(2600);
    lastPath = path;
  }
  await page.evaluate((yy) => window.scrollTo(0, yy), Number(y));
  await page.waitForTimeout(1100);
  const name = `${width}${path.replace(/[^a-z0-9]+/gi, "_")}_${y}.png`;
  await page.screenshot({ path: `${outDir}/${name}`, fullPage: full === "full" });
  console.log(name);
}
if (errors.length) console.log("ERRORS:\n" + [...new Set(errors)].join("\n"));
await browser.close();
