import type { Member } from "@/lib/models";

export function Avatar({
  member,
  size = "md",
  className = "",
}: {
  member: Member;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const sizeClass = {
    sm: "h-5 w-5 text-[9px]",
    md: "h-7 w-7 text-[10px]",
    lg: "h-8 w-8 text-[11px]",
  }[size];

  return (
    <span
      aria-hidden="true"
      className={`inline-flex shrink-0 items-center justify-center border border-black/5 font-medium text-[#38383b] ${sizeClass} ${className}`}
      style={{ backgroundColor: "#e6e6e6" }}
    >
      {member.initial}
    </span>
  );
}
