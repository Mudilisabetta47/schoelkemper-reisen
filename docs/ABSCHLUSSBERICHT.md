# Abschlussbericht – Relaunch Scholkemper Reisen

Stand: 09.10.2026 · Repository: github.com/Mudilisabetta47/schoelkemper-reisen

## Design

**Farben** – abgeleitet aus dem Bestand, nicht erfunden:
| Token | Wert | Quelle |
|---|---|---|
| `--brand-primary` | `#992233` | Phoenix im Logo-SVG, `theme-color` der alten Seite |
| `--brand-primary-dark/-deep/-light/-tint` | per `color-mix` | aus Primärrot |
| `--brand-secondary` | `#555555` | Wortmarke „Scholkemper“ |
| `--brand-sand` | `#FAEDDC` | Hintergrund der Print-/Flyer-Grafik („schönsten Tage des Jahres“) |
| `--brand-graphite` | `#1C2125` | dunkles Fensterband der Busse |
| Weiß | | Lackierung der Reisebusse |

**Typografie** – Open Sans (die alte Seite nutzte Open Sans Condensed) als variable Schrift: Headlines in Breite 75 / 800, versal, eng – Fließtext in Breite 100. Dazu Instrument Serif kursiv für emotionale Zeilen. Selbst gehostet (keine Verbindung zu Google beim Aufruf).

**Tokens** – `src/styles/tokens.css`: Farben, Flächen, Text, Status, Typoskala (clamp), 4er-Abstände, Radien, Schatten, Motion (Easing/Dauer), Header-Höhen.

**Logo** – Original-SVG (Phoenix + Wortmarke) aus der bisherigen Seite extrahiert; Varianten farbig / hell für dunkle Flächen; Favicon aus dem Phoenix.

## Pages

Start · Reisen · Reiseart (5) · Reisedetail (10 aktuell) · Busvermietung · Bus-Catering · Busanfrage · Fuhrpark · Fahrzeugdetail (7) · Gruppenreisen · Klassenfahrten · Shuttle & Transfer · Reisekatalog · Galerie · Reise-Info A–Z · Über uns (mit Team) · Jobs · Kontakt · Newsletter · Impressum · Datenschutz · Cookies · Reisebedingungen · AGB Anmietverkehr · 404. Produktions-Build: 53 Routen.

## Reisen

- **Datenquelle:** bestehendes reise-CMS, live gelesen, 15 min gecacht, Snapshot-Fallback, Sofort-Update per `/api/revalidate`. Details: `docs/REISE-CMS.md`.
- **Kategorien:** aus der CMS-Navigation (Tagesfahrten, Mehrtagesfahrten, Gruppenreise → „Für Gruppen“, Weihnachtszeit, Polenmarkt); Ziele aus „Reiseländer“ (Deutschland, Niederlande).
- **Suche:** Volltext über Titel, Untertitel, Beschreibung, Leistungen, Länder. Filter: Reiseart, Datum (Monat), Dauer, Preis, Ziel, nur verfügbare. Sortierung: Relevanz, Datum, Preis auf-/absteigend. URL-synchron (teilbar), sofortige Rückmeldung, mobil als Filter-Drawer. Ohne JavaScript: vollständige, crawlbare Liste.
- **Detail:** Hero mit Reisebild (Bildnachweis aus dem CMS), Datum/Dauer/Preis/Verfügbarkeit, Übersicht, Reiseverlauf, Leistungen, Hotel (falls vorhanden), Zustieg als Zeitleiste, Preise + Sonderleistungen, Termine, Bilder, Wichtige Informationen (Teilnehmer, Stornostaffel, Bedingungen). Terminwahl → Buchung im CMS. Nur vorhandene Daten werden angezeigt.

## Busvermietung

- Seiten: `/busvermietung` (Anlässe, Fuhrpark, Ausstattung, Fahrer & Sicherheit, Incoming, FAQ), `/busanfrage`, `/busvermietung/bus-catering`, `/klassenfahrten`, `/shuttle-transfer`, `/gruppenreisen`.
- **Anfrageflow:** 01 Fahrt (Start, Ziel, Datum, Uhrzeit, Rückfahrt) → 02 Gruppe (Personen, Anlass) → 03 Fahrtart → 04 Fahrzeug/Anforderungen (optional, vorbelegbar per `?fahrzeug=`) → 05 Kontakt → 06 Zusammenfassung + Einwilligung → „Angebot anfragen“. Prüfung je Schritt im Browser und erneut auf dem Server, Honeypot, Mindest-Ausfüllzeit, Ratenbegrenzung, Versand per Brevo (keine Speicherung).

## Fuhrpark

7 Fahrzeuge exakt nach der bisherigen Fahrzeugliste: Neoplan Skyliner 80 (seit 01.03.2025), Neoplan Skyliner 76, Neoplan Cityliner 50 (86 cm), Neoplan Cityliner 48 (83 cm, Heckküche), Scania Touring 57, Scania Touring 49, Linienbus 41 + 40. Bilder aus der Fuhrpark-Galerie (Außen + Innenräume), Ausstattung nur wie dort angegeben.

## Motion

- **Hero:** Intro (Logo-Reveal → Bus rollt ein → Headline wortweise aus der Maske → Lichtstreif → CTAs), danach scrollgesteuerte Kamera, Text-Ausblendung, Bühnen-Rückzug.
- **Bus Journey (Signature):** 640 vh Sticky-Bühne, Bus in Original-Lackierung (Vektor mit Original-Logo). Akte: Betriebshof → Licht an → Abfahrt → Landschaft → Autobahn → Stadt → Reiseziel → Angekommen. Wegstrecke aus integriertem Geschwindigkeitsprofil (Anfahren/Bremsen), Parallax-Ebenen, Himmelsverlauf Nacht→Morgen→Tag→Abend, Scheinwerfer/Innenlicht. Destination Transition: das Busfenster öffnet sich zum Vollbild (Costa Brava, eigenes Reisefoto). Rückwärts scrollen spielt rückwärts.
- **Horizontal Rail:** vertikales Scrollen steuert die Reise-Spur (Desktop), mobil Swipe mit Scroll-Snap.
- **Fleet Story:** Sticky-Bühne, Bildwechsel per Masken-Reveal, Datenpanel je Fahrzeug, Index; danach Doppeldecker-Moment („Platz für große Pläne.“) mit Masken-Öffnung und Bühnen-Rückzug in die helle Fläche.
- Weitere: Smooth Scroll (echter Scrollwert, Sticky funktioniert), Wort-/Linien-/Masken-/Clip-/Bild-Reveals, Stagger per CSS, Parallax, magnetische Buttons, Cursor-Zustände (nur feiner Zeiger), Mega-Menü, Header hell/dunkel je Bühne.
- **Reduced Motion:** eigener Auslieferungszustand – keine Sticky-Strecken, keine Reveals, statische Endbilder, alle Journey-Stationen als Liste. Per QA geprüft.
- Reisesuche und Buchung bewusst ruhig (keine animierten Karten).

## SEO

- Routen sprechend, Canonical/OG/Description je Seite, keine doppelten Titles/Descriptions (geprüft über alle 43 Sitemap-URLs).
- 301-Plan für alle 45 alten URLs: `docs/SEO-MIGRATION.md`.
- Schema: TravelAgency, WebSite, BreadcrumbList, TouristTrip + Offers, Service, FAQPage, ItemList, BusOrCoach; JobPosting vorbereitet.
- Sitemap dynamisch (Reisen + Reisearten aus dem CMS), robots.txt.
- Lokales SEO: NAP aus einer Quelle (`src/lib/site.ts`), Geo-Koordinaten, Öffnungszeiten, Region Hannover.

## Performance

- Bilder: `next/image` mit AVIF/WebP, responsive Größen, Lazy Loading, Hero mit Preload, feste Maße (Maßtabelle) → **CLS 0,000**.
- Motion: nur transform/opacity (eine clip-path-Maske beim Übergang), keine Layout-Abfragen pro Frame, Trigger außerhalb des Viewports pausiert.
- Gemessen (Produktions-Build, kompletter Scroll-Durchlauf der Startseite): 390 px, 1440 px und 2560 px jeweils **Median 16,7 ms (60 fps), p95 ≤ 16,8 ms**. LCP lokal 64–124 ms (ohne Netzwerkdrosselung).
- Build: `next build` erfolgreich, TypeScript strikt, ESLint ohne Befund.

## QA

- Viewports 320, 360, 390, 430, 768, 1024, 1280, 1440, 1920, 2560 × 8 Kernseiten: kein horizontaler Overflow.
- Keine Konsolenfehler, keine Hydration-Warnungen.
- Reisesuche, Filter, Sortierung, Reise öffnen, mobiler Filter-Drawer, Busanfrage-Flow, Reduced Motion: bestanden (`scripts/qa.mjs`).
- Browser: automatisiert in Chromium (Playwright). Safari/Firefox/iOS-Geräte manuell vor Livegang prüfen.

## Offen (echte offene Punkte)

1. **reise-CMS-Subdomain** für Buchung, Bilder, Newsletter einrichten (`REISECMS_BASE_URL`) – ohne sie kann die neue Seite die Domain nicht übernehmen. Siehe `docs/REISE-CMS.md`.
2. **Formularversand:** `BREVO_API_KEY` + Absenderdomain einrichten (bis dahin zeigen Formulare im Livebetrieb Telefon/E-Mail als Alternative).
3. **Rechtstexte prüfen lassen:** Datenschutz (neues Hosting, Formularversand über Brevo, Bild-Proxy, keine Tracking-Cookies mehr), Cookie-Seite (beschreibt noch CMS-Cookies), Impressum. Danach `NEXT_PUBLIC_LEGAL_REVIEW=done`.
4. **Bildqualität:** Viele Fuhrpark- und Galeriebilder liegen nur in 640 × 480 px vor (u. a. beide Skyliner). Für Fullscreen-Momente neue Fotos in ≥ 2400 px empfohlen. Der Skyliner 80 trägt auf dem Foto noch eine Fremdlackierung („BUSREISEN“).
5. **Team:** Bei 6 Personen zeigt die alte Seite kein Porträt (nur Busfotos) – hier Initialen. Aktualität der Liste und Einverständnis zur Veröffentlichung bestätigen lassen.
6. **Jobs:** `datePosted` bestätigen, dann wird JobPosting-Schema aktiv. Auf der alten Seite steht bei Jobs die Nummer 0511 47 36 36 0 – überall sonst 0511 47 30 10 96 (verwendet). Klären.
7. **Reisekatalog:** aktueller Flyer ist „Januar–Mai 2026“ – neuen Katalog als PDF nachreichen.
8. **„Wenige Plätze“:** CMS liefert keine Restplätze – nur möglich, wenn der Anbieter das ausgibt.
9. **Incoming:** auf der alten Seite nur ein Menüpunkt (führte auf Bus Charter). Auf der neuen Seite als Abschnitt in der Busvermietung umgesetzt – Umfang mit dem Kunden abstimmen.
10. **Google-Unternehmensprofil:** alte Anfahrt verlinkte „Langestraße 23“ – Profiladresse prüfen.
11. **Hotelbilder** in der alten Galerie (Aquamarina, Alhambra, Caprici …) wurden nicht übernommen (Rechte unklar, Hotelmarketing).
12. **HANDOVER(3).md** lag nicht vor; verwendet wurde `HANDOVER(2).md` (identisch mit `HANDOVER.md`).
