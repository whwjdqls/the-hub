import type { ProgressRow } from "@/lib/progress";

export type ComplianceStatus = "complete" | "warning" | "exempt";

export function getComplianceStatus(
  progress: Pick<ProgressRow, "note" | "comments" | "passApplied">,
): ComplianceStatus {
  if (progress.passApplied) return "exempt";
  if (progress.note !== "작성" || progress.comments !== "완료") return "warning";
  return "complete";
}
