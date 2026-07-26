"use client";

import Link from "next/link";
import { deleteReadingNote } from "@/app/actions/content";
import { SubmitButton } from "@/components/submit-button";

export function NoteControls({ noteId }: { noteId: string }) {
  return (
    <div className="flex items-center gap-2">
      <Link
        href={`/notes/${noteId}/edit`}
        className="inline-flex h-8 items-center border border-[#cdcdcf] px-3 text-[11px] font-medium text-[#55555a] hover:border-[#77777c] hover:text-[#171719]"
      >
        수정
      </Link>
      <form
        action={deleteReadingNote}
        onSubmit={(event) => {
          if (!window.confirm("이 독서 기록과 모든 댓글을 삭제할까요? 삭제 후에는 복구할 수 없습니다.")) {
            event.preventDefault();
          }
        }}
      >
        <input type="hidden" name="noteId" value={noteId} />
        <SubmitButton
          idleLabel="삭제"
          pendingLabel="삭제 중…"
          className="h-8 border border-[#d9a4a8] px-3 text-[11px] font-medium text-[#b4232c] hover:border-[#b4232c]"
        />
      </form>
    </div>
  );
}
