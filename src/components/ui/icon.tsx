import type { CSSProperties } from "react";

const paths = {
  dashboard: "M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h7v7h-7z",
  book: "M12 5C9 3 5 3 2 4v15c3-1 7-1 10 1 3-2 7-2 10-1V4c-3-1-7-1-10 1v15",
  "arrow-right": "M4 12h16 M14 6l6 6-6 6",
  "arrow-up-right": "M6 18 18 6 M6 6h12v12",
  "chevron-right": "m9 5 7 7-7 7",
  "chevron-left": "m15 5-7 7 7 7",
  "chevron-down": "m6 9 6 6 6-6",
  clock: "M12 8v5l3 2 M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0",
  check: "m5 12 4 4L19 6",
  "check-circle": "m8 12 3 3 5-6 M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0",
  search: "M21 21l-5-5 M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0",
  bookmark: "M6 3h12v18l-6-4-6 4z",
  code: "m8 6-6 6 6 6 M16 6l6 6-6 6 M14 3l-4 18",
  play: "m8 4 13 8-13 8z",
  pause: "M8 4v16 M16 4v16",
  layers: "m12 2 10 6-10 6L2 8z M2 12l10 6 10-6 M2 16l10 6 10-6",
  x: "m6 6 12 12 M6 18 18 6",
  plus: "M12 5v14 M5 12h14",
  trash: "M3 6h18 M9 6V3h6v3 M5 6l1 15h12l1-15 M10 10v7 M14 10v7",
  edit: "m15 4 5 5 M4 20l5-1L21 7l-5-5L4 14z",
  target:
    "M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0 M18 12a6 6 0 1 1-12 0 6 6 0 0 1 12 0 M14 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0",
  reset: "M3 4v6h6 M3 10a9 9 0 1 1 1 8",
  coffee:
    "M3 8h14v10a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3z M17 9h2a3 3 0 1 1 0 6h-2 M7 1v3 M12 1v3",
  notes: "M5 3h14v18H5z M9 8h6 M9 12h6 M9 16h4",
  route:
    "M5 5h10a4 4 0 0 1 0 8H9a4 4 0 0 0 0 8h10 M7 5a2 2 0 1 1-4 0 2 2 0 0 1 4 0 M21 21a2 2 0 1 1-4 0 2 2 0 0 1 4 0",
  flame: "M12 2c1 6 7 6 7 13a7 7 0 0 1-14 0c0-3 1-5 4-8 0 5 3 5 3-5z",
  mail: "M3 5h18v14H3z m0 0 9 7 9-7",
  server: "M3 3h18v7H3z M3 14h18v7H3z M7 6h.01 M7 17h.01 M11 6h6 M11 17h6",
  terminal: "M3 4h18v16H3z m4 5 3 3-3 3 M13 15h4",
  sparkles:
    "m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5z M20 2v4 M18 4h4",
  settings:
    "M9 3h6l1 3 3 1 2 5-2 5-3 1-1 3H9l-1-3-3-1-2-5 2-5 3-1z M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0",
  bell: "M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9 M10 21h4",
  menu: "M4 6h16 M4 12h16 M4 18h16",
  calendar: "M3 5h18v16H3z M7 2v6 M17 2v6 M3 11h18 M7 15h2 M12 15h2 M7 18h2",
  download: "M12 3v12 m-5-5 5 5 5-5 M4 16v5h16v-5",
  trophy:
    "M7 3h10v7a5 5 0 0 1-10 0z M7 5H3v3a4 4 0 0 0 4 4 M17 5h4v3a4 4 0 0 1-4 4 M12 15v6 M8 21h8",
  sun: "M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0 M12 2v2 M12 20v2 M2 12h2 M20 12h2 M5 5l1 1 M18 18l1 1 M5 19l1-1 M18 6l1-1",
  info: "M12 11v6 M12 7h.01 M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0",
  globe:
    "M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0 M2 12h20 M12 2c6 6 6 14 0 20-6-6-6-14 0-20",
} as const;

export type IconName = keyof typeof paths;

export function Icon({
  name,
  size = 20,
  className,
  style,
}: {
  name: IconName;
  size?: number;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.65"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
      style={style}
    >
      <path d={paths[name]} />
    </svg>
  );
}
