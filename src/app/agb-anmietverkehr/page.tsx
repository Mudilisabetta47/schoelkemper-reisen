import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { LegalNote } from "@/components/ui/Blocks";
import { agb_anmietverkehr } from "@/content/legal";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "AGB Anmietverkehr",
  description: "Allgemeine Geschäftsbedingungen für den Anmietverkehr (Busvermietung) der Scholkemper Reisen GmbH.",
  path: "/agb-anmietverkehr",
});

export default function Page() {
  return (
    <>
      <PageHero title="AGB Anmietverkehr" crumbs={[{ name: "AGB Anmietverkehr", path: "/agb-anmietverkehr" }]} />
      <section className="section section--tight">
        <div className="container container--narrow">
          <LegalNote />
          <div className="prose legal" dangerouslySetInnerHTML={{ __html: agb_anmietverkehr }} />
        </div>
      </section>
    </>
  );
}
