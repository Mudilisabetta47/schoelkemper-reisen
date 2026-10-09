import { Fragment, type CSSProperties, type ElementType, type ReactNode } from "react";

/**
 * Zerlegt Text in Wörter (serverseitig, kein DOM-Umbau im Browser).
 * Screenreader lesen den Satz als Ganzes (sr-only), die Fragmente sind aria-hidden.
 * Zeilenumbruch: "\n" im Text erzeugt <br/>.
 */
export function SplitText({
  as: Tag = "span",
  text,
  reveal = "mask",
  delay = 0,
  className,
  style,
  start = 0,
  accent,
}: {
  as?: ElementType;
  text: string;
  reveal?: "mask" | "mask-fast" | "soft" | null;
  delay?: number;
  className?: string;
  style?: CSSProperties;
  start?: number;
  /** Wörter (exakt), die rot hervorgehoben werden */
  accent?: string[];
}) {
  let i = start;
  const lines = text.split("\n");
  const content: ReactNode[] = lines.map((line, li) => (
    <Fragment key={li}>
      {line
        .split(" ")
        .filter(Boolean)
        .map((w, wi, arr) => {
          const idx = i++;
          const isAccent = accent?.includes(w.replace(/[.,!?:]$/, ""));
          return (
            <Fragment key={wi}>
              <span className="split__w">
                <span className={`split__i${isAccent ? " is-accent" : ""}`} style={{ ["--i" as string]: idx }}>
                  {w}
                </span>
              </span>
              {wi < arr.length - 1 ? " " : null}
            </Fragment>
          );
        })}
      {li < lines.length - 1 ? <br /> : null}
    </Fragment>
  ));
  return (
    <Tag
      className={`split${className ? ` ${className}` : ""}`}
      data-reveal={reveal ?? undefined}
      style={{ ...style, ["--rv-delay" as string]: `${delay}ms` }}
    >
      <span className="sr-only">{text.replace(/\n/g, " ")}</span>
      <span aria-hidden="true">{content}</span>
    </Tag>
  );
}
