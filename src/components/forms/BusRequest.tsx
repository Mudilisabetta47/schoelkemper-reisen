"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { Icon } from "@/components/ui/Icon";
import { EMAIL_RE, FIELD_LABEL } from "@/lib/inquiry";
import { SITE } from "@/lib/site";

type Data = Record<string, string>;

const STEPS = ["Fahrt", "Gruppe", "Fahrtart", "Fahrzeug", "Kontakt", "Zusammenfassung"] as const;
const REQUIRED_BY_STEP: string[][] = [["start", "ziel", "datum"], ["personen"], ["fahrtart"], [], ["name", "email", "telefon"], ["datenschutz"]];

const FAHRTART = [
  { v: "Hin- und Rückfahrt", d: "Ein Ziel, am selben Tag zurück" },
  { v: "Mehrtagestour", d: "Mit Übernachtung, Bus bleibt bei der Gruppe" },
  { v: "Shuttle", d: "Pendelverkehr, z. B. Messe oder Event" },
  { v: "Einfache Fahrt / Transfer", d: "Nur hin oder nur zurück" },
];
const ANLASS = ["Verein", "Firma / Betriebsausflug", "Schulklasse / Kita", "Messe", "Flughafen", "Event / Sport", "Private Feier", "Sonstiges"];

export interface VehicleOption {
  value: string;
  label: string;
}

function Field({ id, label, error, children, hint }: { id: string; label: string; error?: string; children: ReactNode; hint?: string }) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      {children}
      {hint ? <p className="field__hint">{hint}</p> : null}
      {error ? (
        <p className="field__error" id={`${id}-err`} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function BusRequest({ vehicles }: { vehicles: VehicleOption[] }) {
  const sp = useSearchParams();
  const uid = useId();
  const t0 = useRef(0);
  useEffect(() => {
    t0.current = Date.now();
  }, []);
  const formTop = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);
  const [data, setData] = useState<Data>(() => ({
    fahrzeug: sp.get("fahrzeug") ?? "",
    anlass: sp.get("anlass") ?? "",
  }));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [msg, setMsg] = useState("");

  const set = (k: string, v: string) => {
    setData((d) => ({ ...d, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: "" }));
  };
  const id = (k: string) => `${uid}-${k}`;
  const inputProps = (k: string) => ({
    id: id(k),
    name: k,
    value: data[k] ?? "",
    onChange: (e: { target: { value: string } }) => set(k, e.target.value),
    "aria-invalid": errors[k] ? true : undefined,
    "aria-describedby": errors[k] ? `${id(k)}-err` : undefined,
  });

  const validate = (s: number) => {
    const e: Record<string, string> = {};
    for (const k of REQUIRED_BY_STEP[s]) if (!data[k] || data[k] === "false") e[k] = "Bitte ausfüllen.";
    if (s === 1 && data.personen && !(Number(data.personen) > 0 && Number(data.personen) < 10000)) e.personen = "Bitte eine Zahl angeben.";
    if (s === 4 && data.email && !EMAIL_RE.test(data.email)) e.email = "Bitte eine gültige E-Mail-Adresse angeben.";
    if (s === 0 && data.datum && data.datum < new Date().toISOString().slice(0, 10)) e.datum = "Das Datum liegt in der Vergangenheit.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const go = (to: number) => {
    if (to > step && !validate(step)) return;
    setStep(to);
    requestAnimationFrame(() => {
      formTop.current?.scrollIntoView({ block: "start" });
      formTop.current?.querySelector<HTMLElement>("input, select, textarea, button")?.focus({ preventScroll: true });
    });
  };

  const submit = async () => {
    if (!validate(5)) return;
    setState("sending");
    try {
      const res = await fetch("/api/anfrage", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ type: "bus", t0: t0.current, website: data.website ?? "", fields: data }),
      });
      const json = await res.json();
      if (json.ok) {
        setState("done");
      } else {
        setState("error");
        setMsg(json.error ?? "Bitte prüfen Sie Ihre Angaben.");
        if (json.errors) setErrors(json.errors);
      }
    } catch {
      setState("error");
      setMsg(`Die Anfrage konnte nicht gesendet werden. Bitte rufen Sie uns an: ${SITE.phone.display}.`);
    }
  };

  if (state === "done") {
    return (
      <div className="req-done" role="status">
        <span className="req-done__icon">
          <Icon name="check" size={32} />
        </span>
        <h2 className="h3">Danke – Ihre Anfrage ist bei uns.</h2>
        <p className="lead">Wir prüfen Fahrzeug und Route und melden uns mit einem unverbindlichen Angebot. In dringenden Fällen erreichen Sie uns unter {SITE.phone.display}.</p>
        <Link href="/" className="btn btn--outline">
          <span>Zur Startseite</span>
        </Link>
      </div>
    );
  }

  const summary = Object.entries(data).filter(([k, v]) => v && !["datenschutz", "website"].includes(k));

  return (
    <div className="req" ref={formTop}>
      <ol className="req__steps" role="list" aria-label="Schritte">
        {STEPS.map((s, i) => (
          <li key={s} className={i === step ? "is-current" : i < step ? "is-done" : ""} aria-current={i === step ? "step" : undefined}>
            <button type="button" onClick={() => (i < step ? go(i) : undefined)} disabled={i > step} tabIndex={i < step ? 0 : -1}>
              <span className="num">{String(i + 1).padStart(2, "0")}</span>
              <span className="req__step-l">{s}</span>
            </button>
          </li>
        ))}
      </ol>
      <div className="req__bar" aria-hidden="true">
        <span style={{ transform: `scaleX(${(step + 1) / STEPS.length})` }} />
      </div>

      <form
        className="req__form"
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          if (step < 5) go(step + 1);
          else void submit();
        }}
      >
        <fieldset className="req__panel" key={step}>
          <legend className="req__legend">
            <span className="num">{String(step + 1).padStart(2, "0")}</span> {STEPS[step]}
          </legend>

          {step === 0 ? (
            <div className="req__grid">
              <Field id={id("start")} label="Startort *" error={errors.start}>
                <input className="input" autoComplete="off" placeholder="z. B. Hannover, Rathaus" {...inputProps("start")} />
              </Field>
              <Field id={id("ziel")} label="Ziel *" error={errors.ziel}>
                <input className="input" autoComplete="off" placeholder="z. B. Hamburg, Messe" {...inputProps("ziel")} />
              </Field>
              <Field id={id("datum")} label="Datum *" error={errors.datum}>
                <input className="input" type="date" {...inputProps("datum")} />
              </Field>
              <Field id={id("uhrzeit")} label="Abfahrt (Uhrzeit)">
                <input className="input" type="time" {...inputProps("uhrzeit")} />
              </Field>
              <Field id={id("rueckdatum")} label="Rückfahrt am">
                <input className="input" type="date" {...inputProps("rueckdatum")} />
              </Field>
              <Field id={id("rueckzeit")} label="Rückfahrt um">
                <input className="input" type="time" {...inputProps("rueckzeit")} />
              </Field>
            </div>
          ) : null}

          {step === 1 ? (
            <div className="req__grid">
              <Field id={id("personen")} label="Personenzahl *" error={errors.personen} hint="Unsere Reisebusse haben 48 bis 80 Plätze. Für größere Gruppen setzen wir mehrere Busse ein.">
                <input className="input" type="number" inputMode="numeric" min={1} max={9999} {...inputProps("personen")} />
              </Field>
              <div className="field">
                <span className="field__label">Anlass</span>
                <div className="choice-row">
                  {ANLASS.map((a) => (
                    <label key={a} className={`choice-chip${data.anlass === a ? " is-on" : ""}`}>
                      <input type="radio" name="anlass" value={a} checked={data.anlass === a} onChange={() => set("anlass", a)} />
                      {a}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          ) : null}

          {step === 2 ? (
            <div className="field">
              <span className="field__label">Fahrtart *</span>
              <div className="choice-cards" role="radiogroup" aria-invalid={errors.fahrtart ? true : undefined}>
                {FAHRTART.map((f) => (
                  <label key={f.v} className={`choice-card${data.fahrtart === f.v ? " is-on" : ""}`}>
                    <input type="radio" name="fahrtart" value={f.v} checked={data.fahrtart === f.v} onChange={() => set("fahrtart", f.v)} />
                    <span className="choice-card__t">{f.v}</span>
                    <span className="choice-card__d">{f.d}</span>
                  </label>
                ))}
              </div>
              {errors.fahrtart ? (
                <p className="field__error" role="alert">
                  Bitte eine Fahrtart wählen.
                </p>
              ) : null}
            </div>
          ) : null}

          {step === 3 ? (
            <div className="req__grid">
              <Field id={id("fahrzeug")} label="Fahrzeugwunsch (optional)">
                <select className="select" {...inputProps("fahrzeug")}>
                  <option value="">Kein Wunsch – passend zur Gruppe</option>
                  {vehicles.map((v) => (
                    <option key={v.value} value={v.value}>
                      {v.label}
                    </option>
                  ))}
                </select>
              </Field>
              <Field id={id("ausstattung")} label="Anforderungen (optional)" hint="z. B. Gepäck, Rollstuhl, Catering, Tische, Zwischenstopps">
                <textarea className="textarea" rows={4} {...inputProps("ausstattung")} />
              </Field>
            </div>
          ) : null}

          {step === 4 ? (
            <div className="req__grid">
              <Field id={id("name")} label="Name *" error={errors.name}>
                <input className="input" autoComplete="name" {...inputProps("name")} />
              </Field>
              <Field id={id("firma")} label="Firma / Verein / Schule">
                <input className="input" autoComplete="organization" {...inputProps("firma")} />
              </Field>
              <Field id={id("email")} label="E-Mail *" error={errors.email}>
                <input className="input" type="email" autoComplete="email" {...inputProps("email")} />
              </Field>
              <Field id={id("telefon")} label="Telefon *" error={errors.telefon}>
                <input className="input" type="tel" autoComplete="tel" {...inputProps("telefon")} />
              </Field>
              <Field id={id("bemerkungen")} label="Nachricht">
                <textarea className="textarea" rows={4} {...inputProps("bemerkungen")} />
              </Field>
            </div>
          ) : null}

          {step === 5 ? (
            <div className="req__summary">
              <dl>
                {summary.map(([k, v]) => (
                  <div key={k}>
                    <dt>{FIELD_LABEL[k] ?? k}</dt>
                    <dd>{k.includes("datum") ? new Date(v + "T12:00:00").toLocaleDateString("de-DE") : (vehicles.find((x) => x.value === v && k === "fahrzeug")?.label ?? v)}</dd>
                  </div>
                ))}
              </dl>
              <label className="check">
                <input
                  type="checkbox"
                  checked={data.datenschutz === "true"}
                  onChange={(e) => set("datenschutz", e.target.checked ? "true" : "")}
                  aria-invalid={errors.datenschutz ? true : undefined}
                />
                <span>
                  Ich habe die <Link href="/datenschutz">Datenschutzerklärung</Link> zur Kenntnis genommen. Meine Angaben werden nur zur Bearbeitung
                  dieser Anfrage verwendet. *
                </span>
              </label>
              {errors.datenschutz ? (
                <p className="field__error" role="alert">
                  Bitte bestätigen Sie die Datenschutzerklärung.
                </p>
              ) : null}
            </div>
          ) : null}

          <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hp" aria-hidden="true" value={data.website ?? ""} onChange={(e) => set("website", e.target.value)} />
        </fieldset>

        {state === "error" ? (
          <p className="req__error" role="alert">
            {msg}
          </p>
        ) : null}

        <div className="req__nav">
          {step > 0 ? (
            <button type="button" className="btn btn--outline" onClick={() => go(step - 1)}>
              <Icon name="arrowLeft" className="btn__icon" />
              <span>Zurück</span>
            </button>
          ) : (
            <span />
          )}
          <button type="submit" className="btn btn--primary" disabled={state === "sending"}>
            <span>{step < 5 ? "Weiter" : state === "sending" ? "Wird gesendet …" : "Angebot anfragen"}</span>
            <Icon name="arrow" className="btn__icon" />
          </button>
        </div>
        <p className="req__note">* Pflichtfeld · Unverbindlich und kostenlos</p>
      </form>
    </div>
  );
}
