"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useId, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { EMAIL_RE, REQUIRED, type InquiryType } from "@/lib/inquiry";
import { SITE } from "@/lib/site";

export interface FieldDef {
  name: string;
  label: string;
  type?: "text" | "email" | "tel" | "date" | "number" | "textarea" | "select";
  options?: string[];
  wide?: boolean;
  autoComplete?: string;
  placeholder?: string;
  hint?: string;
  /** Vorbelegung aus ?param= */
  fromQuery?: string;
}

export function InquiryForm({
  type,
  fields,
  submitLabel = "Anfrage senden",
  doneTitle = "Danke – wir melden uns.",
  doneText,
}: {
  type: InquiryType;
  fields: FieldDef[];
  submitLabel?: string;
  doneTitle?: string;
  doneText?: string;
}) {
  const sp = useSearchParams();
  const uid = useId();
  const t0 = useRef(Date.now());
  const required = new Set(REQUIRED[type]);
  const [data, setData] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    for (const f of fields) {
      const q = f.fromQuery ? sp.get(f.fromQuery) : null;
      if (q) init[f.name] = f.name === "nachricht" ? `Frage zur Reise „${q}“:\n` : q;
    }
    return init;
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [msg, setMsg] = useState("");

  const set = (k: string, v: string) => {
    setData((d) => ({ ...d, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: "" }));
  };

  const submit = async () => {
    const e: Record<string, string> = {};
    for (const k of required) if (!data[k]) e[k] = k === "datenschutz" ? "Bitte bestätigen Sie die Datenschutzerklärung." : "Bitte ausfüllen.";
    if (data.email && !EMAIL_RE.test(data.email)) e.email = "Bitte eine gültige E-Mail-Adresse angeben.";
    setErrors(e);
    if (Object.keys(e).length) {
      document.getElementById(`${uid}-${Object.keys(e)[0]}`)?.focus();
      return;
    }
    setState("sending");
    try {
      const res = await fetch("/api/anfrage", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ type, t0: t0.current, website: data.website ?? "", fields: data }),
      });
      const json = await res.json();
      if (json.ok) setState("done");
      else {
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
        <h2 className="h3">{doneTitle}</h2>
        {doneText ? <p className="lead">{doneText}</p> : null}
      </div>
    );
  }

  return (
    <form
      className="iform"
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        void submit();
      }}
    >
      <div className="req__grid">
        {fields.map((f) => {
          const id = `${uid}-${f.name}`;
          const req = required.has(f.name);
          const common = {
            id,
            name: f.name,
            value: data[f.name] ?? "",
            "aria-invalid": errors[f.name] ? true : undefined,
            "aria-describedby": errors[f.name] ? `${id}-err` : undefined,
            onChange: (e: { target: { value: string } }) => set(f.name, e.target.value),
          };
          return (
            <div key={f.name} className={`field${f.wide || f.type === "textarea" ? " field--wide" : ""}`}>
              <label htmlFor={id}>
                {f.label}
                {req ? " *" : ""}
              </label>
              {f.type === "textarea" ? (
                <textarea className="textarea" rows={5} placeholder={f.placeholder} {...common} />
              ) : f.type === "select" ? (
                <select className="select" {...common}>
                  <option value="">Bitte wählen</option>
                  {f.options?.map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              ) : (
                <input className="input" type={f.type ?? "text"} autoComplete={f.autoComplete} placeholder={f.placeholder} {...common} />
              )}
              {f.hint ? <p className="field__hint">{f.hint}</p> : null}
              {errors[f.name] ? (
                <p className="field__error" id={`${id}-err`} role="alert">
                  {errors[f.name]}
                </p>
              ) : null}
            </div>
          );
        })}
      </div>
      <label className="check iform__consent">
        <input
          id={`${uid}-datenschutz`}
          type="checkbox"
          checked={data.datenschutz === "true"}
          onChange={(e) => set("datenschutz", e.target.checked ? "true" : "")}
          aria-invalid={errors.datenschutz ? true : undefined}
        />
        <span>
          Ich habe die <Link href="/datenschutz">Datenschutzerklärung</Link> zur Kenntnis genommen. Meine Angaben werden nur zur Bearbeitung dieser
          Anfrage verwendet. *
        </span>
      </label>
      {errors.datenschutz ? (
        <p className="field__error" role="alert">
          {errors.datenschutz}
        </p>
      ) : null}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hp" aria-hidden="true" value={data.website ?? ""} onChange={(e) => set("website", e.target.value)} />
      {state === "error" ? (
        <p className="req__error" role="alert">
          {msg}
        </p>
      ) : null}
      <div className="iform__foot">
        <button type="submit" className="btn btn--primary" disabled={state === "sending"}>
          <span>{state === "sending" ? "Wird gesendet …" : submitLabel}</span>
          <Icon name="arrow" className="btn__icon" />
        </button>
        <p className="req__note">* Pflichtfeld</p>
      </div>
    </form>
  );
}
