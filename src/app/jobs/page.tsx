import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { Icon } from "@/components/ui/Icon";
import { JOBS } from "@/data/company";
import { abs, JsonLd, ORG_ID, pageMeta } from "@/lib/seo";
import { SITE } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "Jobs – Reisebusfahrer (m/w/d) in Hannover",
  description:
    "Stellenangebote bei Scholkemper Reisen in Ronnenberg-Empelde: Reisebusfahrer (m/w/d) in Vollzeit und Aushilfe, Fahrzeugpfleger (m/w/d).",
  path: "/jobs",
  image: "/img/fuhrpark/scania-57/cockpit.jpg",
});

export default function JobsPage() {
  const postings = JOBS.filter((j) => j.datePosted).map((j) => ({
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: j.title,
    description: `<p>${j.intro}</p><ul>${[...j.tasks, ...j.requirements].map((x) => `<li>${x}</li>`).join("")}</ul>`,
    datePosted: j.datePosted,
    employmentType: j.schemaEmployment,
    hiringOrganization: { "@id": ORG_ID, "@type": "Organization", name: SITE.legalName, sameAs: SITE.url },
    jobLocation: {
      "@type": "Place",
      address: { "@type": "PostalAddress", streetAddress: SITE.address.street, postalCode: SITE.address.zip, addressLocality: SITE.address.city, addressCountry: "DE" },
    },
    url: abs(`/jobs#${j.slug}`),
  }));
  return (
    <>
      <PageHero
        eyebrow="Stellenangebote"
        title={"Fahren Sie\nmit uns."}
        crumbs={[{ name: "Jobs", path: "/jobs" }]}
        image="/img/fuhrpark/scania-57/cockpit.jpg"
        imageAlt="Fahrerplatz in einem Scania Touring"
        lead={<p>Ein abwechslungsreicher Arbeitsplatz in einem engagierten Team und ein angenehmes Betriebsklima in einem mittelständischen Familienunternehmen.</p>}
      />
      <section className="section">
        <div className="container jobs">
          {JOBS.map((j) => (
            <article key={j.slug} id={j.slug} className="job">
              <header className="job__head">
                <div className="job__tags">
                  {j.employment.map((e) => (
                    <span key={e} className="chip">
                      {e}
                    </span>
                  ))}
                  <span className="chip">Ronnenberg-Empelde</span>
                </div>
                <h2 className="h3">{j.title}</h2>
                <p className="lead">{j.intro}</p>
              </header>
              <div className="job__cols">
                <div>
                  <h3 className="label">Ihre Aufgaben</h3>
                  <ul className="checklist checklist--plain" role="list">
                    {j.tasks.map((t) => (
                      <li key={t}>
                        <Icon name="check" size={18} /> {t}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="label">Was Sie mitbringen</h3>
                  <ul className="checklist checklist--plain" role="list">
                    {j.requirements.map((t) => (
                      <li key={t}>
                        <Icon name="check" size={18} /> {t}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              {j.notes.map((n) => (
                <p key={n} className="muted">
                  {n}
                </p>
              ))}
            </article>
          ))}
          <aside className="apply">
            <p className="eyebrow">Bewerbung</p>
            <h2 className="h3">Wir freuen uns auf Sie.</h2>
            <p>Bitte schicken Sie uns Ihre Unterlagen mit dem frühestmöglichen Eintrittstermin.</p>
            <address>
              {SITE.legalName}
              <br />
              {SITE.address.street}
              <br />
              {SITE.address.zip} {SITE.address.city}
            </address>
            <a href={`mailto:${SITE.email}?subject=Bewerbung`} className="btn btn--primary">
              <Icon name="mail" className="btn__icon" />
              <span>Per E-Mail bewerben</span>
            </a>
            <a href={SITE.phone.href} className="link-u">
              {SITE.phone.display}
            </a>
          </aside>
        </div>
      </section>
      {postings.length ? <JsonLd data={postings} /> : null}
    </>
  );
}
