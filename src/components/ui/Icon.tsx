import type { SVGProps } from "react";

const PATHS = {
  arrow: "M4 12h15M13 6l6 6-6 6",
  arrowLeft: "M20 12H5M11 6l-6 6 6 6",
  arrowDown: "M12 4v15M6 13l6 6 6-6",
  arrowUpRight: "M7 17L17 7M8 7h9v9",
  phone:
    "M5 4h3.5l1.6 4.2-2.1 1.3a11 11 0 0 0 6.5 6.5l1.3-2.1L20 15.5V19a1.5 1.5 0 0 1-1.6 1.5A16.5 16.5 0 0 1 3.5 5.6 1.5 1.5 0 0 1 5 4z",
  mail: "M3.5 6.5h17v11h-17zM4 7l8 6.2L20 7",
  search: "M10.5 17a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13zM15.5 15.5L20 20",
  close: "M6 6l12 12M18 6L6 18",
  menu: "M4 8h16M4 16h16",
  filter: "M4 6h16M7 12h10M10 18h4",
  calendar: "M4.5 6.5h15v13h-15zM4.5 10.5h15M8.5 4v4M15.5 4v4",
  clock: "M12 20.5a8.5 8.5 0 1 0 0-17 8.5 8.5 0 0 0 0 17zM12 7.5V12l3 2",
  pin: "M12 21s-6.5-6.1-6.5-11a6.5 6.5 0 0 1 13 0c0 4.9-6.5 11-6.5 11zM12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z",
  users:
    "M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM2.5 20c.6-3.4 3.2-5.5 6.5-5.5s5.9 2.1 6.5 5.5M16 4.3a3.5 3.5 0 0 1 0 6.4M18 14.8c2 .7 3.2 2.5 3.5 5.2",
  seat: "M7 4v9a2 2 0 0 0 2 2h7M7 13l-1 7M16 15l1 5M10 9h6",
  check: "M5 12.5l4.5 4.5L19 7.5",
  plus: "M12 5v14M5 12h14",
  minus: "M5 12h14",
  bus: "M5 17V6.5A2.5 2.5 0 0 1 7.5 4h9A2.5 2.5 0 0 1 19 6.5V17M5 12h14M5 17h14v2H5zM8 19.5v1.5M16 19.5v1.5M8.5 14.5h.01M15.5 14.5h.01",
  shield: "M12 3.5l7 2.5v5.5c0 4.4-3 7.8-7 9-4-1.2-7-4.6-7-9V6z M9 12l2 2 4-4",
  wrench:
    "M14.7 6.3a4 4 0 0 0-5.2 5.2L4 17l3 3 5.5-5.5a4 4 0 0 0 5.2-5.2l-2.6 2.6-2.4-.6-.6-2.4z",
  snow: "M12 3v18M4.2 7.5l15.6 9M4.2 16.5l15.6-9M9.5 4.5L12 7l2.5-2.5M9.5 19.5L12 17l2.5 2.5",
  sparkle: "M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z",
  globe: "M12 20.5a8.5 8.5 0 1 0 0-17 8.5 8.5 0 0 0 0 17zM3.5 12h17M12 3.5c2.5 2.4 3.5 5.3 3.5 8.5s-1 6.1-3.5 8.5c-2.5-2.4-3.5-5.3-3.5-8.5s1-6.1 3.5-8.5z",
  parking: "M5 4h14v16H5zM10 16V8h3a2.5 2.5 0 0 1 0 5h-3",
  download: "M12 4v11M7 10l5 5 5-5M5 19.5h14",
  doc: "M7 3.5h7l4 4V20.5H7zM14 3.5V8h4M9.5 12h6M9.5 15.5h6",
  external: "M14 4h6v6M20 4l-9 9M18 13.5V20H4V6h6.5",
  play: "M8 5.5v13l10-6.5z",
  grid: "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z",
  coffee: "M5 9h11v5a5 5 0 0 1-5 5h-1a5 5 0 0 1-5-5zM16 10h1.5a2.5 2.5 0 0 1 0 5H16M8 3.5v2.5M11 3.5v2.5",
  plug: "M9 3v5M15 3v5M6.5 8h11v3a5.5 5.5 0 0 1-11 0zM12 16.5V21",
  wind: "M3 9h11a3 3 0 1 0-3-3M3 14h15a3 3 0 1 1-3 3M3 19h7",
  toilet: "M6 4h5v7H6zM4 11h16a8 8 0 0 1-8 8h0a8 8 0 0 1-8-8zM9 19l-1 2.5h8l-1-2.5",
  fridge: "M6.5 3.5h11v17h-11zM6.5 10h11M9.5 6.5v1.5M9.5 13v3",
  mic: "M12 14.5a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v5.5a3 3 0 0 0 3 3zM6 11a6 6 0 0 0 12 0M12 17v3.5",
  screen: "M3.5 5h17v11h-17zM9 20h6M12 16v4",
  belt: "M7 3l10 18M5 9h14",
  table: "M3.5 8h17M6 8v11M18 8v11M3.5 8l2-3h13l2 3",
  luggage: "M7 7.5h10v12H7zM10 7.5V4.5h4v3M10 11v5M14 11v5M8.5 19.5v1.5M15.5 19.5v1.5",
  ramp: "M3 19h18M3 19l14-9h4v9M8 8.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z",
  ruler: "M3 15.5L15.5 3 21 8.5 8.5 21zM7 12l2 2M10 9l2 2M13 6l2 2",
} as const;

export type IconName = keyof typeof PATHS;

export function Icon({ name, size = 20, ...rest }: { name: IconName; size?: number } & SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      <path d={PATHS[name]} />
    </svg>
  );
}
