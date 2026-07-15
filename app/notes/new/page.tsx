import type { Metadata } from "next";
import Link from "next/link";
import { NoteForm } from "@/app/notes/new/note-form";
import { ArrowLeftIcon } from "@/components/icons";
import { getViewerBooks } from "@/lib/books";
import { getCurrentPeriod } from "@/lib/period";

export const metadata: Metadata = {
  title: "독서 기록 작성",
};

export const dynamic = "force-dynamic";

export default async function NewNotePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const [{ error }, books] = await Promise.all([searchParams, getViewerBooks()]);
  const period = getCurrentPeriod();

  return (
    <main className="mx-auto w-full max-w-[920px] px-5 pb-24 pt-8 sm:px-8 sm:pt-11 md:px-10 md:pt-12 lg:px-14">
      <Link href="/" className="mb-8 inline-flex h-8 items-center gap-1.5 text-[12px] text-[#77777c] hover:text-[#171719]">
        <ArrowLeftIcon className="h-3.5 w-3.5" />
        이번 주 기록
      </Link>
      <header className="mb-9">
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.14em] text-[#737378]">
          Week {period.weekNumber} · New note
        </p>
        <h1 className="text-[30px] font-semibold tracking-[-0.035em] text-[#171719] sm:text-[34px]">
          독서 기록 작성
        </h1>
        <p className="mt-2 text-[13px] text-[#717176]">한 권의 책에는 여러 개의 기록을 이어서 남길 수 있습니다.</p>
        {error && <p className="mt-5 border-l-2 border-[#d1242f] pl-3 text-[12px] text-[#b4232c]">{error}</p>}
      </header>
      <NoteForm books={books} />
    </main>
  );
}
