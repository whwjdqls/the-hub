"use client";

import { useRef, useState } from "react";
import { RichText } from "@/components/rich-text";

export function RichTextEditor({
  initialValue = "",
}: {
  initialValue?: string;
}) {
  const [value, setValue] = useState(initialValue);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function wrapSelection(open: string, close: string, fallback: string) {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = value.slice(start, end) || fallback;
    const next = `${value.slice(0, start)}${open}${selected}${close}${value.slice(end)}`;
    setValue(next);

    requestAnimationFrame(() => {
      textarea.focus();
      const selectionStart = start + open.length;
      textarea.setSelectionRange(selectionStart, selectionStart + selected.length);
    });
  }

  return (
    <div className="mt-2">
      <div className="flex h-10 items-center gap-1 border border-b-0 border-[#cdcdcf] bg-[#fafafa] px-2">
        <button
          type="button"
          onClick={() => wrapSelection("**", "**", "굵게 표시할 문장")}
          className="grid h-7 min-w-8 place-items-center border border-transparent px-2 text-[12px] font-bold text-[#454549] hover:border-[#d2d2d4] hover:bg-white"
          aria-label="선택한 문장 굵게"
          title="굵게"
        >
          B
        </button>
        <button
          type="button"
          onClick={() => wrapSelection("==", "==", "하이라이트할 문장")}
          className="h-7 border border-transparent px-2 text-[11px] font-medium text-[#454549] hover:border-[#d2d2d4] hover:bg-white"
          aria-label="선택한 문장 하이라이트"
          title="하이라이트"
        >
          <span className="bg-[#fff0a8] px-1">Highlight</span>
        </button>
        <span className="ml-auto hidden text-[9px] text-[#8a8a8f] sm:inline">
          문장을 선택한 뒤 서식을 적용하세요
        </span>
      </div>
      <textarea
        ref={textareaRef}
        id="note-body"
        name="body"
        required
        rows={14}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        className="block min-h-[320px] w-full resize-y border border-[#cdcdcf] bg-white px-3.5 py-3 text-[14px] leading-7 text-[#2e2e31] outline-none placeholder:text-[#77777c] focus:border-[#55555a]"
        placeholder={"읽으며 떠오른 생각을 자유롭게 적어주세요.\n\n문단은 빈 줄로 나눌 수 있습니다."}
      />
      {value.trim() && (
        <details className="border-x border-b border-[#e2e2e4]">
          <summary className="flex h-9 cursor-pointer list-none items-center px-3 text-[10px] font-medium uppercase tracking-[0.08em] text-[#717176]">
            Preview
          </summary>
          <RichText body={value} className="border-t border-[#e6e6e8] bg-[#fafafa] px-4 py-5" />
        </details>
      )}
    </div>
  );
}
