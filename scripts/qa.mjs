/**
 * QA-Lauf (Playwright):  BASE_URL=http://localhost:3000 node scripts/qa.mjs
 * Prüft: HTTP-Status, Konsolenfehler, horizontales Overflow je Viewport,
 * Title/Description/Canonical/H1/OG (inkl. Duplikate), JSON-LD parsebar,
 * Reisesuche/Filter/Sortierung, Reise öffnen, Busanfrage-Flow, Reduced Motion.
 */
import { chromium } from "playwright";

const base = process.env.BASE_URL ?? "http://localhost:3210";
const VIEWPORTS = [320, 360, 390, 430, 768, 1024, 1280, 1440, 1920, 2560];
const report = { errors: [], warnings: [], ok: [] };
const fail = (m) => report.errors.push(m);
const warn = (m) => report.warnings.push(m);

const browser = await chromium.launch();

// Alle indexierbaren Seiten aus der Sitemap
const sm = await (await fetch(`${base}/sitemap.xml`)).text();
const urls = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
report.ok.push(`Sitemap: ${urls.length} URLs`);

// --- SEO-Prüfung (Desktop) ---
const seo = [];
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.addInitScript(() => (window.__noSmooth = true));
  const errs = [];
  page.on("pageerror", (e) => errs.push(`${page.url()}: ${e}`));
  page.on("console", (m) => m.type() === "error" && errs.push(`${page.url()}: ${m.text().slice(0, 200)}`));
  for (const path of urls) {
    const res = await page.goto(base + path, { waitUntil: "domcontentloaded" });
    if (!res || res.status() !== 200) fail(`${path}: HTTP ${res?.status()}`);
    const d = await page.evaluate(() => ({
      title: document.title,
      desc: document.querySelector('meta[name="description"]')?.content ?? "",
      canonical: document.querySelector('link[rel="canonical"]')?.href ?? "",
      h1: document.querySelectorAll("h1").length,
      og: document.querySelector('meta[property="og:title"]')?.content ?? "",
      ogImage: document.querySelector('meta[property="og:image"]')?.content ?? "",
      ld: [...document.querySelectorAll('script[type="application/ld+json"]')].map((s) => {
        try {
          const j = JSON.parse(s.textContent);
          return [j].flat().map((x) => x["@type"]).join(",");
        } catch {
          return "INVALID";
        }
      }),
      crumbs: !!document.querySelector(".crumbs"),
      imgsNoAlt: [...document.querySelectorAll("img")].filter((i) => !i.hasAttribute("alt")).length,
    }));
    if (!d.title) fail(`${path}: kein Title`);
    if (!d.desc) fail(`${path}: keine Description`);
    if (d.desc.length > 165) warn(`${path}: Description ${d.desc.length} Zeichen`);
    if (!d.canonical) fail(`${path}: kein Canonical`);
    if (d.h1 !== 1) fail(`${path}: ${d.h1} × H1`);
    if (!d.og || !d.ogImage) fail(`${path}: OG unvollständig`);
    if (d.ld.includes("INVALID")) fail(`${path}: JSON-LD ungültig`);
    if (path !== "/" && !d.crumbs) warn(`${path}: keine Breadcrumbs`);
    if (d.imgsNoAlt) fail(`${path}: ${d.imgsNoAlt} Bilder ohne alt`);
    seo.push({ path, ...d });
  }
  const dup = (k) => {
    const m = new Map();
    seo.forEach((s) => m.set(s[k], [...(m.get(s[k]) ?? []), s.path]));
    [...m.entries()].filter(([, v]) => v.length > 1).forEach(([val, v]) => fail(`Doppelte ${k}: "${val.slice(0, 60)}" → ${v.join(", ")}`));
  };
  dup("title");
  dup("desc");
  errs.forEach((e) => fail(`Konsole: ${e}`));
  report.ok.push(`SEO geprüft: ${seo.length} Seiten`);
  await ctx.close();
}

// --- Overflow je Viewport ---
const sample = ["/", "/reisen", urls.find((u) => u.startsWith("/reisen/") && !u.includes("kategorie")), "/busvermietung", "/busanfrage", "/fuhrpark", "/galerie", "/kontakt"].filter(Boolean);
for (const w of VIEWPORTS) {
  const ctx = await browser.newContext({ viewport: { width: w, height: w < 768 ? 800 : 900 }, isMobile: w < 768, hasTouch: w < 768 });
  const page = await ctx.newPage();
  await page.addInitScript(() => (window.__noSmooth = true));
  for (const path of sample) {
    await page.goto(base + path, { waitUntil: "networkidle" });
    // durch die Seite scrollen (Sticky-Bühnen, Lazy-Bilder)
    const H = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < H; y += 1400) await page.evaluate((yy) => window.scrollTo(0, yy), y);
    const r = await page.evaluate(() => {
      const vw = document.documentElement.clientWidth;
      const wide = [...document.querySelectorAll("body *")]
        .filter((el) => {
          const b = el.getBoundingClientRect();
          if (b.width === 0) return false;
          const cs = getComputedStyle(el);
          if (cs.position === "fixed") return false;
          // in horizontalen Scrollern ist Überbreite gewollt
          let p = el.parentElement;
          while (p) {
            const s = getComputedStyle(p);
            if (/(auto|scroll|hidden|clip)/.test(s.overflowX) && p !== document.body && p !== document.documentElement) return false;
            p = p.parentElement;
          }
          return b.right > vw + 1;
        })
        .slice(0, 3)
        .map((el) => `${el.tagName.toLowerCase()}.${String(el.className).split(" ")[0]}`);
      return { sw: document.documentElement.scrollWidth, vw, wide };
    });
    if (r.sw > r.vw + 1) fail(`Overflow ${w}px ${path}: scrollWidth ${r.sw} > ${r.vw} (${r.wide.join(", ")})`);
    // abgeschnittene H1?
    const h1 = await page.evaluate(() => {
      const h = document.querySelector("h1");
      if (!h) return null;
      return h.scrollWidth > h.clientWidth + 2 ? h.textContent : null;
    });
    if (h1) warn(`H1 breiter als Container bei ${w}px ${path}: ${h1.slice(0, 40)}`);
  }
  await ctx.close();
}
report.ok.push(`Overflow geprüft: ${VIEWPORTS.length} Viewports × ${sample.length} Seiten`);

// --- Reisefunktion ---
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(`${base}/reisen`, { waitUntil: "networkidle" });
  const count = async () => Number(await page.locator(".explorer__count strong").first().innerText());
  const all = await count();
  await page.fill(".explorer__search input", "weihnachtsmarkt");
  await page.waitForTimeout(700);
  const q = await count();
  if (!(q > 0 && q < all)) fail(`Suche "weihnachtsmarkt": ${q} von ${all}`);
  if (!page.url().includes("q=weihnachtsmarkt")) fail("Suche nicht in URL übernommen");
  await page.fill(".explorer__search input", "");
  await page.waitForTimeout(700);
  await page.selectOption(".filters select[name=dauer]", "mehr");
  await page.waitForTimeout(500);
  const multi = await count();
  await page.selectOption(".filters select[name=dauer]", "");
  await page.check(".filters input[type=checkbox]");
  await page.waitForTimeout(500);
  const avail = await count();
  await page.uncheck(".filters input[type=checkbox]");
  await page.selectOption(".explorer__sort select", "preis-auf");
  await page.waitForTimeout(500);
  const prices = await page.$$eval(".tcard__price", (els) => els.map((e) => parseFloat(e.textContent.replace(/[^\d,]/g, "").replace(",", "."))));
  if (prices.some((p, i) => i && p < prices[i - 1])) fail(`Sortierung Preis aufsteigend falsch: ${prices}`);
  report.ok.push(`Reisen: ${all} gesamt, Suche ${q}, mehrtägig ${multi}, verfügbar ${avail}, Preise sortiert`);
  await page.click(".tcard__link >> nth=0");
  await page.waitForURL(/\/reisen\/[^/?]+$/);
  await page.waitForSelector(".trip-hero h1");
  const h1 = await page.locator(".trip-hero h1").innerText();
  const bookable = await page.locator(".booking form[action$='/reise/buchen.php']").count();
  report.ok.push(`Reise geöffnet: "${h1}" – Buchungsformular ${bookable ? "vorhanden" : "nicht buchbar (Status)"}`);
  // mobil: Filter-Drawer
  const m = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const mp = await m.newPage();
  await mp.goto(`${base}/reisen`, { waitUntil: "networkidle" });
  await mp.click(".explorer__filterbtn");
  await mp.waitForTimeout(600);
  const open = await mp.locator(".drawer.is-open").count();
  await mp.selectOption(".drawer select[name=dauer]", "1");
  await mp.click(".drawer__foot .btn--primary");
  await mp.waitForTimeout(500);
  if (!open || !mp.url().includes("dauer=1")) fail("Mobiler Filter-Drawer funktioniert nicht");
  else report.ok.push("Mobiler Filter-Drawer ok");
  await m.close();
  await ctx.close();
}

// --- Busanfrage-Flow ---
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(`${base}/busanfrage`, { waitUntil: "networkidle" });
  await page.waitForTimeout(3200); // Mindest-Ausfüllzeit (Spamschutz)
  const next = () => page.click(".req__nav .btn--primary");
  await next();
  if (!(await page.locator(".field__error").count())) fail("Busanfrage: Pflichtfelder werden nicht geprüft");
  await page.fill("input[name=start]", "Hannover");
  await page.fill("input[name=ziel]", "Hamburg");
  await page.fill("input[name=datum]", "2027-05-20");
  await next();
  await page.fill("input[name=personen]", "45");
  await next();
  await page.click(".choice-card >> nth=0");
  await next();
  await next();
  await page.fill("input[name=name]", "QA Test");
  await page.fill("input[name=email]", "qa@example.org");
  await page.fill("input[name=telefon]", "0511 000000");
  await next();
  const sum = await page.locator(".req__summary dd").count();
  await page.check(".req__summary input[type=checkbox]");
  await next();
  const done = await page.waitForSelector(".req-done", { timeout: 8000 }).then(() => true).catch(() => false);
  const errMsg = done ? "" : await page.locator(".req__error").innerText().catch(() => "");
  if (done) report.ok.push(`Busanfrage: 6 Schritte, Zusammenfassung mit ${sum} Angaben, gesendet`);
  else if (/Versand ist gerade nicht möglich/.test(errMsg)) warn("Busanfrage: Versand nicht konfiguriert (BREVO_API_KEY fehlt) – Formular zeigt Telefon/E-Mail als Alternative");
  else fail(`Busanfrage: kein Erfolgsstatus ${errMsg}`);
  await ctx.close();
}

// --- Reduced Motion ---
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.goto(`${base}/`, { waitUntil: "networkidle" });
  const r = await page.evaluate(() => ({
    motion: document.documentElement.dataset.motion,
    hidden: [...document.querySelectorAll("[data-reveal]")].filter((el) => getComputedStyle(el).opacity === "0").length,
    journeyH: document.querySelector(".journey")?.getBoundingClientRect().height,
  }));
  if (r.motion !== "reduced") fail("Reduced Motion wird nicht erkannt");
  if (r.hidden) fail(`Reduced Motion: ${r.hidden} versteckte Reveals`);
  report.ok.push(`Reduced Motion: ok (Journey-Höhe ${Math.round(r.journeyH)}px statt Scrollstrecke)`);
  await ctx.close();
}

await browser.close();
console.log("\n✔ " + report.ok.join("\n✔ "));
if (report.warnings.length) console.log("\n⚠ " + report.warnings.join("\n⚠ "));
console.log(report.errors.length ? "\n✖ " + report.errors.join("\n✖ ") : "\nKeine Fehler.");
process.exit(report.errors.length ? 1 : 0);
