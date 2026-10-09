"use client";

import { Lightbox } from "./Lightbox";
import { Pic } from "./Pic";

export interface Album {
  slug: string;
  title: string;
  intro: string;
  updated: string;
  images: string[];
}

/** Editorial Masonry + Vollbild-Ansicht für ein Album */
export function GalleryAlbum({ album, index }: { album: Album; index: number }) {
  const images = album.images.map((src, i) => ({ src, alt: `${album.title} – Bild ${i + 1}`, caption: album.title }));
  return (
    <section id={album.slug} className="album">
      <header className="album__head">
        <span className="album__n num">{String(index + 1).padStart(2, "0")}</span>
        <h2 className="h3">{album.title}</h2>
        {album.intro ? <p className="muted">{album.intro}</p> : null}
        <p className="album__count">{album.images.length} Fotos</p>
      </header>
      <Lightbox
        images={images}
        render={(open) => (
          <ul className="masonry" role="list">
            {images.map((img, i) => (
              <li key={img.src} data-reveal="up" style={{ ["--rv-delay" as string]: `${(i % 4) * 60}ms` }}>
                <button type="button" className="masonry__btn" onClick={() => open(i)} aria-label={`${img.alt} vergrößern`} data-cursor="view" data-cursor-label="Ansehen">
                  <Pic src={img.src} alt={img.alt} sizes="(min-width: 1100px) 25vw, (min-width: 700px) 33vw, 50vw" />
                </button>
              </li>
            ))}
          </ul>
        )}
      />
    </section>
  );
}
