import Link from "next/link";
import { updateBookStatus } from "@/app/actions/content";
import { BookIcon } from "@/components/icons";
import type { BookStatus, BookWithNotes } from "@/lib/models";

const groups: Array<{ status: BookStatus; label: string }> = [
  { status: "reading", label: "읽는 중" },
  { status: "completed", label: "완료" },
  { status: "planned", label: "읽을 예정" },
];

export function BookShelf({ books, editable }: { books: BookWithNotes[]; editable: boolean }) {
  return (
    <div className="grid border-t border-[#e6e6e8] md:grid-cols-3">
      {groups.map((group, groupIndex) => {
        const items = books.filter((book) => book.status === group.status);
        return (
          <section
            key={group.status}
            className={`min-h-[150px] px-4 py-5 ${groupIndex < groups.length - 1 ? "border-b border-[#e6e6e8] md:border-b-0 md:border-r" : ""}`}
          >
            <div className="mb-4 flex items-baseline justify-between">
              <h3 className="text-[11px] font-medium text-[#4a4a4f]">{group.label}</h3>
              <span className="font-mono text-[9px] text-[#77777c]">{items.length}</span>
            </div>
            {items.length ? (
              <div className="space-y-4">
                {items.map((book) => (
                  <article key={book.id} className="flex items-start gap-2.5">
                    <BookIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#77777c]" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[12px] font-medium text-[#303033]">{book.title}</p>
                      <p className="mt-1 truncate text-[10px] text-[#77777c]">{book.author || "저자 미상"}</p>
                      {book.notes.length > 0 && (
                        <div className="mt-2 border-l border-[#d8d8da] pl-2.5">
                          <p className="mb-1.5 font-mono text-[8px] uppercase tracking-[0.08em] text-[#8a8a8f]">
                            {book.notes.length} notes
                          </p>
                          <div className="space-y-1.5">
                            {book.notes.map((note) => (
                              <Link
                                key={note.id}
                                href={`/notes/${note.id}`}
                                className="block truncate text-[10px] text-[#66666b] underline-offset-2 hover:text-[#171719] hover:underline"
                              >
                                {note.title}
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                      {editable && (
                        <form action={updateBookStatus} className="mt-2">
                          <input type="hidden" name="bookId" value={book.id} />
                          <select
                            name="status"
                            defaultValue={book.status}
                            aria-label={`${book.title} 상태 변경`}
                            className="h-7 border border-[#d8d8da] bg-white px-2 text-[10px] text-[#55555a] outline-none focus:border-[#77777c]"
                          >
                            <option value="reading">읽는 중</option>
                            <option value="completed">완료</option>
                            <option value="planned">읽을 예정</option>
                          </select>
                          <button type="submit" className="ml-1.5 h-7 px-2 text-[10px] text-[#717176] hover:text-[#171719]">
                            변경
                          </button>
                        </form>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <p className="text-[11px] text-[#9a9a9e]">등록된 책 없음</p>
            )}
          </section>
        );
      })}
    </div>
  );
}
