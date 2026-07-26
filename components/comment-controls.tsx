"use client";

import { useState } from "react";
import { deleteComment, updateComment } from "@/app/actions/content";
import { SubmitButton } from "@/components/submit-button";

export function CommentControls({
  noteId,
  commentId,
  initialBody,
}: {
  noteId: string;
  commentId: string;
  initialBody: string;
}) {
  const [editing, setEditing] = useState(false);

  if (editing) {
    return (
      <form action={updateComment} className="py-1">
        <input type="hidden" name="noteId" value={noteId} />
        <input type="hidden" name="commentId" value={commentId} />
        <textarea
          name="body"
          required
          maxLength={4000}
          defaultValue={initialBody}
          rows={4}
          autoFocus
          className="block min-h-24 w-full resize-y border border-[#cdcdcf] px-3 py-2.5 text-[13px] leading-6 outline-none focus:border-[#55555a]"
        />
        <div className="mt-2 flex justify-end gap-2">
          <button
            type="button"
            onClick={() => setEditing(false)}
            className="h-8 px-3 text-[11px] text-[#717176] hover:text-[#171719]"
          >
            취소
          </button>
          <SubmitButton
            idleLabel="저장"
            pendingLabel="저장 중…"
            className="h-8 bg-[#171719] px-3 text-[11px] font-medium text-white"
          />
        </div>
      </form>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => setEditing(true)}
        className="text-[10px] text-[#77777c] hover:text-[#171719]"
      >
        수정
      </button>
      <form
        action={deleteComment}
        onSubmit={(event) => {
          if (!window.confirm("이 댓글을 삭제할까요?")) event.preventDefault();
        }}
      >
        <input type="hidden" name="noteId" value={noteId} />
        <input type="hidden" name="commentId" value={commentId} />
        <button type="submit" className="text-[10px] text-[#a33a42] hover:text-[#d1242f]">
          삭제
        </button>
      </form>
    </div>
  );
}
