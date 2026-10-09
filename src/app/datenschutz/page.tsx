import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { LegalNote } from "@/components/ui/Blocks";
import { datenschutz } from "@/content/legal";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Datenschutzerklärung",
  description: "Datenschutzerklärung der Scholkemper Reisen GmbH.",
  path: "/datenschutz",
});

export default function Page() {
  return (
    <>
      <PageHero title="Datenschutzerklärung" crumbs={[{ name: "Datenschutzerklärung", path: "/datenschutz" }]} />
      <section className="section section--tight">
        <div className="container container--narrow">
          <LegalNote />
          <div className="prose legal" dangerouslySetInnerHTML={{ __html: datenschutz }} />
        </div>
      </section>
    </>
  );
}
