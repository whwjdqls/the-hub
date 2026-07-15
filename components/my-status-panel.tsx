"use client";

import { useFormStatus } from "react-dom";
import { setWeeklyStatus, useMonthlyPass } from "@/app/actions/tracker";
import { getComplianceStatus } from "@/lib/compliance";
import type { TrackerPeriod } from "@/lib/period";
import type { DashboardState, ProgressRow } from "@/lib/progress";

function SubmitButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="h-8 border border-[#cdcdcf] px-3 text-[11px] font-medium text-[#55555a] hover:border-[#77777c] hover:text-[#171719] disabled:opacity-50"
    >
      {pending ? "저장 중…" : children}
    </button>
  );
}

function StatusControl({
  label,
  complete,
  field,
}: {
  label: string;
  complete: boolean;
  field: "note_submitted" | "comments_completed";
}) {
  return (
    <div className="flex min-h-[72px] items-center justify-between gap-4 border-b border-[#eeeeef] py-3 sm:border-b-0 sm:border-r sm:pr-5">
      <div>
        <p className="text-[10px] uppercase tracking-[0.1em] text-[#737378]">{label}</p>
        <p className={`mt-1.5 text-[13px] font-medium ${complete ? "text-[#242427]" : "text-[#b4232c]"}`}>
          {complete ? "완료" : "미완료"}
        </p>
      </div>
      <form action={setWeeklyStatus}>
        <input type="hidden" name="field" value={field} />
        <input type="hidden" name="value" value={String(!complete)} />
        <SubmitButton>{complete ? "되돌리기" : "완료 표시"}</SubmitButton>
      </form>
    </div>
  );
}

export function MyStatusPanel({
  source,
  row,
  period,
}: {
  source: DashboardState["source"];
  row: ProgressRow | null;
  period: TrackerPeriod;
}) {
  if (source !== "live" || !row) {
    return (
      <div className="mt-4 flex flex-col justify-between gap-2 border-b border-[#e6e6e8] pb-4 text-[11px] text-[#717176] sm:flex-row sm:items-center">
        <span>매월 1회 · 기록 또는 댓글 미완료 시 패스로 해당 주 면제</span>
        <span className="font-mono text-[9px] uppercase tracking-[0.12em]">
          {source === "setup-required" ? "Run Supabase migration" : "Demo data"}
        </span>
      </div>
    );
  }

  const compliance = getComplianceStatus(row);
  return (
    <section className="mt-5 border-y border-[#dcdcdf]" aria-labelledby="my-status-title">
      <div className="flex items-center justify-between border-b border-[#e6e6e8] bg-[#fafafa] px-3 py-2.5 sm:px-4">
        <div className="flex items-baseline gap-2.5">
          <h3 id="my-status-title" className="text-[12px] font-medium">내 상태</h3>
          <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-[#737378]">
            {period.monthLabel}
          </span>
        </div>
        {compliance === "warning" && <span className="text-[12px] font-semibold text-[#d1242f]">경고!!</span>}
        {compliance === "exempt" && <span className="text-[11px] font-medium">패스 사용 · 면제</span>}
      </div>

      <div className="grid px-3 sm:grid-cols-[1fr_1fr_1.15fr] sm:px-4">
        <StatusControl label="Reading note" complete={row.note === "작성"} field="note_submitted" />
        <StatusControl label="Comments" complete={row.comments === "완료"} field="comments_completed" />
        <div className="flex min-h-[72px] items-center justify-between gap-4 py-3 sm:pl-5">
          <div>
            <p className="text-[10px] uppercase tracking-[0.1em] text-[#737378]">Monthly pass</p>
            <p className="mt-1.5 text-[13px] font-medium">
              {row.passApplied
                ? "이번 주에 사용"
                : row.passUsed
                  ? "이번 달 사용 완료"
                  : "1회 사용 가능"}
            </p>
          </div>
          {!row.passUsed && (
            <form
              action={useMonthlyPass}
              onSubmit={(event) => {
                if (!window.confirm("이번 달 패스를 사용하면 취소할 수 없습니다. 사용하시겠어요?")) {
                  event.preventDefault();
                }
              }}
            >
              <button
                type="submit"
                className="h-8 bg-[#171719] px-3 text-[11px] font-medium text-white hover:bg-[#303033]"
              >
                패스 사용
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
