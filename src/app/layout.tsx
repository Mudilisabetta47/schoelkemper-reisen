import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Open_Sans } from "next/font/google";
import { BottomBar } from "@/components/layout/BottomBar";
import { Footer } from "@/components/layout/Footer";
import { Header, type HeaderData } from "@/components/layout/Header";
import { fmtDate, fmtPrice, nextVariant } from "@/lib/format";
import { getCatalog } from "@/lib/reisecms";
import { JsonLd, organizationLd, websiteLd } from "@/lib/seo";
import { SITE } from "@/lib/site";
import { MotionRoot } from "@/motion/react";
import "@/styles/tokens.css";
import "@/styles/base.css";
import "@/styles/motion.css";
import "@/styles/layout.css";
import "@/styles/sections.css";
import "@/styles/pages.css";
import "@/styles/content.css";

/* Schriften werden beim Build selbst gehostet – keine Verbindung zu Google beim Seitenaufruf */
const openSans = Open_Sans({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-open-sans",
  display: "swap",
});
const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["italic"],
  variable: "--font-instrument",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "Scholkemper Reisen – Busreisen & Busvermietung in Hannover",
    template: "%s | Scholkemper Reisen",
  },
  description:
    "Busreisen, Tagesfahrten und Busvermietung aus Ronnenberg-Empelde bei Hannover. Reisebusse mit 48 bis 80 Plätzen – für Gruppen, Vereine, Schulen und Transfers.",
  applicationName: SITE.name,
  formatDetection: { telephone: false },
  icons: { icon: [{ url: "/icon.svg", type: "image/svg+xml" }] },
};

export const viewport: Viewport = {
  themeColor: "#992233",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

async function headerData(): Promise<{ header: HeaderData; footerCats: { slug: string; label: string }[] }> {
  const catalog = await getCatalog();
  const reiseart = catalog.categories.filter((c) => c.kind === "reiseart");
  const count = (slug: string) => catalog.trips.filter((t) => t.categories.includes(slug)).length;
  const cats = reiseart.map((c) => ({ slug: c.slug, label: c.label, count: count(c.slug) })).filter((c) => c.count > 0);
  const next = catalog.trips.find((t) => t.variants.some((v) => v.status === "verfuegbar") && t.images.length);
  const v = next ? nextVariant(next) : undefined;
  return {
    header: {
      categories: cats,
      tripCount: catalog.trips.length,
      featured:
        next && v
          ? {
              slug: next.slug,
              title: next.title,
              date: fmtDate(v.start, "weekday"),
              price: `ab ${fmtPrice(next.priceFrom)}`,
              image: next.images[0]?.path,
            }
          : undefined,
    },
    footerCats: cats,
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { header, footerCats } = await headerData();
  return (
    <html lang="de" className={`${openSans.variable} ${instrument.variable}`} suppressHydrationWarning>
      <head>
        {/* Motion-Zustand vor dem ersten Paint setzen (kein Aufblitzen versteckter Reveals) */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(d){d.classList.add('js');try{if(matchMedia('(prefers-reduced-motion: reduce)').matches)d.dataset.motion='reduced'}catch(e){}})(document.documentElement)",
          }}
        />
      </head>
      <body>
        <a href="#main" className="skip-link">
          Zum Inhalt springen
        </a>
        <Header data={header} />
        <main id="main">{children}</main>
        <Footer categories={footerCats} />
        <BottomBar />
        <MotionRoot />
        <JsonLd data={[organizationLd(), websiteLd()]} />
      </body>
    </html>
  );
}
