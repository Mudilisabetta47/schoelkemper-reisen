import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { LegalNote } from "@/components/ui/Blocks";
import { reisebedingungen } from "@/content/legal";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Reisebedingungen Tagesfahrten",
  description: "Reisebedingungen für Tagesfahrten der Scholkemper Reisen GmbH.",
  path: "/reisebedingungen",
});

export default function Page() {
  return (
    <>
      <PageHero title="Reisebedingungen Tagesfahrten" crumbs={[{ name: "Reisebedingungen Tagesfahrten", path: "/reisebedingungen" }]} />
      <section className="section section--tight">
        <div className="container container--narrow">
          <LegalNote />
          <div className="prose legal" dangerouslySetInnerHTML={{ __html: reisebedingungen }} />
        </div>
      </section>
    </>
  );
}
