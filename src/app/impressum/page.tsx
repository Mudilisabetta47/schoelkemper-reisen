import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { LegalNote } from "@/components/ui/Blocks";
import { impressum } from "@/content/legal";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Impressum",
  description: "Impressum der Scholkemper Reisen GmbH, Apollostraße 10, 30952 Ronnenberg-Empelde.",
  path: "/impressum",
});

export default function Page() {
  return (
    <>
      <PageHero title="Impressum" crumbs={[{ name: "Impressum", path: "/impressum" }]} />
      <section className="section section--tight">
        <div className="container container--narrow">
          <LegalNote />
          <div className="prose legal" dangerouslySetInnerHTML={{ __html: impressum }} />
        </div>
      </section>
    </>
  );
}
