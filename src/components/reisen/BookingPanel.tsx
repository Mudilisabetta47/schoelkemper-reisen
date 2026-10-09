"use client";

import { useId, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { fmtDate, fmtDays, fmtPrice, fmtRange, STATUS_LABEL } from "@/lib/format";
import type { TripVariant } from "@/lib/reisecms/types";
import { SITE } from "@/lib/site";

export interface BookingVariant extends Pick<TripVariant, "id" | "start" | "end" | "days" | "status" | "prices" | "bookingTo"> {}

const bookable = (v: BookingVariant) => v.status === "verfuegbar" || v.status === "wenige";

/**
 * Termin wählen → Buchung im bestehenden reise-CMS (POST reise=<ID> an
 * /reise/buchen.php, identisch zum bisherigen Buchungsbutton). Die Buchung,
 * Zahlungsabwicklung und Kontingente bleiben vollständig im CMS.
 */
export function BookingPanel({
  title,
  variants,
  bookingUrl,
}: {
  title: string;
  variants: BookingVariant[];
  bookingUrl: string;
}) {
  const id = useId();
  const firstOpen = variants.find(bookable) ?? variants[0];
  const [sel, setSel] = useState(firstOpen.id);
  const v = variants.find((x) => x.id === sel) ?? firstOpen;
  const ask = `/kontakt?reise=${encodeURIComponent(`${title} (${fmtDate(v.start, "short")})`)}`;

  return (
    <div className="booking" id="buchen">
      <p className="booking__label">Termin wählen</p>
      <fieldset className="booking__dates">
        <legend className="sr-only">Termin</legend>
        {variants.map((x) => (
          <label key={x.id} className={`booking__date${x.id === sel ? " is-sel" : ""}${bookable(x) ? "" : " is-off"}`}>
            <input type="radio" name={`${id}-termin`} value={x.id} checked={x.id === sel} onChange={() => setSel(x.id)} />
            <span className="booking__date-main num">{fmtRange(x)}</span>
            <span className={`status status--${x.status}`}>{STATUS_LABEL[x.status]}</span>
          </label>
        ))}
      </fieldset>

      <dl className="booking__prices">
        {v.prices.map((p) => (
          <div key={p.label}>
            <dt>{p.label}</dt>
            <dd className="num">{fmtPrice(p.amount, { cents: false })}</dd>
          </div>
        ))}
      </dl>
      <p className="booking__meta">
        <Icon name="clock" size={16} /> {fmtDays(v.days)}
        {v.bookingTo ? ` · Buchbar bis ${fmtDate(v.bookingTo, "short")}` : ""}
      </p>

      {bookable(v) ? (
        <form action={bookingUrl} method="post" className="booking__form">
          <input type="hidden" name="reise" value={v.id} />
          <button type="submit" className="btn btn--primary btn--block" data-magnetic="0.15">
            <span>Jetzt buchen</span>
            <Icon name="arrow" className="btn__icon" />
          </button>
        </form>
      ) : (
        <p className="booking__off">
          {v.status === "ausgebucht"
            ? "Dieser Termin ist ausgebucht. Plätze auf der Warteliste fragen Sie bitte telefonisch an."
            : "Für diesen Termin ist der Buchungsschluss erreicht. Rufen Sie uns gern an."}
        </p>
      )}
      <a href={ask} className="btn btn--outline btn--block">
        <span>{bookable(v) ? "Frage zur Reise" : "Anfragen"}</span>
      </a>
      <a href={SITE.phone.href} className="booking__phone">
        <Icon name="phone" size={18} /> {SITE.phone.display}
        <small>{SITE.hours.label}</small>
      </a>
      <p className="booking__note">Die Buchung erfolgt über unser Buchungssystem. Sie erhalten eine Reisebestätigung.</p>
    </div>
  );
}

/** Mobile Buchungsleiste */
export function BookingBar({ price, label, status }: { price: string; label: string; status: string }) {
  return (
    <div className="bookbar">
      <div className="bookbar__price">
        <small>ab</small> <strong className="num">{price}</strong>
        <span>{label}</span>
      </div>
      <a href="#buchen" className="btn btn--primary">
        <span>{status === "verfuegbar" || status === "wenige" ? "Termin & Buchung" : "Anfragen"}</span>
      </a>
    </div>
  );
}
