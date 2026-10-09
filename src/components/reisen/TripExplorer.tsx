"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { fmtMonth } from "@/lib/format";
import { lockScroll } from "@/motion/scroll";
import { TripCard, type CardTrip } from "./TripCard";

type Opt = { value: string; label: string; count?: number };

const PRICE_OPTS: Opt[] = [
  { value: "50", label: "bis 50 €" },
  { value: "75", label: "bis 75 €" },
  { value: "100", label: "bis 100 €" },
  { value: "100+", label: "über 100 €" },
];
const SORT_OPTS: Opt[] = [
  { value: "relevanz", label: "Relevanz" },
  { value: "datum", label: "Datum" },
  { value: "preis-auf", label: "Preis aufsteigend" },
  { value: "preis-ab", label: "Preis absteigend" },
];

const KEYS = ["q", "art", "monat", "dauer", "preis", "ziel", "verfuegbar", "sort"] as const;
type Key = (typeof KEYS)[number];
type State = Record<Key, string>;

function filter(trips: CardTrip[], s: State, fixedArt?: string) {
  const needle = s.q.trim().toLowerCase();
  const words = needle.split(/\s+/).filter(Boolean);
  const out = trips.filter((t) => {
    if (words.length && !words.every((w) => t.search.includes(w))) return false;
    const art = fixedArt ?? s.art;
    if (art && !t.categories.includes(art)) return false;
    if (s.monat && !t.months.includes(s.monat)) return false;
    if (s.dauer === "1" && t.days !== 1) return false;
    if (s.dauer === "mehr" && t.days < 2) return false;
    if (s.preis) {
      if (s.preis === "100+" ? t.price <= 100 : t.price > Number(s.preis)) return false;
    }
    if (s.ziel && !t.countries.includes(s.ziel)) return false;
    if (s.verfuegbar === "1" && !(t.status === "verfuegbar" || t.status === "wenige")) return false;
    return true;
  });
  const sort = s.sort || "relevanz";
  if (sort === "datum") out.sort((a, b) => a.firstDate.localeCompare(b.firstDate));
  if (sort === "preis-auf") out.sort((a, b) => a.price - b.price);
  if (sort === "preis-ab") out.sort((a, b) => b.price - a.price);
  if (sort === "relevanz") {
    // buchbare Reisen zuerst, sonst Reihenfolge des CMS (nächster Termin)
    const rank = (t: CardTrip) => (t.status === "verfuegbar" || t.status === "wenige" ? 0 : 1);
    out.sort((a, b) => rank(a) - rank(b));
  }
  return out;
}

function Select({ label, name, value, onChange, opts, all }: { label: string; name: string; value: string; onChange: (v: string) => void; opts: Opt[]; all: string }) {
  const id = useId();
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <select id={id} name={name} className="select" value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">{all}</option>
        {opts.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
            {o.count !== undefined ? ` (${o.count})` : ""}
          </option>
        ))}
      </select>
    </div>
  );
}

export function TripExplorer({
  trips,
  categories,
  countries,
  fixedArt,
}: {
  trips: CardTrip[];
  categories: Opt[];
  countries: Opt[];
  fixedArt?: string;
}) {
  const sp = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [drawer, setDrawer] = useState(false);
  const qId = useId();

  const state = useMemo(() => {
    const s = {} as State;
    KEYS.forEach((k) => (s[k] = sp.get(k) ?? ""));
    return s;
  }, [sp]);

  // Suchfeld lokal halten, damit das Tippen nicht bei jedem Zeichen navigiert
  const [q, setQ] = useState(state.q);
  const [lastQ, setLastQ] = useState(state.q);
  if (state.q !== lastQ) {
    setLastQ(state.q);
    setQ(state.q);
  }

  const set = (patch: Partial<State>) => {
    const next = new URLSearchParams(sp.toString());
    Object.entries(patch).forEach(([k, v]) => (v ? next.set(k, v) : next.delete(k)));
    if (next.get("sort") === "relevanz") next.delete("sort");
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const debounce = useRef<number>(0);
  const onQ = (v: string) => {
    setQ(v);
    window.clearTimeout(debounce.current);
    debounce.current = window.setTimeout(() => set({ q: v.trim() }), 280);
  };

  const live = { ...state, q };
  const results = useMemo(() => filter(trips, live, fixedArt), [trips, live.q, live.art, live.monat, live.dauer, live.preis, live.ziel, live.verfuegbar, live.sort, fixedArt]); // eslint-disable-line react-hooks/exhaustive-deps

  const months = useMemo(() => [...new Set(trips.flatMap((t) => t.months))].sort().map((m) => ({ value: m, label: fmtMonth(m) })), [trips]);
  const active = KEYS.filter((k) => k !== "sort" && k !== "q" && state[k]).length + (q ? 1 : 0);

  useEffect(() => {
    lockScroll(drawer);
    document.documentElement.classList.toggle("drawer-open", drawer);
    if (!drawer) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setDrawer(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [drawer]);

  const reset = () => {
    setQ("");
    router.replace(pathname, { scroll: false });
  };

  const filters = (
    <>
      {!fixedArt ? (
        <Select label="Reiseart" name="art" value={state.art} onChange={(v) => set({ art: v })} opts={categories} all="Alle Reisearten" />
      ) : null}
      <Select label="Datum" name="monat" value={state.monat} onChange={(v) => set({ monat: v })} opts={months} all="Jederzeit" />
      <Select
        label="Dauer"
        name="dauer"
        value={state.dauer}
        onChange={(v) => set({ dauer: v })}
        opts={[
          { value: "1", label: "Tagesfahrt" },
          { value: "mehr", label: "Mehrere Tage" },
        ]}
        all="Beliebig"
      />
      <Select label="Preis pro Person" name="preis" value={state.preis} onChange={(v) => set({ preis: v })} opts={PRICE_OPTS} all="Beliebig" />
      {countries.length ? <Select label="Ziel" name="ziel" value={state.ziel} onChange={(v) => set({ ziel: v })} opts={countries} all="Alle Ziele" /> : null}
      <label className="check filters__check">
        <input type="checkbox" checked={state.verfuegbar === "1"} onChange={(e) => set({ verfuegbar: e.target.checked ? "1" : "" })} />
        Nur verfügbare Reisen
      </label>
    </>
  );

  return (
    <div className="explorer">
      <div className="explorer__bar">
        <div className="explorer__search">
          <label htmlFor={qId} className="sr-only">
            Reisen durchsuchen
          </label>
          <Icon name="search" />
          <input
            id={qId}
            type="search"
            value={q}
            onChange={(e) => onQ(e.target.value)}
            placeholder="Ziel, Reise oder Stichwort"
            autoComplete="off"
          />
        </div>
        <div className="explorer__sort">
          <label htmlFor={`${qId}-s`} className="sr-only">
            Sortierung
          </label>
          <select id={`${qId}-s`} className="select" value={state.sort || "relevanz"} onChange={(e) => set({ sort: e.target.value })}>
            {SORT_OPTS.map((o) => (
              <option key={o.value} value={o.value}>
                Sortieren: {o.label}
              </option>
            ))}
          </select>
        </div>
        <button type="button" className="btn btn--outline explorer__filterbtn" onClick={() => setDrawer(true)} aria-expanded={drawer} aria-controls="filter-drawer">
          <Icon name="filter" className="btn__icon" />
          <span>Filter{active ? ` (${active})` : ""}</span>
        </button>
      </div>

      <div className="explorer__grid">
        <aside className="filters" aria-label="Filter">
          <div className="filters__inner">
            <p className="filters__title">Filter</p>
            {filters}
            {active ? (
              <button type="button" className="filters__reset" onClick={reset}>
                Alle Filter zurücksetzen
              </button>
            ) : null}
          </div>
        </aside>

        <div className="explorer__results">
          <p className="explorer__count" aria-live="polite" role="status">
            <strong className="num">{results.length}</strong> {results.length === 1 ? "Reise" : "Reisen"}
            {active ? " gefunden" : ""}
          </p>
          {results.length ? (
            <div className="tgrid">
              {results.map((t, i) => (
                <TripCard key={t.slug} t={t} priority={i < 3} />
              ))}
            </div>
          ) : (
            <div className="explorer__empty">
              <p className="h4">Keine Reise passt zu diesen Filtern.</p>
              <p className="muted">Ändern Sie die Auswahl – oder fragen Sie uns nach einer Gruppenreise nach Ihren Wünschen.</p>
              <div className="explorer__empty-ctas">
                <button type="button" className="btn btn--outline" onClick={reset}>
                  <span>Filter zurücksetzen</span>
                </button>
                <a href="/gruppenreisen" className="btn btn--primary">
                  <span>Gruppenreise anfragen</span>
                </a>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter-Drawer */}
      <div className={`drawer${drawer ? " is-open" : ""}`} aria-hidden={!drawer}>
        <div className="drawer__scrim" onClick={() => setDrawer(false)} />
        <div id="filter-drawer" className="drawer__panel" role="dialog" aria-modal="true" aria-label="Filter" data-native-scroll>
          <div className="drawer__head">
            <p className="filters__title">Filter</p>
            <button type="button" className="drawer__close" onClick={() => setDrawer(false)} aria-label="Filter schließen">
              <Icon name="close" />
            </button>
          </div>
          <div className="drawer__body">{drawer ? filters : null}</div>
          <div className="drawer__foot">
            {active ? (
              <button type="button" className="btn btn--outline" onClick={reset}>
                <span>Zurücksetzen</span>
              </button>
            ) : null}
            <button type="button" className="btn btn--primary" onClick={() => setDrawer(false)}>
              <span>
                {results.length} {results.length === 1 ? "Reise" : "Reisen"} anzeigen
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
