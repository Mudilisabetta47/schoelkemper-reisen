import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { InquiryForm } from "@/components/forms/InquiryForm";
import { PageHero } from "@/components/layout/PageHero";
import { Icon } from "@/components/ui/Icon";
import { Pic } from "@/components/ui/Pic";
import { pageMeta } from "@/lib/seo";

const PDF = "/downloads/scholkemper-flyer-januar-mai-2026.pdf";

export const metadata: Metadata = pageMeta({
  title: "Reisekatalog – ansehen, herunterladen, bestellen",
  description: "Der Reisekalender von Scholkemper Reisen als PDF zum Download – oder kostenlos per Post bestellen.",
  path: "/reisekatalog",
  image: "/img/brand/flyer-januar-mai-2026.jpg",
});

export default function KatalogPage() {
  return (
    <>
      <PageHero
        eyebrow="Reisekatalog"
        title={"Zum Blättern\nund Mitnehmen."}
        crumbs={[{ name: "Reisekatalog", path: "/reisekatalog" }]}
        lead={<p>Alle Reiseausschreibungen gibt es als Download. Wenn Sie Ihr Exemplar lieber in der Hand halten, schicken wir es Ihnen kostenlos zu.</p>}
      />
      <section className="section section--tight">
        <div className="container catalog">
          <a href={PDF} className="catalog__cover" target="_blank" rel="noopener" data-cursor="view" data-cursor-label="PDF">
            <Pic src="/img/brand/flyer-januar-mai-2026.jpg" alt="Reisekalender Januar bis Mai 2026 von Scholkemper Reisen" sizes="(min-width: 900px) 40vw, 100vw" />
          </a>
          <div className="catalog__body stack">
            <p className="eyebrow">Aktuell</p>
            <h2 className="h3">Flyer Januar–Mai 2026</h2>
            <p className="muted">Reisekalender mit Terminen, Leistungen und Preisen. PDF, 1 Seite.</p>
            <div className="catalog__ctas">
              <a href={PDF} target="_blank" rel="noopener" className="btn btn--primary">
                <Icon name="doc" className="btn__icon" />
                <span>PDF öffnen</span>
              </a>
              <a href={PDF} download className="btn btn--outline">
                <Icon name="download" className="btn__icon" />
                <span>Herunterladen</span>
              </a>
            </div>
            <p className="muted">Die aktuellsten Termine finden Sie immer unter <Link href="/reisen">Reisen</Link>.</p>
          </div>
        </div>
      </section>
      <section className="section section--soft" id="bestellen">
        <div className="container form-layout">
          <div className="stack">
            <p className="eyebrow">Katalog bestellen</p>
            <h2 className="h2">Kostenlos per Post.</h2>
            <p className="lead">Wir freuen uns auf ein erstes Kennenlernen oder Wiedersehen in unseren Bussen.</p>
          </div>
          <Suspense fallback={null}>
            <InquiryForm
              type="katalog"
              submitLabel="Katalog bestellen"
              doneTitle="Danke – der Katalog kommt per Post."
              fields={[
                { name: "anrede", label: "Anrede", type: "select", options: ["Frau", "Herr", "Keine Angabe"] },
                { name: "name", label: "Name", autoComplete: "name" },
                { name: "strasse", label: "Straße, Nr.", autoComplete: "street-address" },
                { name: "ort", label: "PLZ, Ort", autoComplete: "postal-code" },
                { name: "telefon", label: "Telefon", type: "tel", autoComplete: "tel" },
                { name: "email", label: "E-Mail", type: "email", autoComplete: "email" },
                { name: "nachricht", label: "Mitteilung", type: "textarea" },
              ]}
            />
          </Suspense>
        </div>
      </section>
    </>
  );
}
