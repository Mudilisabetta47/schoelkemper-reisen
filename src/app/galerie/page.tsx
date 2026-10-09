import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { GalleryAlbum, type Album } from "@/components/ui/GalleryAlbum";
import { Pic } from "@/components/ui/Pic";
import galerie from "@/data/galerie.json";
import { pageMeta } from "@/lib/seo";
import { SITE } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "Bildergalerie – unterwegs fotografiert",
  description:
    "Bilder von Scholkemper-Reisen: Tessin, Costa Brava, Venedig, Keukenhof, Harz im Schnee, Mosel – und Busse im Einsatz für Atlético Madrid und die EuroDeaf 2015.",
  path: "/galerie",
  image: "/img/galerie/lido-de-jesolo-venedig/05.jpg",
});

export default function GaleriePage() {
  const albums = galerie as Album[];
  return (
    <>
      <PageHero
        eyebrow="Bildergalerie"
        title={"Unterwegs\nfotografiert."}
        crumbs={[{ name: "Galerie", path: "/galerie" }]}
        lead={
          <p>
            Was man mit Scholkemper erleben kann. Sie waren mit uns unterwegs und haben schöne Bilder? Schicken Sie sie an{" "}
            <a href={`mailto:${SITE.email}`}>{SITE.email}</a> – gern veröffentlichen wir sie.
          </p>
        }
      />
      <nav className="album-rail" aria-label="Alben" data-native-scroll>
        <ul role="list">
          {albums.map((a) => (
            <li key={a.slug}>
              <a href={`#${a.slug}`} className="album-rail__card">
                <span className="album-rail__img">
                  <Pic src={a.images[0]} alt="" fill sizes="280px" />
                </span>
                <span className="album-rail__t">{a.title}</span>
                <span className="album-rail__c num">{a.images.length} Fotos</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <div className="container albums">
        {albums.map((a, i) => (
          <GalleryAlbum key={a.slug} album={a} index={i} />
        ))}
      </div>
    </>
  );
}
