import { PHOENIX_PATHS, WORDMARK_PATHS } from "./logo-paths";

type Tone = "color" | "light" | "white";

/**
 * Original-Logo (Phoenix + Wortmarke) aus der bisherigen Website.
 * tone="light": Phoenix in Markenrot, Wortmarke weiß – für dunkle Flächen.
 */
export function Logo({
  tone = "color",
  className,
  title = "Scholkemper Reisen",
  animated = false,
}: {
  tone?: Tone;
  className?: string;
  title?: string;
  animated?: boolean;
}) {
  const phoenix = tone === "white" ? "#fff" : "#992233";
  const word = tone === "color" ? "#555555" : "#fff";
  return (
    <svg
      viewBox="6 4 588 110"
      className={`logo${animated ? " logo--animated" : ""}${className ? ` ${className}` : ""}`}
      role="img"
      aria-label={title}
    >
      <g className="logo__phoenix" fill={phoenix}>
        {PHOENIX_PATHS.map((d, i) => (
          <path key={i} d={d} style={{ ["--i" as string]: i }} />
        ))}
      </g>
      <g className="logo__word" fill={word}>
        {WORDMARK_PATHS.map((d, i) => (
          <path key={i} d={d} style={{ ["--i" as string]: i }} />
        ))}
      </g>
    </svg>
  );
}
