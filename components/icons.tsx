import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const shared = {
  width: 16,
  height: 16,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export function CalendarIcon(props: IconProps) {
  return (
    <svg {...shared} {...props}>
      <path d="M8 2v4M16 2v4M3 9h18" />
      <rect x="3" y="4" width="18" height="17" rx="1" />
      <path d="m9 15 2 2 4-4" />
    </svg>
  );
}
export function TimelineIcon(props: IconProps) {
  return (
    <svg {...shared} {...props}>
      <path d="M5 4v16M5 7h8M5 12h13M5 17h10" />
    </svg>
  );
}

export function ArrowLeftIcon(props: IconProps) {
  return (
    <svg {...shared} {...props}>
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

export function ArrowRightIcon(props: IconProps) {
  return (
    <svg {...shared} {...props}>
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

export function MessageIcon(props: IconProps) {
  return (
    <svg {...shared} {...props}>
      <path d="M21 12a8 8 0 0 1-8 8H5l-3 2 1-4a9 9 0 1 1 18-6Z" />
    </svg>
  );
}

export function BookIcon(props: IconProps) {
  return (
    <svg {...shared} {...props}>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" />
    </svg>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <svg {...shared} {...props}>
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}
