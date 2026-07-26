import type { ProgressRow } from "@/lib/progress";

export type ComplianceStatus = "complete" | "warning" | "exempt";

export function getComplianceStatus(
  progress: Pick<ProgressRow, "note" | "comments" | "passApplied">,
): ComplianceStatus {
  if (progress.passApplied) return "exempt";
  if (progress.note === "pending" || progress.comments === "pending") return "warning";
  if (progress.note === "exempt" || progress.comments === "exempt") return "exempt";
  return "complete";
}
