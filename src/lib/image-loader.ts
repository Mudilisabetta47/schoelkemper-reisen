/**
 * Bild-Loader für next/image.
 * - Reisebilder aus dem reise-CMS (/cms-media/…): das CMS skaliert selbst
 *   (?width=&height=), der Proxy reicht die gewünschte Breite durch.
 * - Eigene Bilder (/img/…): Standard-Optimierung (AVIF/WebP, auf Cloudflare
 *   über das Images-Binding).
 */
/** muss zu images.qualities in next.config.ts passen */
const QUALITIES = [60, 75, 85];
const snap = (q: number) => QUALITIES.reduce((a, b) => (Math.abs(b - q) < Math.abs(a - q) ? b : a));

export default function loader({ src, width, quality }: { src: string; width: number; quality?: number }) {
  if (src.startsWith("/cms-media/")) return `${src}?w=${width}`;
  return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${snap(quality ?? 75)}`;
}
