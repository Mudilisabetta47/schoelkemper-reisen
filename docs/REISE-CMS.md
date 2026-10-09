# Reise-CMS: Anbindung und Migrationsstrategie

## Ist-Zustand (geprüft am 09.10.2026)

- Die bisherige Website **ist** das reise-CMS (www.reise-cms.com, `meta generator`). Pflege von Reisen, Terminen, Preisen, Kontingenten, Zustiegen, Stornostaffeln, Galerie und Newsletter erfolgt dort.
- **Keine öffentliche API, kein Feed.** Geprüft: `rss.php`, `rss.xml`, `feed`, `export.xml`, `api/`, `reise/json` → CMS-Fehlerseite (Soft-404 mit Status 200).
- Öffentlich lesbar sind:
  - Reiseliste `/reise/` (alle aktuellen Termine, Status „ausgebucht“, Preis, Bild)
  - Reisearten `/reise/<Name>` (Tagesfahrten, Mehrtagesfahrten, Gruppenreise, Weihnachtszeit, Polenmarkt) – aus der Hauptnavigation
  - Detailseiten `/reise/<ID>_<Titel>` (Leistungen, Zustiege, Preise, Sonderleistungen, Reiseverlauf, Teilnehmerzahlen, Stornostaffel, Reiseländer, Alternativtermine, Buchungsschluss, Bilder)
- **Buchung:** `POST /reise/buchen.php` mit `reise=<ID>` (ermittelt aus `/includes/design/ajax/buchungs_btn.php`).
- **Bilder** liegen unter `/media/image/…` und haben Hotlink-Schutz (nur mit passendem `Referer`).
- **Newsletter** mit Double-Opt-In unter `/newsletter/index.php`.

## Umsetzung in der neuen Website

| Baustein | Datei | Aufgabe |
|---|---|---|
| Parser | `src/lib/reisecms/parse.ts` | reine Funktionen: HTML → Daten (Liste, Detail, Kategorien) |
| Abruf | `src/lib/reisecms/fetch-catalog.ts` | liest Liste, Reisearten, alle Detailseiten (inkl. Alternativtermine), gruppiert Termine gleichen Titels zu einer Reise |
| Cache | `src/lib/reisecms/index.ts` | `'use cache'` + `cacheLife` (15 min Revalidierung, 24 h Ablauf), Tag `reisen` |
| Fallback | `src/data/reisen.snapshot.json` | letzter bekannter Stand – wird genutzt, wenn das CMS nicht erreichbar ist (`npm run reisen:sync`) |
| Bilder | `src/app/cms-media/[...path]/route.ts` | Proxy mit `Referer`, danach Optimierung durch `next/image` (AVIF/WebP) |
| Buchung | `src/components/reisen/BookingPanel.tsx` | Formular `POST {REISECMS_BASE_URL}/reise/buchen.php` mit `reise=<ID>` – identisch zum bisherigen Button |
| Sofort-Update | `POST /api/revalidate` | nach Änderungen im CMS (Header `x-revalidate-secret`) |
| Alte URLs | `src/app/reise/[...legacy]/route.ts` | `/reise/2328_…` → `/reisen/weihnachtsmarkt-leipzig` (301), Kategorien und Länder ebenso |

**Grundsatz:** Es werden keine Reisen hart codiert. Neue, geänderte, ausgebuchte oder abgelaufene Reisen erscheinen automatisch (spätestens nach 15 Minuten). Vergangene Termine werden nie angezeigt – auch nicht aus einem alten Snapshot.

**Status „Wenige Plätze“:** Das CMS veröffentlicht keine Restplatzzahl. Der Status ist im Datenmodell vorhanden und wird angezeigt, sobald eine Quelle ihn liefert. Bis dahin: „Verfügbar“, „Ausgebucht“, „Buchungsschluss“.

## Was für den Livegang nötig ist (Entscheidung beim Kunden/CMS-Anbieter)

Die neue Website übernimmt die Domain `www.scholkemper-reisen.de`. Das reise-CMS muss dafür **unter einer eigenen Adresse weiterlaufen**, weil Buchung, Bilder und Newsletter dort bleiben.

1. **Subdomain für das CMS einrichten** (Vorschlag: `buchung.scholkemper-reisen.de`) – beim CMS-Anbieter anfragen. In `.env` → `REISECMS_BASE_URL`.
2. **Hotlink-Schutz** des CMS für die neue Domain freigeben (oder Bild-Proxy wie umgesetzt beibehalten).
3. **Buchungsstrecke** unter der Subdomain testen (POST `reise/buchen.php`, Rückleitung nach Abschluss).
4. **Newsletter-Formular** unter der Subdomain prüfen (DOI-Mail-Links zeigen dann auf die Subdomain).
5. **Snapshot aktualisieren** direkt vor dem Livegang: `npm run reisen:sync`.
6. Optional: CMS-Webhook oder manueller Knopf auf `/api/revalidate` für sofortige Aktualisierung.

## Empfohlene nächste Stufe (stabiler als HTML-Lesen)

Beim reise-CMS-Anbieter eine **XML/JSON-Schnittstelle** (Reiseexport) anfragen. Dann wird nur `fetch-catalog.ts` ersetzt – Datenmodell (`types.ts`), Seiten, Filter, SEO und Redirects bleiben unverändert. Bis dahin schützt der Parser so:
- Erkennt er die Reiseliste nicht (Markup geändert), wirft er einen Fehler → Website nutzt automatisch den Snapshot und protokolliert eine Warnung.
- Alle Parserfunktionen sind ohne Netz testbar (HTML rein, Daten raus).

## Keine Migration der Reisedaten nötig

Da das CMS führend bleibt, werden keine Reisen kopiert. Eine Migration in ein eigenes Reise-Backend ist erst sinnvoll, wenn der Kunde das reise-CMS ablösen will – dann: Export aller Reisen/Termine/Buchungen beim Anbieter, Buchungs- und Zahlungsprozess neu aufsetzen, Pauschalreise-Pflichten (Formblätter, Sicherungsschein) prüfen. Das ist ausdrücklich **nicht** Teil dieses Relaunchs.
