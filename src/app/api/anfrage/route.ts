import { EMAIL_RE, FIELD_LABEL, INQUIRY_LABEL, REQUIRED, type InquiryType } from "@/lib/inquiry";
import { SITE } from "@/lib/site";

/**
 * Anfragen (Bus, Kontakt, Gruppe, Katalog, Klassenfahrt) → E-Mail an das Büro.
 * Versand über Brevo Transactional API (EU, wie im Motion-/Technik-Handover).
 * Es wird nichts gespeichert. Spamschutz: Honeypot, Mindest-Ausfüllzeit,
 * einfache Ratenbegrenzung pro IP, Origin-Prüfung.
 *
 * ENV: BREVO_API_KEY, MAIL_TO (Standard: info@scholkemper-reisen.de), MAIL_FROM
 */
const hits = new Map<string, number[]>();
const LIMIT = 5;
const WINDOW = 10 * 60 * 1000;

function rateLimited(ip: string) {
  const now = Date.now();
  const list = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW);
  list.push(now);
  hits.set(ip, list);
  return list.length > LIMIT;
}

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

export async function POST(req: Request) {
  const origin = req.headers.get("origin");
  const host = req.headers.get("host");
  if (origin && host && new URL(origin).host !== host) {
    return Response.json({ ok: false, error: "Ungültige Herkunft." }, { status: 403 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false, error: "Ungültige Anfrage." }, { status: 400 });
  }

  const type = String(body.type ?? "") as InquiryType;
  if (!(type in REQUIRED)) return Response.json({ ok: false, error: "Unbekanntes Formular." }, { status: 400 });

  // Honeypot + Zeitprüfung: Bots füllen "website" aus oder senden in < 3 s
  if (body.website || Date.now() - Number(body.t0 ?? 0) < 3000) {
    return Response.json({ ok: true });
  }

  const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "local";
  if (rateLimited(ip)) {
    return Response.json({ ok: false, error: "Zu viele Anfragen. Bitte versuchen Sie es später erneut oder rufen Sie uns an." }, { status: 429 });
  }

  const fields: Record<string, string> = {};
  for (const [k, v] of Object.entries((body.fields ?? {}) as Record<string, unknown>)) {
    if (typeof v === "string" || typeof v === "number" || typeof v === "boolean") fields[k] = String(v).slice(0, 4000).trim();
  }
  const errors: Record<string, string> = {};
  for (const k of REQUIRED[type]) if (!fields[k] || fields[k] === "false") errors[k] = "Pflichtfeld";
  if (fields.email && !EMAIL_RE.test(fields.email)) errors.email = "Bitte eine gültige E-Mail-Adresse angeben.";
  if (fields.personen && !/^\d{1,4}$/.test(fields.personen)) errors.personen = "Bitte eine Zahl angeben.";
  if (Object.keys(errors).length) return Response.json({ ok: false, errors }, { status: 422 });

  const rows = Object.entries(fields)
    .filter(([k]) => k !== "datenschutz")
    .map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;color:#666">${esc(FIELD_LABEL[k] ?? k)}</td><td style="padding:4px 0"><b>${esc(v).replace(/\n/g, "<br>")}</b></td></tr>`)
    .join("");
  const subject = `${INQUIRY_LABEL[type]} über die Website – ${fields.name ?? ""}`.trim();
  const html = `<h2 style="font-family:sans-serif">${esc(INQUIRY_LABEL[type])}</h2><table style="font-family:sans-serif;font-size:14px">${rows}</table><p style="font-family:sans-serif;color:#888;font-size:12px">Datenschutz-Einwilligung erteilt am ${new Date().toLocaleString("de-DE", { timeZone: "Europe/Berlin" })}.</p>`;

  const key = process.env.BREVO_API_KEY;
  if (!key) {
    if (process.env.NODE_ENV !== "production") {
      console.info("[anfrage] (Testmodus, kein BREVO_API_KEY) ", subject, fields);
      return Response.json({ ok: true, test: true });
    }
    return Response.json(
      { ok: false, error: `Der Versand ist gerade nicht möglich. Bitte rufen Sie uns an (${SITE.phone.display}) oder schreiben Sie an ${SITE.email}.` },
      { status: 503 },
    );
  }

  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: { "api-key": key, "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({
      sender: { email: process.env.MAIL_FROM ?? "website@scholkemper-reisen.de", name: "Website Scholkemper Reisen" },
      to: [{ email: process.env.MAIL_TO ?? SITE.email }],
      replyTo: fields.email ? { email: fields.email, name: fields.name } : undefined,
      subject,
      htmlContent: html,
    }),
    signal: AbortSignal.timeout(12000),
  }).catch(() => null);

  if (!res || !res.ok) {
    return Response.json(
      { ok: false, error: `Der Versand hat nicht geklappt. Bitte rufen Sie uns an (${SITE.phone.display}).` },
      { status: 502 },
    );
  }
  return Response.json({ ok: true });
}
