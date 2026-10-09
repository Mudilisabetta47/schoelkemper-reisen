import Image, { type ImageProps } from "next/image";
import dims from "@/data/media-dims.json";

const DIMS = dims as unknown as Record<string, [number, number]>;

export function picSize(src: string): { width: number; height: number } {
  const d = DIMS[src];
  return d ? { width: d[0], height: d[1] } : { width: 1600, height: 1200 };
}

/**
 * Lokales Bild (public/img) mit bekannten Maßen → kein Layout-Shift.
 * AVIF/WebP und responsive Größen erzeugt next/image.
 */
export function Pic({
  src,
  alt,
  sizes = "100vw",
  fill,
  className,
  ...rest
}: Omit<ImageProps, "src" | "width" | "height"> & { src: string; alt: string }) {
  if (fill) return <Image src={src} alt={alt} fill sizes={sizes} className={className} {...rest} />;
  const { width, height } = picSize(src);
  return <Image src={src} alt={alt} width={width} height={height} sizes={sizes} className={className} {...rest} />;
}

/** Bild aus dem reise-CMS – läuft über den eigenen Proxy /cms-media (Hotlink-Schutz des CMS) */
export function cmsSrc(path: string) {
  return `/cms-media${path.startsWith("/") ? path : `/${path}`}`;
}

export function CmsPic({
  path,
  alt,
  sizes = "100vw",
  className,
  ...rest
}: Omit<ImageProps, "src" | "fill"> & { path: string; alt: string }) {
  return <Image src={cmsSrc(path)} alt={alt} fill sizes={sizes} className={className} {...rest} />;
}
