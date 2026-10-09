import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { Icon } from "@/components/ui/Icon";
import { REISECMS_BASE_URL } from "@/lib/reisecms";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Newsletter – keine Reise verpassen",
  description: "Der Scholkemper-Newsletter mit neuen Reisen und Angeboten. Anmeldung mit Bestätigungs-E-Mail (Double-Opt-In), Abmeldung jederzeit.",
  path: "/newsletter",
});

/**
 * Der Newsletter läuft weiter über das reise-CMS (dort ist das Double-Opt-In
 * mit Bestätigungslink umgesetzt). Die neue Website speichert keine Adressen.
 */
export default function NewsletterPage() {
  const url = `${process.env.REISECMS_NEWSLETTER_URL ?? `${REISECMS_BASE_URL}/newsletter/index.php`}`;
  return (
    <>
      <PageHero
        eyebrow="Newsletter"
        title={"Immer gut\ninformiert."}
        crumbs={[{ name: "Newsletter", path: "/newsletter" }]}
        lead={<p>Neue Reisen und Angebote von Scholkemper Reisen per E-Mail.</p>}
      />
      <section className="section section--tight">
        <div className="container container--narrow stack">
          <ol className="steps steps--compact" role="list">
            <li>
              <span className="steps__n num">01</span>
              <h2 className="h4">Anmelden</h2>
              <p>E-Mail-Adresse im Anmeldeformular eintragen.</p>
            </li>
            <li>
              <span className="steps__n num">02</span>
              <h2 className="h4">Bestätigen</h2>
              <p>Sie erhalten eine E-Mail mit Bestätigungslink. Erst nach dem Klick ist die Anmeldung abgeschlossen.</p>
            </li>
            <li>
              <span className="steps__n num">03</span>
              <h2 className="h4">Jederzeit abmelden</h2>
              <p>Über den Abmeldelink am Ende jedes Newsletters oder im Formular.</p>
            </li>
          </ol>
          <div>
            <a href={url} className="btn btn--primary" rel="noopener">
              <span>Zur Newsletter-Anmeldung</span>
              <Icon name="external" className="btn__icon" />
            </a>
          </div>
          <p className="muted">Die Anmeldung erfolgt über unser Buchungssystem (reise-CMS) mit Bestätigungs-E-Mail.</p>
        </div>
      </section>
    </>
  );
}
