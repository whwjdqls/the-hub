import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Avatar } from "@/components/avatar";
import { DiscussionThread } from "@/components/discussion-thread";
import { ArrowLeftIcon, BookIcon } from "@/components/icons";
import { getViewer } from "@/lib/auth";
import type { Member } from "@/lib/models";
import { getNote } from "@/lib/notes";
import { getCurrentPeriod } from "@/lib/period";

type NotePageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ error?: string }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: NotePageProps): Promise<Metadata> {
  const { slug } = await params;
  const note = await getNote(slug);
  if (!note) return { title: "기록을 찾을 수 없음" };
  return { title: note.title, description: note.summary };
}

export default async function NoteDetailPage({ params, searchParams }: NotePageProps) {
  const [{ slug }, { error }, viewer] = await Promise.all([params, searchParams, getViewer()]);
  const note = await getNote(slug);
  if (!note || !viewer) notFound();
  const current = getCurrentPeriod();
  const isCurrentWeek = note.weekStart === current.weekStart;
  const currentMember: Member = {
    id: viewer.id,
    name: viewer.name,
    initial: viewer.name.slice(-1),
    role: "Member",
  };
  const paragraphs = note.body.split(/\n\s*\n/).filter(Boolean);

  return (
    <main className="mx-auto w-full max-w-[900px] px-5 pb-24 pt-8 sm:px-8 sm:pt-11 md:px-10 md:pt-12 lg:px-14">
      <Link href={isCurrentWeek ? "/" : "/timeline"} className="mb-10 inline-flex h-8 items-center gap-1.5 text-[12px] text-[#77777c] hover:text-[#171719]">
        <ArrowLeftIcon className="h-3.5 w-3.5" />
        {isCurrentWeek ? "이번 주 기록" : "Timeline"}
      </Link>

      <article>
        <header>
          <div className="mb-4 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.12em] text-[#8f8f94]">
            <span>Week {note.weekNumber}</span><span aria-hidden="true">/</span><span>Reading note</span>
          </div>
          <h1 className="max-w-[760px] text-[30px] font-semibold leading-[1.25] tracking-[-0.04em] text-[#171719] sm:text-[38px] sm:leading-[1.2]">{note.title}</h1>
          {note.summary && <p className="mt-4 max-w-[680px] text-[14px] leading-6 text-[#77777c]">{note.summary}</p>}
          <div className="mt-7 flex items-center gap-3 border-y border-[#e6e6e8] py-3.5">
            <Avatar member={note.author} size="md" />
            <div className="min-w-0 text-[11px] leading-5">
              <p className="font-medium text-[#444448]">{note.author.name}</p>
              <p className="text-[#6f6f74]">{note.longDate}</p>
            </div>
            <Link href="/books" className="ml-auto hidden min-w-0 items-center gap-2 text-right text-[11px] text-[#7f7f84] hover:text-[#303033] sm:flex">
              <BookIcon className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">『{note.book.title}』 <span className="text-[#77777c]">· {note.book.author}</span></span>
            </Link>
          </div>
          <Link href="/books" className="mt-3 flex items-center gap-2 text-[11px] text-[#7f7f84] sm:hidden">
            <BookIcon className="h-3.5 w-3.5 shrink-0" /><span className="truncate">『{note.book.title}』 · {note.book.author}</span>
          </Link>
        </header>

        <div className="mt-10 max-w-[740px]">
          {paragraphs.map((paragraph, index) => (
            <p key={index} className="mb-5 whitespace-pre-wrap text-[15px] leading-[1.85] tracking-[-0.005em] text-[#3a3a3e] sm:text-[16px]">{paragraph}</p>
          ))}
        </div>
      </article>

      <DiscussionThread noteId={note.id} comments={note.comments} currentMember={currentMember} error={error} />
    </main>
  );
}
