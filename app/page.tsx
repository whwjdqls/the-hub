import { MyStatusPanel } from "@/components/my-status-panel";
import { NoteList } from "@/components/note-list";
import { WeekProgress } from "@/components/week-progress";
import { currentNotes } from "@/lib/data";
import { getDashboardState } from "@/lib/progress";

export const dynamic = "force-dynamic";

export default async function CurrentWeekPage() {
  const dashboard = await getDashboardState();
  const submittedCount = dashboard.rows.filter((row) => row.note === "작성").length;
  const totalCount = dashboard.rows.length;
  const completion = totalCount ? Math.round((submittedCount / totalCount) * 100) : 0;
  const viewerRow = dashboard.rows.find((row) => row.isCurrentUser) ?? null;

  return (
    <main className="mx-auto w-full max-w-[1120px] px-5 pb-20 pt-9 sm:px-8 sm:pt-11 md:px-10 md:pt-14 lg:px-14">
      <header className="mb-9 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
        <div>
          <p className="mb-3 font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-[#66666b]">
            Current week
          </p>
          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <h1 className="text-[30px] font-semibold tracking-[-0.035em] text-[#171719] sm:text-[34px]">
              Week {dashboard.period.weekNumber}
            </h1>
            <p className="font-mono text-[11px] tracking-[0.02em] text-[#66666b]">
              {dashboard.period.dateLabel}
            </p>
          </div>
        </div>

        <div className="w-full max-w-[190px] sm:text-right">
          <p className="text-[11px] text-[#717176]">
            <span className="font-medium text-[#303033]">{submittedCount} / {totalCount}</span>{" "}
            notes submitted
          </p>
          <div className="mt-2 h-px w-full bg-[#e4e4e6]" aria-hidden="true">
            <div className="h-px bg-[#252527]" style={{ width: `${completion}%` }} />
          </div>
        </div>
      </header>

      <section aria-labelledby="weekly-progress-title">
        <div className="mb-3 flex items-baseline justify-between">
          <h2 id="weekly-progress-title" className="text-[12px] font-medium text-[#414145]">
            Weekly progress
          </h2>
          <span className="font-mono text-[10px] text-[#737378]">{totalCount} MEMBERS</span>
        </div>
        <WeekProgress rows={dashboard.rows} />
        <MyStatusPanel source={dashboard.source} row={viewerRow} period={dashboard.period} />
      </section>

      <section className="mt-12 sm:mt-14" aria-labelledby="weekly-notes-title">
        <div className="mb-4 flex items-end justify-between">
          <div>
            <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.14em] text-[#737378]">
              Reading log
            </p>
            <h2
              id="weekly-notes-title"
              className="text-[19px] font-semibold tracking-[-0.02em] text-[#242427]"
            >
              이번 주 기록
            </h2>
          </div>
          <span className="font-mono text-[10px] text-[#737378]">{currentNotes.length} ENTRIES</span>
        </div>
        <NoteList notes={currentNotes} />
      </section>
    </main>
  );
}
