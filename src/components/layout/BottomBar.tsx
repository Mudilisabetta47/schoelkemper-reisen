"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/ui/Icon";
import { SITE } from "@/lib/site";

/** Mobile: feste Aktionen am unteren Rand. Auf Reisedetailseiten übernimmt die Buchungsleiste. */
export function BottomBar() {
  const pathname = usePathname();
  const parts = pathname.split("/").filter(Boolean);
  const onTrip = parts[0] === "reisen" && parts.length === 2;
  const onRequest = pathname.startsWith("/busanfrage");
  if (onTrip || onRequest) return null;
  return (
    <nav className="bottombar" aria-label="Schnellzugriff">
      <Link href="/reisen" className="bottombar__item">
        <Icon name="search" />
        <span>Reisen</span>
      </Link>
      <Link href="/busanfrage" className="bottombar__item bottombar__item--primary">
        <Icon name="bus" />
        <span>Bus anfragen</span>
      </Link>
      <a href={SITE.phone.href} className="bottombar__item bottombar__item--icon" aria-label={`Anrufen: ${SITE.phone.display}`}>
        <Icon name="phone" />
      </a>
    </nav>
  );
}
