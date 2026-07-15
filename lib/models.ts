export type Member = {
  id: string;
  name: string;
  initial: string;
  role: string;
};

export type BookStatus = "planned" | "reading" | "completed";

export type Book = {
  id: string;
  userId: string;
  title: string;
  author: string;
  status: BookStatus;
  createdAt: string;
  updatedAt: string;
};

export type BookWithNotes = Book & {
  notes: Array<{
    id: string;
    title: string;
    createdAt: string;
  }>;
};

export type ReadingNote = {
  id: string;
  title: string;
  summary: string;
  body: string;
  weekStart: string;
  weekNumber: number;
  createdAt: string;
  shortDate: string;
  longDate: string;
  author: Member;
  book: Pick<Book, "id" | "title" | "author">;
  commentCount: number;
};

export type NoteComment = {
  id: string;
  body: string;
  createdAt: string;
  dateLabel: string;
  author: Member;
};

export type NoteDetail = ReadingNote & {
  comments: NoteComment[];
};

export function memberFromProfile(profile: {
  id: string;
  display_name: string | null;
  role?: string | null;
}): Member {
  const name = profile.display_name?.trim() || "Member";
  return {
    id: profile.id,
    name,
    initial: name.slice(-1),
    role: profile.role?.trim() || "Member",
  };
}
