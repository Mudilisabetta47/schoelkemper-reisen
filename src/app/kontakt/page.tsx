import type { Metadata } from "next";
import { Suspense } from "react";
import { InquiryForm } from "@/components/forms/InquiryForm";
import { PageHero } from "@/components/layout/PageHero";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { pageMeta } from "@/lib/seo";
import { SITE } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "Kontakt & Anfahrt – Busunternehmen in Ronnenberg-Empelde",
  description: `Scholkemper Reisen GmbH, ${SITE.address.street}, ${SITE.address.zip} ${SITE.address.city}-${SITE.address.district}. Telefon ${SITE.phone.display}, ${SITE.email}. Büro ${SITE.hours.label}.`,
  path: "/kontakt",
});

export default function KontaktPage() {
  return (
    <>
      <PageHero
        eyebrow="Kontakt"
        title={"Sprechen Sie\nmit uns."}
        crumbs={[{ name: "Kontakt", path: "/kontakt" }]}
        lead={<p>Buchungen und Anfragen nehmen wir telefonisch oder schriftlich entgegen. Für Busanfragen nutzen Sie am besten unser Anfrageformular.</p>}
      >
        <ButtonLink href="/busanfrage" variant="primary">
          Bus anfragen
        </ButtonLink>
      </PageHero>
      <section className="section section--tight">
        <div className="container contact">
          <div className="contact__cards">
            <a href={SITE.phone.href} className="ccard">
              <Icon name="phone" size={26} />
              <span className="label muted">Telefon</span>
              <span className="ccard__v">{SITE.phone.display}</span>
              <span className="muted">Büro {SITE.hours.label}</span>
            </a>
            <a href={`mailto:${SITE.email}`} className="ccard">
              <Icon name="mail" size={26} />
              <span className="label muted">E-Mail</span>
              <span className="ccard__v">{SITE.email}</span>
            </a>
            <a href={SITE.emergency.href} className="ccard">
              <Icon name="clock" size={26} />
              <span className="label muted">Notruf unterwegs (24 h)</span>
              <span className="ccard__v">{SITE.emergency.display}</span>
              <span className="muted">Nur in dringenden Fällen während der Reise</span>
            </a>
            <div className="ccard" id="anfahrt">
              <Icon name="pin" size={26} />
              <span className="label muted">Reisebüro &amp; Betriebshof</span>
              <address className="ccard__v">
                {SITE.legalName}
                <br />
                {SITE.address.street}
                <br />
                {SITE.address.zip} {SITE.address.city}-{SITE.address.district}
              </address>
              <a href={SITE.mapsUrl} target="_blank" rel="noopener" className="link-arrow">
                <span>Route planen</span>
                <Icon name="external" />
              </a>
              <span className="muted">Pkw-Stellplätze für Reisegäste am Betriebshof (begrenzt, bei Buchung angeben). Fax: {SITE.fax.display}</span>
            </div>
          </div>
          <div className="contact__form">
            <h2 className="h3">Nachricht schreiben</h2>
            <Suspense fallback={null}>
              <InquiryForm
                type="kontakt"
                submitLabel="Nachricht senden"
                doneText="Danke für Ihre Nachricht. Wir melden uns so bald wie möglich."
                fields={[
                  { name: "name", label: "Name", autoComplete: "name" },
                  { name: "email", label: "E-Mail", type: "email", autoComplete: "email" },
                  { name: "telefon", label: "Telefon", type: "tel", autoComplete: "tel" },
                  { name: "reise", label: "Betrifft Reise", fromQuery: "reise" },
                  { name: "nachricht", label: "Nachricht", type: "textarea", fromQuery: "reise" },
                ]}
              />
            </Suspense>
          </div>
        </div>
      </section>
    </>
  );
}
