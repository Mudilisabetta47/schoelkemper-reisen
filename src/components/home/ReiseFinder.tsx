"use client";

import { useRouter } from "next/navigation";
import { useId, useMemo, useState, type FormEvent } from "react";
import { Icon } from "@/components/ui/Icon";

export interface FinderTrip {
  title: string;
  text: string;
  categories: string[];
  months: string[];
  days: number;
}

/** 02 REISEFINDER – ruhig, schnell, klar. Live-Trefferzahl, Absenden → /reisen mit Filtern */
export function ReiseFinder({
  trips,
  categories,
  months,
}: {
  trips: FinderTrip[];
  categories: { slug: string; label: string }[];
  months: { key: string; label: string }[];
}) {
  const router = useRouter();
  const id = useId();
  const [q, setQ] = useState("");
  const [art, setArt] = useState("");
  const [monat, setMonat] = useState("");
  const [dauer, setDauer] = useState("");

  const count = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return trips.filter(
      (t) =>
        (!needle || t.text.includes(needle)) &&
        (!art || t.categories.includes(art)) &&
        (!monat || t.months.includes(monat)) &&
        (!dauer || (dauer === "1" ? t.days === 1 : t.days > 1)),
    ).length;
  }, [trips, q, art, monat, dauer]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const sp = new URLSearchParams();
    if (q.trim()) sp.set("q", q.trim());
    if (art) sp.set("art", art);
    if (monat) sp.set("monat", monat);
    if (dauer) sp.set("dauer", dauer === "1" ? "1" : "mehr");
    router.push(`/reisen${sp.size ? `?${sp}` : ""}`);
  };

  return (
    <section id="reisefinder" className="finder" aria-labelledby={`${id}-t`}>
      <div className="container">
        <form className="finder__card" onSubmit={submit} action="/reisen" role="search">
          <div className="finder__head">
            <p className="eyebrow">Reisefinder</p>
            <h2 id={`${id}-t`} className="finder__title display">
              Wohin möchten Sie?
            </h2>
          </div>
          <div className="finder__fields">
            <div className="finder__search">
              <label htmlFor={`${id}-q`} className="field__label">
                Ziel oder Stichwort
              </label>
              <div className="finder__input">
                <Icon name="search" />
                <input
                  id={`${id}-q`}
                  name="q"
                  type="search"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="z. B. Weihnachtsmarkt, Leipzig, Polenmarkt"
                  autoComplete="off"
                />
              </div>
            </div>
            <div className="field">
              <label htmlFor={`${id}-art`}>Reiseart</label>
              <select id={`${id}-art`} name="art" className="select" value={art} onChange={(e) => setArt(e.target.value)}>
                <option value="">Alle Reisearten</option>
                {categories.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor={`${id}-m`}>Zeitraum</label>
              <select id={`${id}-m`} name="monat" className="select" value={monat} onChange={(e) => setMonat(e.target.value)}>
                <option value="">Jederzeit</option>
                {months.map((m) => (
                  <option key={m.key} value={m.key}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor={`${id}-d`}>Dauer</label>
              <select id={`${id}-d`} name="dauer" className="select" value={dauer} onChange={(e) => setDauer(e.target.value)}>
                <option value="">Beliebig</option>
                <option value="1">Tagesfahrt</option>
                <option value="mehr">Mehrere Tage</option>
              </select>
            </div>
            <button type="submit" className="btn btn--primary finder__submit" data-magnetic="0.2">
              <span>Reisen finden</span>
              <Icon name="arrow" className="btn__icon" />
            </button>
          </div>
          <p className="finder__count" aria-live="polite">
            <strong className="num">{count}</strong> {count === 1 ? "Reise passt" : "Reisen passen"} zu Ihrer Auswahl
          </p>
        </form>
      </div>
    </section>
  );
}
