import type { Metadata } from "next";
import { Avatar } from "@/components/avatar";
import { getComplianceStatus } from "@/lib/compliance";
import { getWeeklyHistory } from "@/lib/history";
import type { OutcomeStatus } from "@/lib/progress";

export const metadata: Metadata = {
  title: "History",
  description: "주차별 제출, 지각, 면제 기록을 확인하세요.",
};

export const dynamic = "force-dynamic";

const label: Record<OutcomeStatus, string> = {
  pending: "대기",
  submitted: "제출",
  late: "지각",
  exempt: "면제",
};

function tone(status: OutcomeStatus) {
  if (status === "late") return "text-[#b26a00]";
  if (status === "pending") return "text-[#b4232c]";
  if (status === "exempt") return "text-[#66666b]";
  return "text-[#242427]";
}

export default async function HistoryPage() {
  const history = await getWeeklyHistory();

  return (
    <main className="mx-auto w-full max-w-[1120px] px-5 pb-24 pt-9 sm:px-8 sm:pt-11 md:px-10 md:pt-14 lg:px-14">
      <header className="mb-10 border-b border-[#e6e6e8] pb-8">
        <p className="mb-3 font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-[#66666b]">
          Attendance
        </p>
        <h1 className="text-[30px] font-semibold tracking-[-0.035em] text-[#171719] sm:text-[34px]">
          Weekly history
        </h1>
        <p className="mt-2 text-[13px] text-[#707075]">
          월요일 23:59 기준 제출, 지각, 패스 및 댓글 대상 없음 면제 기록.
        </p>
      </header>

      <div className="space-y-10">
        {history.map(({ period, rows }) => (
          <section key={period.weekStart}>
            <div className="mb-3 flex items-end justify-between gap-4">
              <h2 className="text-[17px] font-semibold tracking-[-0.02em]">
                Week {period.weekNumber}
              </h2>
              <span className="font-mono text-[9px] text-[#77777c]">{period.dateLabel}</span>
            </div>
            <div className="border-y border-[#e6e6e8]">
              {rows.map((row, index) => {
                const compliance = getComplianceStatus(row);
                return (
                  <div
                    key={row.member.id}
                    className={`grid min-h-12 grid-cols-[minmax(0,1fr)_70px_78px_85px] items-center gap-2 text-[12px] ${
                      index < rows.length - 1 ? "border-b border-[#eeeeef]" : ""
                    }`}
                  >
                    <div className="flex min-w-0 items-center gap-2.5">
                      <Avatar member={row.member} size="sm" />
                      <span className="truncate font-medium">{row.member.name}</span>
                    </div>
                    <span className={tone(row.note)}>{label[row.note]}</span>
                    <span className={tone(row.comments)}>{label[row.comments]}</span>
                    <span className={compliance === "warning" ? "font-medium text-[#b4232c]" : "text-[#66666b]"}>
                      {compliance === "warning" ? "미완료" : compliance === "exempt" ? "면제" : "완료"}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
