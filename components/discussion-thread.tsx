import { addComment } from "@/app/actions/content";
import { Avatar } from "@/components/avatar";
import type { Member, NoteComment } from "@/lib/models";

function CommentCard({ comment }: { comment: NoteComment }) {
  return (
    <article className="relative grid grid-cols-[32px_minmax(0,1fr)] gap-3 sm:gap-4">
      <Avatar member={comment.author} size="lg" className="relative z-10" />
      <div className="min-w-0 border border-[#dcdcdf] bg-white">
        <header className="flex min-h-10 flex-wrap items-center gap-x-1.5 border-b border-[#e6e6e8] bg-[#fafafa] px-3 py-2 text-[11px] text-[#707075] sm:px-4">
          <span className="font-medium text-[#414145]">{comment.author.name}</span>
          <span>· {comment.dateLabel}</span>
        </header>
        <p className="whitespace-pre-wrap px-3 py-3.5 text-[13px] leading-6 text-[#36363a] sm:px-4 sm:py-4 sm:text-[14px]">{comment.body}</p>
      </div>
    </article>
  );
}

export function DiscussionThread({
  noteId,
  comments,
  currentMember,
  error,
}: {
  noteId: string;
  comments: NoteComment[];
  currentMember: Member;
  error?: string;
}) {
  return (
    <section id="discussion" className="mt-14 scroll-mt-8 border-t border-[#dcdcdf] pt-9" aria-labelledby="discussion-title">
      <div className="mb-6 flex items-baseline gap-3">
        <h2 id="discussion-title" className="text-[18px] font-semibold tracking-[-0.02em]">Discussion</h2>
        <span className="font-mono text-[10px] text-[#737378]">{String(comments.length).padStart(2, "0")}</span>
      </div>

      {comments.length ? (
        <div className="relative space-y-4 before:absolute before:bottom-4 before:left-[15.5px] before:top-4 before:w-px before:bg-[#e4e4e6]">
          {comments.map((comment) => <CommentCard key={comment.id} comment={comment} />)}
        </div>
      ) : (
        <div className="border-y border-[#e6e6e8] py-8 text-center text-[13px] text-[#717176]">아직 댓글이 없습니다. 첫 의견을 남겨보세요.</div>
      )}

      {error && <p className="mt-6 border-l-2 border-[#d1242f] pl-3 text-[12px] text-[#b4232c]">{error}</p>}
      <form action={addComment} className="mt-8 grid grid-cols-[32px_minmax(0,1fr)] gap-3 sm:gap-4">
        <Avatar member={currentMember} size="lg" />
        <div>
          <input type="hidden" name="noteId" value={noteId} />
          <label htmlFor="new-comment" className="sr-only">토론에 의견 남기기</label>
          <textarea
            id="new-comment"
            name="body"
            required
            maxLength={4000}
            placeholder="토론에 의견을 남겨주세요…"
            rows={4}
            className="block min-h-28 w-full resize-y border border-[#cdcdcf] bg-white px-3.5 py-3 text-[13px] leading-6 text-[#2e2e31] outline-none placeholder:text-[#77777c] focus:border-[#5d5d61] sm:text-[14px]"
          />
          <div className="mt-2.5 flex justify-end">
            <button type="submit" className="h-8 border border-[#171719] bg-[#171719] px-4 text-[11px] font-medium text-white hover:bg-[#303033]">Comment</button>
          </div>
        </div>
      </form>
    </section>
  );
}
