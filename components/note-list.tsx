import Link from "next/link";
import { ArrowRightIcon, MessageIcon } from "@/components/icons";
import type { ReadingNote } from "@/lib/models";

export function NoteList({ notes, numbered = true }: { notes: ReadingNote[]; numbered?: boolean }) {
  if (!notes.length) {
    return (
      <div className="border-y border-[#e6e6e8] py-10 text-center">
        <p className="text-[13px] text-[#717176]">아직 작성된 독서 기록이 없습니다.</p>
        <Link href="/notes/new" className="mt-3 inline-block text-[11px] font-medium text-[#303033] underline underline-offset-4">
          첫 기록 작성하기
        </Link>
      </div>
    );
  }

  return (
    <div className="border-y border-[#e6e6e8]">
      {notes.map((note, index) => {
        const author = note.author;
        return (
          <Link
            key={note.id}
            href={`/notes/${note.id}`}
            className={`group grid min-h-[92px] grid-cols-[28px_minmax(0,1fr)_auto] items-center gap-3 px-1 py-4 hover:bg-[#fafafa] sm:grid-cols-[36px_minmax(0,1fr)_210px] sm:gap-4 sm:px-3 ${
              index < notes.length - 1 ? "border-b border-[#e6e6e8]" : ""
            }`}
          >
            <span className="self-start pt-0.5 font-mono text-[10px] tabular-nums text-[#77777c] sm:pt-1">
              {numbered ? String(index + 1).padStart(2, "0") : "—"}
            </span>

            <span className="min-w-0">
              <span className="block truncate text-[14px] font-medium tracking-[-0.01em] text-[#202023] sm:text-[15px]">
                {note.title}
              </span>
              <span className="mt-1 block truncate text-[12px] text-[#86868b] sm:text-[13px]">
                {note.summary || `『${note.book.title}』 독서 기록`}
              </span>
              <span className="mt-1.5 block truncate font-mono text-[9px] uppercase tracking-[0.05em] text-[#8a8a8f]">
                {note.book.title}
              </span>
              <span className="mt-2 flex items-center gap-2 text-[11px] text-[#737378] sm:hidden">
                <span>{author.name}</span>
                <span aria-hidden="true">·</span>
                <span>{note.shortDate}</span>
                <span aria-hidden="true">·</span>
                <span>{note.commentCount} comments</span>
              </span>
            </span>

            <span className="hidden items-center justify-end gap-4 sm:flex">
              <span className="min-w-0 text-right">
                <span className="block text-[12px] font-medium text-[#57575c]">{author.name}</span>
                <span className="mt-1 flex items-center justify-end gap-2 text-[11px] text-[#737378]">
                  <span>{note.shortDate}</span>
                  <span className="inline-flex items-center gap-1">
                    <MessageIcon className="h-3 w-3" />
                    {note.commentCount}
                  </span>
                </span>
              </span>
              <ArrowRightIcon className="h-3.5 w-3.5 text-[#c0c0c3] group-hover:text-[#333336]" />
            </span>

            <ArrowRightIcon className="h-3.5 w-3.5 text-[#b8b8bc] sm:hidden" />
          </Link>
        );
      })}
    </div>
  );
}
