# Scholkemper Reisen – Website

Relaunch von www.scholkemper-reisen.de. Next.js 16.3 (App Router), React 19, gehostet auf Cloudflare Workers (OpenNext), TypeScript, handgeschriebenes CSS auf Design-Tokens, eigenes Motion-System nach dem Motion-Handover (keine Animations-Bibliothek).

## Start

```bash
npm install
cp .env.example .env.local   # Werte eintragen
npm run dev
```

| Befehl | Zweck |
|---|---|
| `npm run dev` | Entwicklung |
| `npm run build` | Cloudflare-Build (OpenNext) inkl. Reise-Abruf und vorgerenderter Seiten |
| `npm run preview` | Build lokal in der Cloudflare-Laufzeit (workerd) testen |
| `npm run deploy` | Build + Deploy zu Cloudflare Workers |
| `npm run build:next && npm start` | Reiner Next.js-Build (Node-Server) |
| `npm run reisen:sync` | Reise-Snapshot aus dem reise-CMS aktualisieren |
| `node scripts/qa.mjs` | QA: SEO-Tags, Duplikate, Overflow in 10 Viewports, Reisesuche, Busanfrage, Reduced Motion |
| `node scripts/perf.mjs` | Frame-Zeiten, LCP, CLS beim Scroll-Durchlauf |
| `node scripts/shot.mjs <dir> 1440x900 /pfad@scrollY` | Screenshots |

## Aufbau

```
src/
  app/                 Seiten (App Router), API-Routen, Sitemap, Robots
  components/
    home/              Startseite: Hero, Reisefinder, Rail, Bus-Journey, Fuhrpark, Sektionen
    reisen/            Reisekarte, Liste/Filter, Buchungspanel
    forms/             Busanfrage (6 Schritte), allgemeines Anfrageformular
    layout/            Header + Mega-Menü, Footer, Bottom-Bar, Seitenkopf
    ui/                Logo (Original-SVG), Icons, SplitText, Bilder, Lightbox, Bausteine
  motion/              Smooth Scroll, Scroll-Timelines (0→1), Reveals, Cursor/Magnet
  lib/reisecms/        Anbindung reise-CMS (Parser, Abruf, Cache, Snapshot)
  lib/                 Unternehmensdaten (NAP), SEO/JSON-LD, Formatierung, Navigation
  data/                Fuhrpark, Team, Jobs, Reise-Info, Galerie, Bildmaße, Reise-Snapshot
  content/legal.ts     Rechtstexte (unverändert übernommen)
  styles/              tokens.css, base, motion, layout, sections, pages, content
docs/                  REISE-CMS.md, SEO-MIGRATION.md, ABSCHLUSSBERICHT.md
```

Wichtige Regeln:
- **Fakten nur aus `src/lib/site.ts`, `src/data/*` und dem reise-CMS.** Keine Zahlen erfinden.
- **Reisen nie hart codieren** – sie kommen aus dem CMS (siehe `docs/REISE-CMS.md`).
- **Bewegung nur über `transform`/`opacity`**, jede Scroll-Animation ist eine Funktion des Fortschritts `p` (0..1).

## Hosting: Cloudflare Workers

- Konfiguration: `wrangler.jsonc` (Worker-Name `schoelkemper-reisen`), `open-next.config.ts`.
- Cloudflare-Build: Build-Befehl `npm run build`, Deploy-Befehl `npx wrangler deploy`.
- Seiten werden beim Build statisch vorgerendert und aus den Worker-Assets ausgeliefert. Next.js „Cache Components“ ist bewusst **aus** – OpenNext unterstützt es auf Cloudflare derzeit nicht (Worker hängt beim Rendern).
- **Aktualität der Reisen:** Die GitHub Action `.github/workflows/reisen-sync.yml` prüft das reise-CMS alle 30 Minuten. Bei Änderungen committet sie `src/data/reisen.snapshot.json` – das löst automatisch einen neuen Cloudflare-Build aus.
- `patches/` (patch-package): OpenNext 1.20.10 kennt die von Next 16 erzeugte `preview-props.json` noch nicht. Patch entfernen, sobald OpenNext das unterstützt.
- Umgebungsvariablen im Cloudflare-Dashboard setzen (siehe `.env.example`).
