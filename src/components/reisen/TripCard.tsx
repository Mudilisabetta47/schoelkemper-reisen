import Link from "next/link";
import { CmsPic, Pic } from "@/components/ui/Pic";
import { Icon } from "@/components/ui/Icon";
import { fmtDate, fmtDays, fmtPrice, monthKey, nextVariant, plainText, STATUS_LABEL, tripStatus } from "@/lib/format";
import type { Trip, TripCategory, TripStatus } from "@/lib/reisecms/types";

/** Serialisierbare Kartendaten (Server → Client) */
export interface CardTrip {
  slug: string;
  title: string;
  subtitle?: string;
  isNew: boolean;
  image?: string;
  credit?: string;
  categories: string[];
  categoryLabel?: string;
  countries: string[];
  dateLabel: string;
  firstDate: string;
  months: string[];
  moreDates: number;
  days: number;
  price: number;
  priceLabel: string;
  status: TripStatus;
  search: string;
}

export function toCard(t: Trip, cats: TripCategory[]): CardTrip {
  const v = nextVariant(t);
  const specific = t.categories.find((c) => c !== "tagesfahrten") ?? t.categories[0];
  return {
    slug: t.slug,
    title: t.title,
    subtitle: t.subtitle,
    isNew: t.isNew,
    image: t.images[0]?.path,
    credit: t.images[0]?.credit,
    categories: t.categories,
    categoryLabel: cats.find((c) => c.slug === specific)?.label,
    countries: t.countries.map((c) => c.toLowerCase()),
    dateLabel: fmtDate(v.start, "weekday"),
    firstDate: v.start,
    months: [...new Set(t.variants.map((x) => monthKey(x.start)))],
    moreDates: t.variants.length - 1,
    days: t.days,
    price: t.priceFrom,
    priceLabel: t.priceLabel.replace(/^ab,\s*/, ""),
    status: tripStatus(t),
    search: [t.title, t.subtitle, t.teaser ? plainText(t.teaser) : "", ...t.countries, ...t.categories, ...t.variants.flatMap((x) => x.services)]
      .join(" ")
      .toLowerCase(),
  };
}

export function TripCard({ t, priority = false }: { t: CardTrip; priority?: boolean }) {
  return (
    <article className="tcard">
      <Link href={`/reisen/${t.slug}`} className="tcard__link">
        <span className="tcard__img">
          {t.image ? (
            <CmsPic
              path={t.image}
              alt=""
              sizes="(min-width: 1200px) 30vw, (min-width: 700px) 45vw, 100vw"
              loading={priority ? "eager" : "lazy"}
            />
          ) : (
            <Pic src="/img/bus/betriebshof-reihe.jpg" alt="" fill sizes="(min-width: 1200px) 30vw, (min-width: 700px) 45vw, 100vw" />
          )}
          <span className="tcard__chips">
            {t.isNew ? <span className="chip chip--brand">Neu</span> : null}
            {t.categoryLabel ? <span className="chip chip--glass">{t.categoryLabel}</span> : null}
          </span>
          {t.credit ? <span className="credit">{t.credit}</span> : null}
        </span>
        <span className="tcard__body">
          <span className="tcard__date num">
              <Icon name="calendar" size={16} />
              {t.dateLabel}
              {t.moreDates > 0 ? <em> + {t.moreDates} weitere{t.moreDates === 1 ? "r Termin" : " Termine"}</em> : null}
          </span>
          <h3 className="tcard__title">{t.title}</h3>
          {t.subtitle ? <span className="tcard__sub">{t.subtitle}</span> : null}
          <span className="tcard__foot">
            <span className="tcard__meta">
              <span className={`status status--${t.status}`}>{STATUS_LABEL[t.status]}</span>
              <span>{fmtDays(t.days)}</span>
              <span className="tcard__price">
                <small>ab</small> {fmtPrice(t.price)}
                <small className="tcard__plabel">{t.priceLabel}</small>
              </span>
            </span>
            <span className="tcard__cta">
              Reise ansehen <Icon name="arrow" size={18} />
            </span>
          </span>
        </span>
      </Link>
    </article>
  );
}
