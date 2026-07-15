"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentPeriod } from "@/lib/period";
import type { BookStatus } from "@/lib/models";
import { authenticatedClient } from "@/lib/supabase/authenticated";

const bookStatuses = new Set<BookStatus>(["planned", "reading", "completed"]);

function stringValue(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function errorPath(path: string, message: string) {
  return `${path}?error=${encodeURIComponent(message)}`;
}

async function markWeeklyCompletion(
  supabase: Awaited<ReturnType<typeof authenticatedClient>>["supabase"],
  userId: string,
  field: "note_submitted" | "comments_completed",
) {
  const period = getCurrentPeriod();
  const { data: existing, error: readError } = await supabase
    .from("weekly_checkins")
    .select("note_submitted, comments_completed")
    .eq("user_id", userId)
    .eq("week_start", period.weekStart)
    .maybeSingle();
  if (readError) throw new Error("이번 주 상태를 확인하지 못했습니다.");

  const { error } = await supabase.from("weekly_checkins").upsert(
    {
      user_id: userId,
      week_start: period.weekStart,
      note_submitted: existing?.note_submitted ?? false,
      comments_completed: existing?.comments_completed ?? false,
      [field]: true,
    },
    { onConflict: "user_id,week_start" },
  );
  if (error) throw new Error("이번 주 상태를 저장하지 못했습니다.");
}

async function insertBook(formData: FormData, redirectOnError: string) {
  const title = stringValue(formData, "bookTitle");
  const author = stringValue(formData, "bookAuthor");
  const rawStatus = stringValue(formData, "bookStatus") || "reading";
  const status = bookStatuses.has(rawStatus as BookStatus)
    ? (rawStatus as BookStatus)
    : "reading";
  if (!title || title.length > 160) redirect(errorPath(redirectOnError, "책 제목을 입력해주세요."));
  if (author.length > 120) redirect(errorPath(redirectOnError, "저자 이름이 너무 깁니다."));

  const { supabase, userId } = await authenticatedClient();
  const { data, error } = await supabase
    .from("books")
    .insert({ user_id: userId, title, author, status })
    .select("id, title, author")
    .single();
  if (error?.code === "23505") {
    redirect(errorPath(redirectOnError, "이미 내 책장에 등록된 책입니다."));
  }
  if (error || !data) redirect(errorPath(redirectOnError, "책을 추가하지 못했습니다."));
  return { supabase, userId, book: data };
}

export async function createBook(formData: FormData) {
  await insertBook(formData, "/books");
  revalidatePath("/books");
  redirect("/books");
}

export async function updateBookStatus(formData: FormData) {
  const bookId = stringValue(formData, "bookId");
  const status = stringValue(formData, "status") as BookStatus;
  if (!bookId || !bookStatuses.has(status)) redirect(errorPath("/books", "책 상태가 올바르지 않습니다."));
  const { supabase, userId } = await authenticatedClient();
  const { error } = await supabase
    .from("books")
    .update({ status })
    .eq("id", bookId)
    .eq("user_id", userId);
  if (error) redirect(errorPath("/books", "책 상태를 변경하지 못했습니다."));
  revalidatePath("/books");
  redirect("/books");
}

export async function createReadingNote(formData: FormData) {
  const title = stringValue(formData, "title");
  const summary = stringValue(formData, "summary");
  const body = stringValue(formData, "body");
  const selection = stringValue(formData, "bookSelection");
  if (!title || title.length > 160) redirect(errorPath("/notes/new", "기록 제목을 입력해주세요."));
  if (!body) redirect(errorPath("/notes/new", "기록 본문을 입력해주세요."));

  let supabase: Awaited<ReturnType<typeof authenticatedClient>>["supabase"];
  let userId: string;
  let book: { id: string; title: string; author: string };

  if (selection === "new") {
    const inserted = await insertBook(formData, "/notes/new");
    ({ supabase, userId, book } = inserted);
  } else {
    ({ supabase, userId } = await authenticatedClient());
    const { data, error } = await supabase
      .from("books")
      .select("id, title, author")
      .eq("id", selection)
      .eq("user_id", userId)
      .maybeSingle();
    if (error || !data) redirect(errorPath("/notes/new", "내 책장에서 책을 선택해주세요."));
    book = data;
  }

  const period = getCurrentPeriod();
  const { data: note, error } = await supabase
    .from("reading_notes")
    .insert({
      user_id: userId,
      book_id: book.id,
      book_title: book.title,
      book_author: book.author,
      week_start: period.weekStart,
      title,
      summary,
      body,
    })
    .select("id")
    .single();
  if (error || !note) redirect(errorPath("/notes/new", "독서 기록을 저장하지 못했습니다."));

  await markWeeklyCompletion(supabase, userId, "note_submitted");
  revalidatePath("/");
  revalidatePath("/timeline");
  revalidatePath("/books");
  redirect(`/notes/${note.id}`);
}

export async function addComment(formData: FormData) {
  const noteId = stringValue(formData, "noteId");
  const body = stringValue(formData, "body");
  if (!noteId || !body || body.length > 4000) {
    redirect(`/notes/${noteId || "unknown"}?error=${encodeURIComponent("댓글 내용을 확인해주세요.")}`);
  }
  const { supabase, userId } = await authenticatedClient();
  const { error } = await supabase.from("comments").insert({
    note_id: noteId,
    user_id: userId,
    body,
  });
  if (error) redirect(`/notes/${noteId}?error=${encodeURIComponent("댓글을 저장하지 못했습니다.")}`);

  await markWeeklyCompletion(supabase, userId, "comments_completed");
  revalidatePath(`/notes/${noteId}`);
  revalidatePath("/");
  redirect(`/notes/${noteId}#discussion`);
}
