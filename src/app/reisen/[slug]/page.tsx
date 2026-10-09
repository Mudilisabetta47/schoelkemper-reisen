import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Breadcrumbs } from "@/components/layout/PageHero";
import { BookingBar, BookingPanel } from "@/components/reisen/BookingPanel";
import { TripCard, toCard } from "@/components/reisen/TripCard";
import { Icon } from "@/components/ui/Icon";
import { CmsPic, Pic, cmsSrc } from "@/components/ui/Pic";
import { fmtDate, fmtDays, fmtPrice, fmtRange, nextVariant, plainText, STATUS_LABEL, truncate, tripStatus } from "@/lib/format";
import { getCatalog, getTrip, REISECMS_BASE_URL, snapshotSlugs } from "@/lib/reisecms";
import { JsonLd, pageMeta, tripLd } from "@/lib/seo";
import { SITE } from "@/lib/site";

export async function generateStaticParams() {
  const slugs = snapshotSlugs();
  return slugs.length ? slugs.map((slug) => ({ slug })) : [{ slug: "weihnachtsmarkt-leipzig" }];
}

export async function generateMetadata({ params }: PageProps<"/reisen/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const trip = await getTrip(slug);
  if (!trip) return { title: "Reise nicht gefunden", robots: { index: false } };
  const kind = trip.days === 1 ? "Tagesfahrt" : `${trip.days}-tägige Busreise`;
  const dates = trip.variants.map((x) => fmtDate(x.start, "short")).join(", ");
  const teaser = trip.teaser ? truncate(plainText(trip.teaser), 90) : trip.variants[0].services.join(", ");
  return pageMeta({
    title: `${trip.title}${trip.subtitle ? ` – ${trip.subtitle}` : ""} | ${kind} ab Hannover`,
    description: truncate(`${kind} ${trip.title} am ${dates} ab Ronnenberg-Empelde/Hannover, ab ${fmtPrice(trip.priceFrom)} ${trip.priceLabel.replace(/^ab,\s*/, "")}. ${teaser}`, 158),
    path: `/reisen/${slug}`,
    image: trip.images[0] ? cmsSrc(trip.images[0].path) : undefined,
  });
}

function sameAcross<T>(items: T[]) {
  return new Set(items.map((i) => JSON.stringify(i))).size <= 1;
}

async function TripDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const catalog = await getCatalog();
  const trip = catalog.trips.find((t) => t.slug === slug);
  if (!trip) notFound();

  const v = nextVariant(trip);
  const status = tripStatus(trip);
  const cats = catalog.categories.filter((c) => trip.categories.includes(c.slug) && c.kind === "reiseart");
  const verlauf = v.sections.filter((s) => !/hotel/i.test(s.key + s.title));
  const hotel = v.sections.filter((s) => /hotel/i.test(s.key + s.title));
  const stopsSame = sameAcross(trip.variants.map((x) => x.stops));
  const pricesSame = sameAcross(trip.variants.map((x) => x.prices));
  const hero = trip.images[0];
  const related = catalog.trips
    .filter((t) => t.slug !== trip.slug && t.categories.some((c) => trip.categories.includes(c) && c !== "tagesfahrten"))
    .concat(catalog.trips.filter((t) => t.slug !== trip.slug))
    .filter((t, i, arr) => arr.findIndex((x) => x.slug === t.slug) === i)
    .slice(0, 3)
    .map((t) => toCard(t, catalog.categories));
  const path = `/reisen/${trip.slug}`;

  const toc = [
    { id: "uebersicht", label: "Übersicht", show: Boolean(trip.teaser) },
    { id: "reiseverlauf", label: "Reiseverlauf", show: verlauf.length > 0 },
    { id: "leistungen", label: "Leistungen", show: v.services.length > 0 },
    { id: "hotel", label: "Hotel", show: hotel.length > 0 },
    { id: "zustieg", label: "Zustieg", show: v.stops.length > 0 },
    { id: "preis", label: "Preis", show: v.prices.length > 0 },
    { id: "termine", label: "Termine", show: true },
    { id: "bilder", label: "Bilder", show: trip.images.length > 1 },
    { id: "info", label: "Wichtige Informationen", show: true },
  ].filter((t) => t.show);

  return (
    <>
      <section className="trip-hero on-dark" data-header-theme="dark">
        <div className="trip-hero__media" data-reveal="scale">
          {hero ? (
            <CmsPic path={hero.path} alt={`${trip.title}`} sizes="100vw" preload quality={80} />
          ) : (
            <Pic src="/img/bus/betriebshof-reisebusse.jpg" alt="Scholkemper-Reisebusse am Betriebshof" fill sizes="100vw" preload />
          )}
          {hero?.credit ? <span className="credit">{hero.credit}</span> : null}
        </div>
        <div className="container trip-hero__inner">
          <Breadcrumbs
            tone="light"
            items={[
              { name: "Reisen", path: "/reisen" },
              ...(cats[0] ? [{ name: cats[0].label, path: `/reisen/kategorie/${cats[0].slug}` }] : []),
              { name: trip.title, path },
            ]}
          />
          <div className="trip-hero__chips">
            {trip.isNew ? <span className="chip chip--brand">Neu</span> : null}
            {cats.map((c) => (
              <Link key={c.slug} href={`/reisen/kategorie/${c.slug}`} className="chip chip--glass">
                {c.label}
              </Link>
            ))}
          </div>
          <h1 className="h1 trip-hero__title">{trip.title}</h1>
          {trip.subtitle ? <p className="trip-hero__sub serif">{trip.subtitle}</p> : null}
          <dl className="trip-facts">
            <div>
              <dt>Datum</dt>
              <dd className="num">
                {fmtRange(v)}
                {trip.variants.length > 1 ? <small> + {trip.variants.length - 1} weitere{trip.variants.length > 2 ? " Termine" : "r Termin"}</small> : null}
              </dd>
            </div>
            <div>
              <dt>Dauer</dt>
              <dd>{fmtDays(trip.days)}</dd>
            </div>
            <div>
              <dt>Preis</dt>
              <dd className="num">
                ab {fmtPrice(trip.priceFrom)} <small>{trip.priceLabel.replace(/^ab,\s*/, "")}</small>
              </dd>
            </div>
            <div>
              <dt>Verfügbarkeit</dt>
              <dd>
                <span className={`status status--${status}`}>{STATUS_LABEL[status]}</span>
              </dd>
            </div>
          </dl>
          <a href="#buchen" className="btn btn--primary trip-hero__cta">
            <span>{status === "verfuegbar" || status === "wenige" ? "Jetzt buchen / anfragen" : "Anfragen"}</span>
            <Icon name="arrowDown" className="btn__icon" />
          </a>
        </div>
      </section>

      <div className="trip-body container">
        <nav className="trip-toc" aria-label="Inhalt der Reise">
          <ul role="list">
            {toc.map((t) => (
              <li key={t.id}>
                <a href={`#${t.id}`}>{t.label}</a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="trip-main">
          {trip.teaser ? (
            <section id="uebersicht" className="trip-sec">
              <h2 className="trip-sec__h">Übersicht</h2>
              <div className="trip-teaser" dangerouslySetInnerHTML={{ __html: trip.teaser }} />
            </section>
          ) : null}

          {verlauf.map((s, i) => (
            <section key={s.key} id={i === 0 ? "reiseverlauf" : undefined} className="trip-sec">
              <h2 className="trip-sec__h">{s.title === "Reiseinformation" ? "Reiseverlauf" : s.title}</h2>
              <div className="prose" dangerouslySetInnerHTML={{ __html: s.html }} />
            </section>
          ))}

          {v.services.length ? (
            <section id="leistungen" className="trip-sec">
              <h2 className="trip-sec__h">Leistungen</h2>
              <ul className="checklist" role="list">
                {v.services.map((s) => (
                  <li key={s}>
                    <Icon name="check" size={18} /> {s}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {hotel.map((s, i) => (
            <section key={s.key} id={i === 0 ? "hotel" : undefined} className="trip-sec">
              <h2 className="trip-sec__h">{s.title}</h2>
              <div className="prose" dangerouslySetInnerHTML={{ __html: s.html }} />
            </section>
          ))}

          {v.stops.length ? (
            <section id="zustieg" className="trip-sec">
              <h2 className="trip-sec__h">Zustieg</h2>
              {stopsSame ? null : <p className="muted">Zustiegszeiten für den Termin am {fmtDate(v.start, "short")}. Andere Termine können abweichen.</p>}
              <ol className="stops" role="list">
                {v.stops.map((s) => (
                  <li key={s.time + s.place}>
                    <span className="stops__time num">{s.time.replace(/\s*Uhr$/, "")}</span>
                    <span className="stops__place">{s.place}</span>
                  </li>
                ))}
              </ol>
              {v.stopsNote ? <p className="muted stops__note">{v.stopsNote}</p> : null}
            </section>
          ) : null}

          {v.prices.length ? (
            <section id="preis" className="trip-sec">
              <h2 className="trip-sec__h">Preis</h2>
              <table className="ptable">
                <tbody>
                  {v.prices.map((p) => (
                    <tr key={p.label}>
                      <th scope="row">{p.label}</th>
                      <td className="num">{fmtPrice(p.amount, { cents: true })}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {v.extras.length ? (
                <>
                  <h3 className="trip-sec__h3">Weitere Sonderleistungen</h3>
                  <table className="ptable ptable--muted">
                    <tbody>
                      {v.extras.map((p) => (
                        <tr key={p.label}>
                          <th scope="row">{p.label}</th>
                          <td className="num">{fmtPrice(p.amount, { cents: true })}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              ) : null}
              {pricesSame ? null : <p className="muted">Preise können je Termin abweichen – siehe Termine.</p>}
            </section>
          ) : null}

          <section id="termine" className="trip-sec">
            <h2 className="trip-sec__h">Termine</h2>
            <div className="dates-table" role="table" aria-label="Termine">
              {trip.variants.map((x) => (
                <div key={x.id} role="row" className="dates-table__row">
                  <span role="cell" className="num">
                    {fmtRange(x)}
                  </span>
                  <span role="cell">{fmtDays(x.days)}</span>
                  <span role="cell" className="num">
                    ab {fmtPrice(Math.min(...x.prices.map((p) => p.amount)))}
                  </span>
                  <span role="cell">
                    <span className={`status status--${x.status}`}>{STATUS_LABEL[x.status]}</span>
                  </span>
                </div>
              ))}
            </div>
          </section>

          {trip.images.length > 1 ? (
            <section id="bilder" className="trip-sec">
              <h2 className="trip-sec__h">Bilder</h2>
              <div className="trip-gallery">
                {trip.images.map((img) => (
                  <figure key={img.path}>
                    <span className="trip-gallery__img">
                      <CmsPic path={img.path} alt={trip.title} sizes="(min-width: 900px) 30vw, 90vw" />
                    </span>
                    {img.credit ? <figcaption>{img.credit}</figcaption> : null}
                  </figure>
                ))}
              </div>
            </section>
          ) : null}

          <section id="info" className="trip-sec">
            <h2 className="trip-sec__h">Wichtige Informationen</h2>
            <dl className="infolist">
              {v.minParticipants || v.maxParticipants ? (
                <div>
                  <dt>Teilnehmer</dt>
                  <dd>
                    {v.minParticipants ? `Mindestens ${v.minParticipants} Personen` : ""}
                    {v.minParticipants && v.maxParticipants ? ", " : ""}
                    {v.maxParticipants ? `maximal ${v.maxParticipants} Personen` : ""}
                  </dd>
                </div>
              ) : null}
              {trip.countries.length ? (
                <div>
                  <dt>Reiseländer</dt>
                  <dd>{trip.countries.join(", ")}</dd>
                </div>
              ) : null}
              {v.cancellation ? (
                <div>
                  <dt>Stornierung</dt>
                  <dd>
                    <p>Es gilt {v.cancellation.name}:</p>
                    <table className="ptable ptable--compact">
                      <thead>
                        <tr>
                          <th scope="col">Zugang der Stornierung vor Reisebeginn</th>
                          <th scope="col">Entschädigung</th>
                        </tr>
                      </thead>
                      <tbody>
                        {v.cancellation.rows.map((r) => (
                          <tr key={r.period}>
                            <td>{r.period}</td>
                            <td className="num">{r.fee}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </dd>
                </div>
              ) : null}
              <div>
                <dt>Bedingungen</dt>
                <dd>
                  <Link href="/reisebedingungen">Reisebedingungen Tagesfahrten</Link> · <Link href="/reiseinfo">Reise-Info A–Z</Link> (Gepäck,
                  Sitzplätze, Zahlung)
                </dd>
              </div>
            </dl>
          </section>

          <section className="trip-sec trip-help">
            <p className="h4">Fragen zur Reise?</p>
            <p className="muted">Wir beraten Sie gern telefonisch – oder per E-Mail.</p>
            <div className="trip-help__ctas">
              <a href={SITE.phone.href} className="btn btn--outline">
                <Icon name="phone" className="btn__icon" />
                <span>{SITE.phone.display}</span>
              </a>
              <Link href={`/kontakt?reise=${encodeURIComponent(trip.title)}`} className="btn btn--outline">
                <span>Nachricht schreiben</span>
              </Link>
            </div>
          </section>
        </div>

        <aside className="trip-aside" aria-label="Buchung">
          <BookingPanel
            title={trip.title}
            variants={trip.variants.map(({ id, start, end, days, status: s, prices, bookingTo }) => ({ id, start, end, days, status: s, prices, bookingTo }))}
            bookingUrl={`${REISECMS_BASE_URL}/reise/buchen.php`}
          />
        </aside>
      </div>

      {related.length ? (
        <section className="section section--soft">
          <div className="container">
            <div className="section-head">
              <p className="eyebrow">Weitere Reisen</p>
              <h2 className="h2">Das könnte auch passen.</h2>
            </div>
            <div className="tgrid">
              {related.map((t) => (
                <TripCard key={t.slug} t={t} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <BookingBar price={fmtPrice(trip.priceFrom)} label={trip.priceLabel.replace(/^ab,\s*/, "")} status={status} />
      <JsonLd data={tripLd(trip, path)} />
    </>
  );
}

export default function TripPage(props: PageProps<"/reisen/[slug]">) {
  return (
    <Suspense fallback={<div className="trip-skeleton" aria-busy="true" />}>
      <TripDetail params={props.params} />
    </Suspense>
  );
}
