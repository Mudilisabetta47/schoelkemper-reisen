# SEO-Migration: Redirect-Plan

Alle 45 URLs der bisherigen Sitemap wurden gegen den Produktions-Build geprüft: jede endet mit **301** auf einer passenden Seite mit Status 200.

## Feste Weiterleitungen (`next.config.ts`)

| Alt | Neu |
|---|---|
| `/index.php` | `/` |
| `/reise`, `/reise/`, `/reise/index.php`, `/reise/reise.php` | `/reisen` |
| `/scholkemper`, `/scholkemper/`, `/scholkemper/index.php` | `/ueber-uns` |
| `/scholkemper/mitarbeiter.php` | `/ueber-uns#team` |
| `/scholkemper/stellenangebote.php` | `/jobs` |
| `/scholkemper/reisebusse.php` | `/fuhrpark` |
| `/scholkemper/anfahrt.php` | `/kontakt#anfahrt` |
| `/scholkemper/impressum.php` | `/impressum` |
| `/scholkemper/datenschutz.php`, `/service/datenschutz.php` | `/datenschutz` |
| `/scholkemper/cookieinformation.php` | `/cookies` |
| `/service/kontakt.php` | `/kontakt` |
| `/service/bildergalerie.php` | `/galerie` |
| `/service/reise_info.php` | `/reiseinfo` |
| `/service/reisekataloge.php` | `/reisekatalog` |
| `/service/reisebedingungen.php` | `/reisebedingungen` |
| `/service/agb_anmietverkehr.php` | `/agb-anmietverkehr` |
| `/service/gruppenreisen.php`, `/service/gruppen_vereinsreisen.php` | `/gruppenreisen` |
| `/busvermietung/bus_charter.php`, `/busvermietung/mietomnibusse.php` | `/busvermietung` |
| `/busvermietung/essen.php` | `/busvermietung/bus-catering` |
| `/busvermietung/klassenfahrt.php` | `/klassenfahrten` |
| `/newsletter`, `/newsletter/index.php` | `/newsletter` |
| `/media/download/reisekatalog/flyerinnen.pdf` | `/downloads/scholkemper-flyer-januar-mai-2026.pdf` |

## Datenbasierte Weiterleitungen (`src/app/reise/[...legacy]/route.ts`)

| Alt | Neu |
|---|---|
| `/reise/<ID>_<Titel>` (aktuelle Reise) | `/reisen/<slug>` – mehrere Termine einer Reise führen auf dieselbe Seite |
| `/reise/<ID>_<Titel>` (abgelaufen) | `/reisen` (statt 404 – Links aus Flyern/Newslettern bleiben nutzbar) |
| `/reise/Tagesfahrten`, `…/Mehrtagesfahrten`, `…/Gruppenreise`, `…/Weihnachtszeit`, `…/Polenmarkt` | `/reisen/kategorie/<reiseart>` |
| `/reise/Deutschland`, `/reise/Niederlande` | `/reisen?ziel=<land>` |
| `/reise/buchen.php` | `/reisen` |

## Neue URL-Struktur

- Reisen: `/reisen/weihnachtsmarkt-leipzig` (sprechend, keine IDs), Reisearten: `/reisen/kategorie/tagesfahrten`
- Leistungen: `/busvermietung`, `/busanfrage`, `/fuhrpark`, `/fuhrpark/<fahrzeug>`, `/gruppenreisen`, `/klassenfahrten`, `/shuttle-transfer`
- Service/Unternehmen: `/reisekatalog`, `/galerie`, `/reiseinfo`, `/ueber-uns`, `/jobs`, `/kontakt`, `/newsletter`
- Recht: `/impressum`, `/datenschutz`, `/cookies`, `/reisebedingungen`, `/agb-anmietverkehr`

## Nach dem Livegang

1. Google Search Console: Domain-Property behalten, neue Sitemap `https://www.scholkemper-reisen.de/sitemap.xml` einreichen.
2. Die alte Sitemap **nicht** löschen lassen, bevor Google die 301 verarbeitet hat (Crawl der alten URLs erwünscht).
3. Google-Unternehmensprofil: Website-Link auf `https://www.scholkemper-reisen.de/` prüfen, Adresse exakt wie im Impressum (Apollostraße 10, 30952 Ronnenberg). Der alte Anfahrt-Link nannte noch „Langestraße 23“ – im Profil prüfen.
4. 4–6 Wochen „Seiten“-Bericht der Search Console beobachten (404, Weiterleitungsfehler).

## Strukturierte Daten

| Seite | Typ |
|---|---|
| alle | `TravelAgency` (Unterklasse von LocalBusiness: Reisebüro mit Betriebshof, Adresse, Geo, Öffnungszeiten, Telefon) + `WebSite` mit `SearchAction` |
| Unterseiten | `BreadcrumbList` |
| Reisen | `TouristTrip` mit `Offer` je Termin und Preisstufe (Verfügbarkeit InStock/SoldOut) |
| Reiseliste | `ItemList` |
| Busvermietung, Gruppenreisen, Klassenfahrten, Shuttle | `Service` |
| Busvermietung, Klassenfahrten | `FAQPage` (echte Fragen/Antworten aus vorhandenen Angaben) |
| Fuhrpark | `ItemList`, Fahrzeugseiten `BusOrCoach` |
| Jobs | `JobPosting` – **vorbereitet, aber aus**, bis das Veröffentlichungsdatum (`datePosted`) bestätigt ist (`src/data/company.ts`) |

Bewusst **nicht**: Bewertungen/`AggregateRating` (keine belegten Bewertungen), „BusOrCoachCompany“ (existiert in schema.org nicht).
