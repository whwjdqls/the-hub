"use client";

import { useState } from "react";
import { createReadingNote } from "@/app/actions/content";
import type { Book } from "@/lib/models";

const inputClass =
  "mt-2 block h-10 w-full border border-[#cdcdcf] bg-white px-3 text-[13px] text-[#242427] outline-none placeholder:text-[#77777c] focus:border-[#55555a]";

export function NoteForm({ books }: { books: Book[] }) {
  const [selection, setSelection] = useState(books[0]?.id ?? "new");
  const isNewBook = selection === "new";

  return (
    <form action={createReadingNote} className="border-y border-[#dedee0]">
      <section className="grid gap-6 border-b border-[#e6e6e8] py-7 sm:grid-cols-[170px_minmax(0,1fr)]">
        <div>
          <p className="text-[12px] font-medium text-[#343438]">책</p>
          <p className="mt-1.5 text-[11px] leading-5 text-[#737378]">
            등록한 책은 다음 기록에서도 다시 선택할 수 있습니다.
          </p>
        </div>
        <div>
          <label className="block text-[11px] font-medium text-[#55555a]">
            내 책장에서 선택
            <select
              name="bookSelection"
              value={selection}
              onChange={(event) => setSelection(event.target.value)}
              className={inputClass}
            >
              {books.map((book) => (
                <option key={book.id} value={book.id}>
                  {book.title}{book.author ? ` · ${book.author}` : ""}
                </option>
              ))}
              <option value="new">+ 새 책 추가</option>
            </select>
          </label>

          {isNewBook && (
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="block text-[11px] font-medium text-[#55555a]">
                책 제목
                <input name="bookTitle" required maxLength={160} className={inputClass} placeholder="책 제목" />
              </label>
              <label className="block text-[11px] font-medium text-[#55555a]">
                저자
                <input name="bookAuthor" maxLength={120} className={inputClass} placeholder="저자 이름" />
              </label>
              <label className="block text-[11px] font-medium text-[#55555a] sm:col-span-2">
                현재 상태
                <select name="bookStatus" defaultValue="reading" className={inputClass}>
                  <option value="reading">읽는 중</option>
                  <option value="planned">읽을 예정</option>
                  <option value="completed">완료</option>
                </select>
              </label>
            </div>
          )}
        </div>
      </section>

      <section className="grid gap-6 py-7 sm:grid-cols-[170px_minmax(0,1fr)]">
        <div>
          <p className="text-[12px] font-medium text-[#343438]">독서 기록</p>
          <p className="mt-1.5 text-[11px] leading-5 text-[#737378]">
            저장하면 이번 주 Note가 자동으로 완료됩니다.
          </p>
        </div>
        <div className="space-y-5">
          <label className="block text-[11px] font-medium text-[#55555a]">
            제목
            <input name="title" required maxLength={160} className={inputClass} placeholder="이번 독서에서 남은 생각" />
          </label>
          <label className="block text-[11px] font-medium text-[#55555a]">
            한 줄 요약
            <input name="summary" maxLength={240} className={inputClass} placeholder="리스트에 표시될 짧은 설명" />
          </label>
          <label className="block text-[11px] font-medium text-[#55555a]">
            본문
            <textarea
              name="body"
              required
              rows={14}
              className="mt-2 block min-h-[320px] w-full resize-y border border-[#cdcdcf] bg-white px-3.5 py-3 text-[14px] leading-7 text-[#2e2e31] outline-none placeholder:text-[#77777c] focus:border-[#55555a]"
              placeholder={"읽으며 떠오른 생각을 자유롭게 적어주세요.\n\n문단은 빈 줄로 나눌 수 있습니다."}
            />
          </label>
        </div>
      </section>

      <div className="flex justify-end py-5">
        <button type="submit" className="h-10 bg-[#171719] px-5 text-[12px] font-medium text-white hover:bg-[#303033]">
          기록 저장
        </button>
      </div>
    </form>
  );
}
