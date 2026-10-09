/**
 * Gemeinsame Definition der Anfrageformulare (Client-Rückmeldung + Server-Prüfung).
 * Die Server-Prüfung in app/api/anfrage/route.ts ist maßgeblich.
 */
export type InquiryType = "bus" | "kontakt" | "gruppe" | "katalog" | "klassenfahrt";

export const INQUIRY_LABEL: Record<InquiryType, string> = {
  bus: "Busanfrage",
  kontakt: "Kontaktanfrage",
  gruppe: "Gruppen- / Vereinsreise",
  katalog: "Katalogbestellung",
  klassenfahrt: "Klassenfahrt",
};

/** Pflichtfelder je Formular */
export const REQUIRED: Record<InquiryType, string[]> = {
  bus: ["start", "ziel", "datum", "personen", "fahrtart", "name", "email", "telefon", "datenschutz"],
  kontakt: ["name", "email", "nachricht", "datenschutz"],
  gruppe: ["ziel", "abfahrt", "personen", "name", "email", "telefon", "datenschutz"],
  katalog: ["name", "strasse", "ort", "datenschutz"],
  klassenfahrt: ["schule", "ziel", "datum", "personen", "name", "email", "telefon", "datenschutz"],
};

/** Lesbare Feldnamen für E-Mail und Zusammenfassung */
export const FIELD_LABEL: Record<string, string> = {
  start: "Startort",
  ziel: "Ziel",
  datum: "Datum",
  uhrzeit: "Uhrzeit",
  rueckdatum: "Rückfahrt am",
  rueckzeit: "Rückfahrt um",
  personen: "Personenzahl",
  fahrtart: "Fahrtart",
  fahrzeug: "Fahrzeugwunsch",
  ausstattung: "Anforderungen",
  anlass: "Anlass",
  abfahrt: "Abfahrt",
  rueckkehr: "Rückkehr",
  gruppenname: "Gruppe / Verein",
  alter: "Alter der Teilnehmer",
  unterkunft: "Unterkunft",
  schule: "Schule / Einrichtung",
  klasse: "Klasse / Gruppe",
  anrede: "Anrede",
  name: "Name",
  firma: "Firma / Verein",
  strasse: "Straße, Nr.",
  ort: "PLZ, Ort",
  email: "E-Mail",
  telefon: "Telefon",
  reise: "Reise",
  nachricht: "Nachricht",
  bemerkungen: "Bemerkungen",
};

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
