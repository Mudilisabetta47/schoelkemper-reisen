import Link from "next/link";
import type { ReactNode } from "react";
import { Icon, type IconName } from "./Icon";

type Variant = "primary" | "light" | "ghost" | "outline" | "dark";

export function ButtonLink({
  href,
  children,
  variant = "primary",
  size,
  icon = "arrow",
  magnetic = true,
  className,
  cursor,
  external,
  prefetch,
}: {
  href: string;
  children: ReactNode;
  variant?: Variant;
  size?: "sm";
  icon?: IconName | null;
  magnetic?: boolean;
  className?: string;
  cursor?: string;
  external?: boolean;
  prefetch?: boolean;
}) {
  const cls = `btn btn--${variant}${size ? ` btn--${size}` : ""}${className ? ` ${className}` : ""}`;
  const inner = (
    <>
      <span>{children}</span>
      {icon ? <Icon name={icon} className="btn__icon" /> : null}
    </>
  );
  const common = {
    className: cls,
    "data-magnetic": magnetic ? "0.25" : undefined,
    "data-cursor": cursor ? "cta" : undefined,
    "data-cursor-label": cursor,
  };
  if (external || href.startsWith("tel:") || href.startsWith("mailto:") || href.startsWith("http")) {
    return (
      <a href={href} {...common} {...(href.startsWith("http") ? { target: "_blank", rel: "noopener" } : {})}>
        {inner}
      </a>
    );
  }
  return (
    <Link href={href} prefetch={prefetch} {...common}>
      {inner}
    </Link>
  );
}

export function ArrowLink({ href, children, className }: { href: string; children: ReactNode; className?: string }) {
  return (
    <Link href={href} className={`link-arrow${className ? ` ${className}` : ""}`}>
      <span>{children}</span>
      <Icon name="arrow" />
    </Link>
  );
}
