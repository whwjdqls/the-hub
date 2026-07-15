import type { Metadata } from "next";
import Link from "next/link";
import { NoteList } from "@/components/note-list";
import { getNotes } from "@/lib/notes";
import { getCurrentPeriod, periodFromWeekStart } from "@/lib/period";

export const metadata: Metadata = {
  title: "Timeline",
  description: "지난 독서 기록을 주차별로 살펴보세요.",
};

export const dynamic = "force-dynamic";

export default async function TimelinePage() {
  const notes = await getNotes();
  const current = getCurrentPeriod();
  const grouped = new Map<string, typeof notes>();
  for (const note of notes) {
    grouped.set(note.weekStart, [...(grouped.get(note.weekStart) ?? []), note]);
  }
  const weeks = [...grouped.entries()].sort(([a], [b]) => b.localeCompare(a));

  return (
    <main className="mx-auto w-full max-w-[1120px] px-5 pb-24 pt-9 sm:px-8 sm:pt-11 md:px-10 md:pt-14 lg:px-14">
      <header className="mb-12 border-b border-[#e6e6e8] pb-8">
        <p className="mb-3 font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-[#66666b]">Archive</p>
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <h1 className="text-[30px] font-semibold tracking-[-0.035em] text-[#171719] sm:text-[34px]">Timeline</h1>
            <p className="mt-2 text-[13px] text-[#707075]">Week 1부터 이어지는 팀의 독서 기록.</p>
          </div>
          <p className="font-mono text-[10px] text-[#737378]">{notes.length} ENTRIES · {weeks.length} WEEKS</p>
        </div>
      </header>

      {weeks.length ? (
        <div className="space-y-14">
          {weeks.map(([weekStart, weekNotes]) => {
            const period = periodFromWeekStart(weekStart);
            return (
              <section key={weekStart} aria-labelledby={`week-${period.weekNumber}-title`}>
                <div className="mb-4 flex items-end justify-between gap-4">
                  <div className="flex items-baseline gap-3">
                    <h2 id={`week-${period.weekNumber}-title`} className="text-[18px] font-semibold tracking-[-0.02em] text-[#28282b]">
                      Week {period.weekNumber}
                    </h2>
                    {weekStart === current.weekStart && (
                      <span className="border-l border-[#d8d8da] pl-3 font-mono text-[9px] uppercase tracking-[0.12em] text-[#77777c]">Current</span>
                    )}
                  </div>
                  <span className="font-mono text-[10px] text-[#737378]">{period.dateLabel}</span>
                </div>
                <NoteList notes={weekNotes} />
              </section>
            );
          })}
        </div>
      ) : (
        <div className="border-y border-[#e6e6e8] py-14 text-center">
          <p className="text-[13px] text-[#717176]">아직 타임라인에 기록이 없습니다.</p>
          <Link href="/notes/new" className="mt-3 inline-block text-[11px] font-medium underline underline-offset-4">첫 기록 작성하기</Link>
        </div>
      )}
    </main>
  );
}
