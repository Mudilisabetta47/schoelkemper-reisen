import { Suspense } from "react";
import { getCatalog } from "@/lib/reisecms";
import { TripCard, toCard } from "./TripCard";
import { TripExplorer } from "./TripExplorer";

/** Liste + Filter. Ohne JS/vor dem Laden: vollständige, crawlbare Liste aller Reisen. */
export async function TripsView({ fixedArt }: { fixedArt?: string }) {
  const catalog = await getCatalog();
  const cards = catalog.trips.map((t) => toCard(t, catalog.categories));
  const reiseart = catalog.categories.filter((c) => c.kind === "reiseart");
  const count = (slug: string) => cards.filter((c) => c.categories.includes(slug)).length;
  const categories = reiseart.map((c) => ({ value: c.slug, label: c.label, count: count(c.slug) })).filter((c) => c.count > 0);
  const countries = catalog.categories
    .filter((c) => c.kind === "land")
    .map((c) => ({ value: c.cmsName.toLowerCase(), label: c.label, count: cards.filter((t) => t.countries.includes(c.cmsName.toLowerCase())).length }));
  const scoped = fixedArt ? cards.filter((c) => c.categories.includes(fixedArt)) : cards;

  return (
    <Suspense
      fallback={
        <div className="explorer">
          <div className="explorer__grid explorer__grid--static">
            <div className="explorer__results">
              <p className="explorer__count">
                <strong className="num">{scoped.length}</strong> Reisen
              </p>
              <div className="tgrid">
                {scoped.map((t, i) => (
                  <TripCard key={t.slug} t={t} priority={i < 3} />
                ))}
              </div>
            </div>
          </div>
        </div>
      }
    >
      <TripExplorer trips={scoped} categories={categories} countries={countries} fixedArt={fixedArt} />
    </Suspense>
  );
}
