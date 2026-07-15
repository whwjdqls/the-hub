import type { Metadata } from "next";
import { NoteList } from "@/components/note-list";
import { notes } from "@/lib/data";

export const metadata: Metadata = {
  title: "Timeline",
  description: "지난 독서 기록을 주차별로 살펴보세요.",
};

const weekMeta = {
  24: { dates: "JUN 08 — JUN 14", label: "Current" },
  23: { dates: "JUN 01 — JUN 07", label: "" },
  22: { dates: "MAY 25 — MAY 31", label: "" },
} as const;

export default function TimelinePage() {
  const weeks = [24, 23, 22] as const;

  return (
    <main className="mx-auto w-full max-w-[1120px] px-5 pb-24 pt-9 sm:px-8 sm:pt-11 md:px-10 md:pt-14 lg:px-14">
      <header className="mb-12 border-b border-[#e6e6e8] pb-8">
        <p className="mb-3 font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-[#66666b]">
          Archive
        </p>
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <h1 className="text-[30px] font-semibold tracking-[-0.035em] text-[#171719] sm:text-[34px]">
              Timeline
            </h1>
            <p className="mt-2 text-[13px] text-[#707075]">읽고, 기록하고, 함께 나눈 생각들.</p>
          </div>
          <p className="font-mono text-[10px] text-[#737378]">{notes.length} ENTRIES · 3 WEEKS</p>
        </div>
      </header>

      <div className="space-y-14">
        {weeks.map((week) => {
          const weekNotes = notes.filter((note) => note.week === week);
          const meta = weekMeta[week];
          return (
            <section key={week} aria-labelledby={`week-${week}-title`}>
              <div className="mb-4 flex items-end justify-between gap-4">
                <div className="flex items-baseline gap-3">
                  <h2
                    id={`week-${week}-title`}
                    className="text-[18px] font-semibold tracking-[-0.02em] text-[#28282b]"
                  >
                    Week {week}
                  </h2>
                  {meta.label && (
                    <span className="border-l border-[#d8d8da] pl-3 font-mono text-[9px] uppercase tracking-[0.12em] text-[#77777c]">
                      {meta.label}
                    </span>
                  )}
                </div>
                <span className="font-mono text-[10px] text-[#737378]">{meta.dates} · 2026</span>
              </div>
              <NoteList notes={weekNotes} />
            </section>
          );
        })}
      </div>
    </main>
  );
}
