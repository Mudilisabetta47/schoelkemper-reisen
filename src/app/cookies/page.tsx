import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { LegalNote } from "@/components/ui/Blocks";
import { cookies } from "@/content/legal";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Cookieinformationen",
  description: "Informationen zu Cookies auf der Website von Scholkemper Reisen.",
  path: "/cookies",
});

export default function Page() {
  return (
    <>
      <PageHero title="Cookieinformationen" crumbs={[{ name: "Cookieinformationen", path: "/cookies" }]} />
      <section className="section section--tight">
        <div className="container container--narrow">
          <LegalNote />
          <div className="prose legal" dangerouslySetInnerHTML={{ __html: cookies }} />
        </div>
      </section>
    </>
  );
}
