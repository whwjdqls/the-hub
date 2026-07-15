import Link from "next/link";
import { ArrowLeftIcon } from "@/components/icons";

export default function NotFound() {
  return (
    <main className="grid min-h-[calc(100vh-3.5rem)] place-items-center px-5 md:min-h-screen">
      <div className="w-full max-w-md border-y border-[#e6e6e8] py-10 text-center">
        <p className="font-mono text-[10px] tracking-[0.16em] text-[#737378]">404 / NOT FOUND</p>
        <h1 className="mt-4 text-[24px] font-semibold tracking-[-0.03em]">기록을 찾을 수 없습니다</h1>
        <p className="mt-2 text-[13px] leading-6 text-[#707075]">
          삭제되었거나 주소가 변경된 독서 기록입니다.
        </p>
        <Link
          href="/"
          className="mt-7 inline-flex h-8 items-center gap-1.5 border border-[#cfcfd2] px-3 text-[11px] text-[#55555a] hover:border-[#8a8a8f] hover:text-[#171719]"
        >
          <ArrowLeftIcon className="h-3.5 w-3.5" /> Current Week
        </Link>
      </div>
    </main>
  );
}
