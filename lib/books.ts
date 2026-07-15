import "server-only";

import { getViewer } from "@/lib/auth";
import { memberFromProfile, type Book, type BookWithNotes, type Member } from "@/lib/models";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

export type MemberShelf = {
  member: Member;
  isCurrentUser: boolean;
  books: BookWithNotes[];
};

export async function getBookShelves(): Promise<MemberShelf[]> {
  if (!isSupabaseConfigured()) return [];
  const viewer = await getViewer();
  if (!viewer) return [];
  const supabase = await createClient();
  const [profilesResult, booksResult, notesResult] = await Promise.all([
    supabase.from("profiles").select("id, display_name, role, created_at").order("created_at"),
    supabase
      .from("books")
      .select("id, user_id, title, author, status, created_at, updated_at")
      .order("updated_at", { ascending: false }),
    supabase
      .from("reading_notes")
      .select("id, book_id, title, created_at")
      .order("created_at", { ascending: false }),
  ]);
  if (profilesResult.error || booksResult.error || notesResult.error) return [];

  const books = (booksResult.data ?? []) as Array<{
    id: string;
    user_id: string;
    title: string;
    author: string;
    status: Book["status"];
    created_at: string;
    updated_at: string;
  }>;
  const notes = (notesResult.data ?? []) as Array<{
    id: string;
    book_id: string | null;
    title: string;
    created_at: string;
  }>;

  return (profilesResult.data ?? []).map((profile) => ({
    member: memberFromProfile(profile),
    isCurrentUser: profile.id === viewer.id,
    books: books
      .filter((book) => book.user_id === profile.id)
      .map((book) => ({
        id: book.id,
        userId: book.user_id,
        title: book.title,
        author: book.author,
        status: book.status,
        createdAt: book.created_at,
        updatedAt: book.updated_at,
        notes: notes
          .filter((note) => note.book_id === book.id)
          .map((note) => ({ id: note.id, title: note.title, createdAt: note.created_at })),
      })),
  }));
}

export async function getViewerBooks(): Promise<Book[]> {
  const shelves = await getBookShelves();
  return shelves.find((shelf) => shelf.isCurrentUser)?.books ?? [];
}
