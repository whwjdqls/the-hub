import type { Metadata } from "next";
import { createBook } from "@/app/actions/content";
import { BookShelf } from "@/components/book-shelf";
import { getBookShelves } from "@/lib/books";

export const metadata: Metadata = {
  title: "Books",
  description: "멤버별 읽는 중, 완료, 읽을 예정 책을 확인하세요.",
};

export const dynamic = "force-dynamic";

const inputClass =
  "mt-2 block h-9 w-full border border-[#cdcdcf] bg-white px-3 text-[12px] outline-none placeholder:text-[#77777c] focus:border-[#55555a]";

export default async function BooksPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const [{ error }, shelves] = await Promise.all([searchParams, getBookShelves()]);
  const totalBooks = shelves.reduce((sum, shelf) => sum + shelf.books.length, 0);

  return (
    <main className="mx-auto w-full max-w-[1120px] px-5 pb-24 pt-9 sm:px-8 sm:pt-11 md:px-10 md:pt-14 lg:px-14">
      <header className="mb-10 border-b border-[#e6e6e8] pb-8">
        <p className="mb-3 font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-[#66666b]">Library</p>
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h1 className="text-[30px] font-semibold tracking-[-0.035em] text-[#171719] sm:text-[34px]">Books</h1>
            <p className="mt-2 text-[13px] text-[#707075]">멤버들이 읽고 있거나 다음으로 읽을 책.</p>
          </div>
          <p className="font-mono text-[10px] text-[#737378]">{totalBooks} BOOKS · {shelves.length} MEMBERS</p>
        </div>
        {error && <p className="mt-5 border-l-2 border-[#d1242f] pl-3 text-[12px] text-[#b4232c]">{error}</p>}
      </header>

      <details className="mb-8 border-y border-[#dcdcdf]">
        <summary className="flex h-12 cursor-pointer list-none items-center justify-between px-1 text-[12px] font-medium text-[#303033]">
          내 책장에 책 추가
          <span className="text-[16px] font-normal text-[#77777c]">＋</span>
        </summary>
        <form action={createBook} className="grid gap-4 border-t border-[#e6e6e8] bg-[#fafafa] px-4 py-5 sm:grid-cols-[1fr_1fr_170px_auto] sm:items-end">
          <label className="text-[10px] font-medium uppercase tracking-[0.08em] text-[#66666b]">
            Title
            <input name="bookTitle" required maxLength={160} className={inputClass} placeholder="책 제목" />
          </label>
          <label className="text-[10px] font-medium uppercase tracking-[0.08em] text-[#66666b]">
            Author
            <input name="bookAuthor" maxLength={120} className={inputClass} placeholder="저자 이름" />
          </label>
          <label className="text-[10px] font-medium uppercase tracking-[0.08em] text-[#66666b]">
            Status
            <select name="bookStatus" defaultValue="reading" className={inputClass}>
              <option value="reading">읽는 중</option>
              <option value="completed">완료</option>
              <option value="planned">읽을 예정</option>
            </select>
          </label>
          <button type="submit" className="h-9 bg-[#171719] px-4 text-[11px] font-medium text-white hover:bg-[#303033]">추가</button>
        </form>
      </details>

      <section aria-label="멤버별 책장" className="border-b border-[#dcdcdf]">
        {shelves.length ? shelves.map((shelf) => (
          <details key={shelf.member.id} open={shelf.isCurrentUser} className="border-t border-[#dcdcdf]">
            <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 px-1 py-3">
              <span className="text-[13px] font-medium text-[#303033]">
                {shelf.member.name}
                {shelf.isCurrentUser && <span className="ml-2 font-mono text-[9px] font-normal uppercase text-[#77777c]">You</span>}
              </span>
              <span className="font-mono text-[10px] text-[#737378]">{shelf.books.length} BOOKS · 펼치기</span>
            </summary>
            <BookShelf books={shelf.books} editable={shelf.isCurrentUser} />
          </details>
        )) : (
          <div className="border-t border-[#dcdcdf] py-12 text-center text-[12px] text-[#717176]">가입한 멤버가 아직 없습니다.</div>
        )}
      </section>
    </main>
  );
}
