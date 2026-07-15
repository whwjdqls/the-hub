"use client";

import {
  FormEvent,
  KeyboardEvent,
  useCallback,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import { Avatar } from "@/components/avatar";
import { CheckIcon } from "@/components/icons";
import { getMember, type Comment } from "@/lib/data";

function CommentCard({ comment }: { comment: Comment }) {
  const author = getMember(comment.authorId);

  return (
    <article className="relative grid grid-cols-[32px_minmax(0,1fr)] gap-3 sm:gap-4">
      <Avatar member={author} size="lg" className="relative z-10" />
      <div className="min-w-0 border border-[#dcdcdf] bg-white">
        <header className="flex min-h-10 flex-wrap items-center gap-x-1.5 border-b border-[#e6e6e8] bg-[#fafafa] px-3 py-2 text-[11px] text-[#707075] sm:px-4">
          <span className="font-medium text-[#414145]">{author.name}</span>
          <span>님이 {comment.relativeTime}에 댓글을 남겼습니다</span>
        </header>
        <p className="whitespace-pre-wrap px-3 py-3.5 text-[13px] leading-6 text-[#36363a] sm:px-4 sm:py-4 sm:text-[14px]">
          {comment.content}
        </p>
      </div>
    </article>
  );
}

export function DiscussionThread({
  noteSlug,
  initialComments,
}: {
  noteSlug: string;
  initialComments: Comment[];
}) {
  const [draft, setDraft] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [volatileComments, setVolatileComments] = useState<Comment[]>([]);
  const currentMember = getMember("jiho");
  const storageKey = `hub-comments:${noteSlug}`;
  const subscribe = useCallback((onStoreChange: () => void) => {
    window.addEventListener("storage", onStoreChange);
    window.addEventListener("hub-comments-changed", onStoreChange);
    return () => {
      window.removeEventListener("storage", onStoreChange);
      window.removeEventListener("hub-comments-changed", onStoreChange);
    };
  }, []);
  const getSnapshot = useCallback(() => {
    try {
      return window.localStorage.getItem(storageKey) ?? "[]";
    } catch {
      return "[]";
    }
  }, [storageKey]);
  const savedComments = useSyncExternalStore(subscribe, getSnapshot, () => "[]");
  const localComments = useMemo(() => {
    try {
      const parsed: unknown = JSON.parse(savedComments);
      return Array.isArray(parsed) ? (parsed as Comment[]) : [];
    } catch {
      return [];
    }
  }, [savedComments]);
  const comments = [...initialComments, ...localComments, ...volatileComments];
  const countLabel = String(comments.length).padStart(2, "0");

  function submitComment(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault();
    const content = draft.trim();
    if (!content) return;

    const newComment: Comment = {
      id: `local-${Date.now()}`,
      authorId: "jiho",
      relativeTime: "방금",
      content,
    };
    const next = [...localComments, newComment];
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(next));
      window.dispatchEvent(new Event("hub-comments-changed"));
    } catch {
      setVolatileComments((current) => [...current, newComment]);
    }
    setDraft("");
    setSubmitted(true);
    window.setTimeout(() => setSubmitted(false), 1800);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
      event.preventDefault();
      submitComment();
    }
  }

  return (
    <section className="mt-14 border-t border-[#dcdcdf] pt-9" aria-labelledby="discussion-title">
      <div className="mb-6 flex items-baseline gap-3">
        <h2 id="discussion-title" className="text-[18px] font-semibold tracking-[-0.02em]">
          Discussion
        </h2>
        <span className="font-mono text-[10px] text-[#737378]">{countLabel}</span>
      </div>

      {comments.length > 0 ? (
        <div className="relative space-y-4 before:absolute before:bottom-4 before:left-[15.5px] before:top-4 before:w-px before:bg-[#e4e4e6]">
          {comments.map((comment) => (
            <CommentCard key={comment.id} comment={comment} />
          ))}
        </div>
      ) : (
        <div className="border-y border-[#e6e6e8] py-8 text-center text-[13px] text-[#717176]">
          아직 댓글이 없습니다. 첫 의견을 남겨보세요.
        </div>
      )}

      <form onSubmit={submitComment} className="mt-8 grid grid-cols-[32px_minmax(0,1fr)] gap-3 sm:gap-4">
        <Avatar member={currentMember} size="lg" />
        <div>
          <label htmlFor="new-comment" className="sr-only">
            토론에 의견 남기기
          </label>
          <textarea
            id="new-comment"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="토론에 의견을 남겨주세요…"
            rows={4}
            className="block min-h-28 w-full resize-y border border-[#cdcdcf] bg-white px-3.5 py-3 text-[13px] leading-6 text-[#2e2e31] outline-none placeholder:text-[#77777c] focus:border-[#5d5d61] sm:text-[14px]"
          />
          <div className="mt-2.5 flex items-center justify-between gap-4">
            <p className="hidden text-[10px] text-[#737378] sm:block">
              <kbd className="font-sans">⌘</kbd>/<kbd className="font-sans">Ctrl</kbd> + Enter to submit
            </p>
            <div className="ml-auto flex items-center gap-3">
              {submitted && (
                <span className="inline-flex items-center gap-1 text-[11px] text-[#6b6b70]" role="status">
                  <CheckIcon className="h-3 w-3" /> Added
                </span>
              )}
              <button
                type="submit"
                disabled={!draft.trim()}
                className="h-8 border border-[#171719] bg-[#171719] px-4 text-[11px] font-medium text-white hover:bg-[#303033] disabled:cursor-not-allowed disabled:border-[#d4d4d6] disabled:bg-white disabled:text-[#737378]"
              >
                Comment
              </button>
            </div>
          </div>
        </div>
      </form>
    </section>
  );
}
