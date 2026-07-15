import "server-only";

import { getProgramWeekNumber } from "@/lib/period";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import { memberFromProfile, type Member, type NoteDetail, type ReadingNote } from "@/lib/models";

type RawNote = {
  id: string;
  user_id: string;
  book_id: string | null;
  title: string;
  summary: string;
  body: string;
  book_title: string;
  book_author: string;
  week_start: string;
  created_at: string;
};

type RawProfile = {
  id: string;
  display_name: string | null;
  role: string | null;
};

type RawBook = {
  id: string;
  title: string;
  author: string;
};

function fallbackMember(id: string): Member {
  return { id, name: "Member", initial: "M", role: "Member" };
}

function dateLabels(value: string) {
  const date = new Date(value);
  return {
    shortDate: new Intl.DateTimeFormat("ko-KR", {
      timeZone: "Asia/Seoul",
      month: "long",
      day: "numeric",
    }).format(date),
    longDate: new Intl.DateTimeFormat("ko-KR", {
      timeZone: "Asia/Seoul",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date),
  };
}

function mapNote(
  note: RawNote,
  profiles: Map<string, Member>,
  books: Map<string, RawBook>,
  commentCounts: Map<string, number>,
): ReadingNote {
  const book = note.book_id ? books.get(note.book_id) : undefined;
  return {
    id: note.id,
    title: note.title,
    summary: note.summary,
    body: note.body,
    weekStart: note.week_start,
    weekNumber: getProgramWeekNumber(note.week_start),
    createdAt: note.created_at,
    ...dateLabels(note.created_at),
    author: profiles.get(note.user_id) ?? fallbackMember(note.user_id),
    book: {
      id: book?.id ?? note.book_id ?? "legacy",
      title: book?.title || note.book_title || "등록되지 않은 책",
      author: book?.author || note.book_author || "저자 미상",
    },
    commentCount: commentCounts.get(note.id) ?? 0,
  };
}

export async function getNotes(weekStart?: string): Promise<ReadingNote[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = await createClient();
  let query = supabase
    .from("reading_notes")
    .select("id, user_id, book_id, title, summary, body, book_title, book_author, week_start, created_at")
    .order("created_at", { ascending: false });
  if (weekStart) query = query.eq("week_start", weekStart);

  const notesResult = await query;
  if (notesResult.error || !notesResult.data?.length) return [];
  const notes = notesResult.data as RawNote[];
  const noteIds = notes.map((note) => note.id);

  const [profilesResult, booksResult, commentsResult] = await Promise.all([
    supabase.from("profiles").select("id, display_name, role"),
    supabase.from("books").select("id, title, author"),
    supabase.from("comments").select("note_id").in("note_id", noteIds),
  ]);

  const profiles = new Map(
    ((profilesResult.data ?? []) as RawProfile[]).map((profile) => [
      profile.id,
      memberFromProfile(profile),
    ]),
  );
  const books = new Map(
    ((booksResult.data ?? []) as RawBook[]).map((book) => [book.id, book]),
  );
  const commentCounts = new Map<string, number>();
  for (const comment of (commentsResult.data ?? []) as { note_id: string }[]) {
    commentCounts.set(comment.note_id, (commentCounts.get(comment.note_id) ?? 0) + 1);
  }

  return notes.map((note) => mapNote(note, profiles, books, commentCounts));
}

export async function getNote(noteId: string): Promise<NoteDetail | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = await createClient();
  const noteResult = await supabase
    .from("reading_notes")
    .select("id, user_id, book_id, title, summary, body, book_title, book_author, week_start, created_at")
    .eq("id", noteId)
    .maybeSingle();
  if (noteResult.error || !noteResult.data) return null;
  const rawNote = noteResult.data as RawNote;

  const [profilesResult, booksResult, commentsResult] = await Promise.all([
    supabase.from("profiles").select("id, display_name, role"),
    rawNote.book_id
      ? supabase.from("books").select("id, title, author").eq("id", rawNote.book_id)
      : Promise.resolve({ data: [] }),
    supabase
      .from("comments")
      .select("id, user_id, body, created_at")
      .eq("note_id", noteId)
      .order("created_at", { ascending: true }),
  ]);

  const profiles = new Map(
    ((profilesResult.data ?? []) as RawProfile[]).map((profile) => [
      profile.id,
      memberFromProfile(profile),
    ]),
  );
  const books = new Map(
    ((booksResult.data ?? []) as RawBook[]).map((book) => [book.id, book]),
  );
  const rawComments = (commentsResult.data ?? []) as Array<{
    id: string;
    user_id: string;
    body: string;
    created_at: string;
  }>;
  const base = mapNote(rawNote, profiles, books, new Map([[noteId, rawComments.length]]));

  return {
    ...base,
    comments: rawComments.map((comment) => ({
      id: comment.id,
      body: comment.body,
      createdAt: comment.created_at,
      dateLabel: dateLabels(comment.created_at).longDate,
      author: profiles.get(comment.user_id) ?? fallbackMember(comment.user_id),
    })),
  };
}
