import type { Metadata } from "next";
import { BusJourney } from "@/components/home/BusJourney";
import { DestinationRail, type RailItem } from "@/components/home/DestinationRail";
import { FleetStory, SkylinerMoment } from "@/components/home/FleetStory";
import { Hero } from "@/components/home/Hero";
import { ReiseFinder, type FinderTrip } from "@/components/home/ReiseFinder";
import {
  CharterSection,
  FinaleSection,
  GroupsSection,
  InspirationSection,
  ShuttleSection,
  WhySection,
} from "@/components/home/Sections";
import { FLEET } from "@/data/fleet";
import { fmtDate, fmtDays, fmtMonth, fmtPrice, monthKey, nextVariant, plainText, STATUS_LABEL, tripStatus } from "@/lib/format";
import { getCatalog } from "@/lib/reisecms";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Scholkemper Reisen – Busreisen & Busvermietung in Hannover",
  description:
    "Busunternehmen aus Ronnenberg-Empelde bei Hannover: Tagesfahrten, Mehrtagesreisen, Gruppenreisen und Busvermietung mit Fahrer – Reisebusse mit 48 bis 80 Plätzen.",
  path: "/",
  absoluteTitle: true,
});

export default async function HomePage() {
  const catalog = await getCatalog();
  const cats = catalog.categories.filter((c) => c.kind === "reiseart");
  const catLabel = (slug: string) => cats.find((c) => c.slug === slug)?.label;

  const finderTrips: FinderTrip[] = catalog.trips.map((t) => ({
    title: t.title,
    text: [t.title, t.subtitle, t.teaser ? plainText(t.teaser) : "", ...t.countries, ...t.categories].join(" ").toLowerCase(),
    categories: t.categories,
    months: [...new Set(t.variants.map((v) => monthKey(v.start)))],
    days: t.days,
  }));
  const months = [...new Set(catalog.trips.flatMap((t) => t.variants.map((v) => monthKey(v.start))))]
    .sort()
    .map((key) => ({ key, label: fmtMonth(key) }));

  const rail: RailItem[] = catalog.trips.slice(0, 10).map((t) => {
    const v = nextVariant(t);
    const st = tripStatus(t);
    const specific = t.categories.find((c) => c !== "tagesfahrten") ?? t.categories[0];
    return {
      slug: t.slug,
      title: t.title,
      subtitle: t.subtitle,
      image: t.images[0]?.path,
      credit: t.images[0]?.credit,
      dateLabel: fmtDate(v.start, "weekday"),
      moreDates: t.variants.length - 1,
      daysLabel: fmtDays(t.days),
      price: fmtPrice(t.priceFrom),
      priceLabel: t.priceLabel,
      status: st,
      statusLabel: STATUS_LABEL[st],
      category: specific ? catLabel(specific) : undefined,
      isNew: t.isNew,
    };
  });

  const story = FLEET.filter((b) => b.images.length > 0 && b.slug !== "neoplan-skyliner-76");
  const skyliners = FLEET.filter((b) => b.model === "Skyliner");

  return (
    <>
      <Hero />
      <ReiseFinder trips={finderTrips} categories={cats.map((c) => ({ slug: c.slug, label: c.label }))} months={months} />
      <DestinationRail items={rail} total={catalog.trips.length} />
      <CharterSection />
      <BusJourney />
      <FleetStory buses={story} />
      <SkylinerMoment buses={skyliners} />
      <GroupsSection />
      <ShuttleSection />
      <WhySection />
      <InspirationSection />
      <FinaleSection />
    </>
  );
}
