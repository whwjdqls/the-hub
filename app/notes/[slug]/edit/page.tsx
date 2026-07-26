import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { NoteForm } from "@/app/notes/new/note-form";
import { ArrowLeftIcon } from "@/components/icons";
import { getViewer } from "@/lib/auth";
import { getViewerBooks } from "@/lib/books";
import { getNote } from "@/lib/notes";

type EditNotePageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ error?: string }>;
};

export const metadata: Metadata = {
  title: "독서 기록 수정",
};

export const dynamic = "force-dynamic";

export default async function EditNotePage({ params, searchParams }: EditNotePageProps) {
  const [{ slug }, { error }, viewer, books] = await Promise.all([
    params,
    searchParams,
    getViewer(),
    getViewerBooks(),
  ]);
  const note = await getNote(slug);
  if (!note || !viewer || note.author.id !== viewer.id) notFound();

  return (
    <main className="mx-auto w-full max-w-[920px] px-5 pb-24 pt-8 sm:px-8 sm:pt-11 md:px-10 md:pt-12 lg:px-14">
      <Link
        href={`/notes/${note.id}`}
        className="mb-8 inline-flex h-8 items-center gap-1.5 text-[12px] text-[#77777c] hover:text-[#171719]"
      >
        <ArrowLeftIcon className="h-3.5 w-3.5" />
        기록으로 돌아가기
      </Link>
      <header className="mb-9">
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.14em] text-[#737378]">
          Week {note.weekNumber} · Edit note
        </p>
        <h1 className="text-[30px] font-semibold tracking-[-0.035em] text-[#171719] sm:text-[34px]">
          독서 기록 수정
        </h1>
        <p className="mt-2 text-[13px] text-[#717176]">
          책, 제목, 요약과 본문을 수정할 수 있습니다.
        </p>
        {error && (
          <p className="mt-5 border-l-2 border-[#d1242f] pl-3 text-[12px] text-[#b4232c]">
            {error}
          </p>
        )}
      </header>
      <NoteForm
        books={books}
        initialNote={{
          id: note.id,
          title: note.title,
          summary: note.summary,
          body: note.body,
          bookId: note.book.id,
        }}
      />
    </main>
  );
}
