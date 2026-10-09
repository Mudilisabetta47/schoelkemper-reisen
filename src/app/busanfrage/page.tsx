import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHero } from "@/components/layout/PageHero";
import { BusRequest } from "@/components/forms/BusRequest";
import { Icon } from "@/components/ui/Icon";
import { FLEET } from "@/data/fleet";
import { pageMeta } from "@/lib/seo";
import { SITE } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "Bus anfragen – Angebot für Ihre Busfahrt",
  description: "Reisebus mit Fahrer in Hannover anfragen: Fahrt, Gruppe und Wünsche angeben – Sie erhalten ein unverbindliches Angebot von Scholkemper Reisen.",
  path: "/busanfrage",
});

export default function BusanfragePage() {
  const vehicles = [
    { value: "doppeldecker", label: "Doppeldecker (76 oder 80 Plätze)" },
    ...FLEET.map((b) => ({ value: b.slug, label: `${b.name} – ${b.seatsLabel}` })),
  ];
  return (
    <>
      <PageHero
        eyebrow="Bus anfragen"
        title={"Ihre Fahrt.\nUnser Angebot."}
        crumbs={[{ name: "Bus anfragen", path: "/busanfrage" }]}
        lead={<p>In sechs kurzen Schritten. Unverbindlich und kostenlos – wir melden uns mit einem Angebot.</p>}
      />
      <section className="section section--tight">
        <div className="container req-layout">
          <Suspense fallback={<div className="req req--loading" />}>
            <BusRequest vehicles={vehicles} />
          </Suspense>
          <aside className="req-aside">
            <p className="label">Lieber persönlich?</p>
            <a href={SITE.phone.href} className="req-aside__phone">
              <Icon name="phone" /> {SITE.phone.display}
            </a>
            <p className="muted">Büro {SITE.hours.label}</p>
            <a href={`mailto:${SITE.email}`} className="link-u">
              {SITE.email}
            </a>
            <hr />
            <ul className="req-aside__facts" role="list">
              <li>
                <Icon name="bus" size={18} /> Reisebusse mit 48 bis 80 Plätzen
              </li>
              <li>
                <Icon name="shield" size={18} /> Euro 6, Sicherheitsgurte, Klimaanlage
              </li>
              <li>
                <Icon name="users" size={18} /> Fahrer auf Wunsch mit Englisch oder Spanisch
              </li>
            </ul>
          </aside>
        </div>
      </section>
    </>
  );
}
