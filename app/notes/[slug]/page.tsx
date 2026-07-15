import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Avatar } from "@/components/avatar";
import { DiscussionThread } from "@/components/discussion-thread";
import { ArrowLeftIcon, BookIcon } from "@/components/icons";
import { getMember, getNote, notes } from "@/lib/data";

type NotePageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return notes.map((note) => ({ slug: note.slug }));
}

export async function generateMetadata({ params }: NotePageProps): Promise<Metadata> {
  const { slug } = await params;
  const note = getNote(slug);
  if (!note) return { title: "기록을 찾을 수 없음" };
  return { title: note.title, description: note.summary };
}

export default async function NoteDetailPage({ params }: NotePageProps) {
  const { slug } = await params;
  const note = getNote(slug);
  if (!note) notFound();

  const author = getMember(note.authorId);

  return (
    <main className="mx-auto w-full max-w-[900px] px-5 pb-24 pt-8 sm:px-8 sm:pt-11 md:px-10 md:pt-12 lg:px-14">
      <Link
        href={note.week === 24 ? "/" : "/timeline"}
        className="mb-10 inline-flex h-8 items-center gap-1.5 text-[12px] text-[#77777c] hover:text-[#171719]"
      >
        <ArrowLeftIcon className="h-3.5 w-3.5" />
        {note.week === 24 ? "이번 주 기록" : "Timeline"}
      </Link>

      <article>
        <header>
          <div className="mb-4 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.12em] text-[#8f8f94]">
            <span>Week {note.week}</span>
            <span aria-hidden="true">/</span>
            <span>Reading note</span>
          </div>
          <h1 className="max-w-[760px] text-[30px] font-semibold leading-[1.25] tracking-[-0.04em] text-[#171719] sm:text-[38px] sm:leading-[1.2]">
            {note.title}
          </h1>
          <p className="mt-4 max-w-[680px] text-[14px] leading-6 text-[#77777c]">{note.summary}</p>

          <div className="mt-7 flex items-center gap-3 border-y border-[#e6e6e8] py-3.5">
            <Avatar member={author} size="md" />
            <div className="min-w-0 text-[11px] leading-5">
              <p className="font-medium text-[#444448]">{author.name}</p>
              <p className="text-[#6f6f74]">
                {note.longDate} <span className="px-1" aria-hidden="true">·</span> {note.readTime}
              </p>
            </div>
            <div className="ml-auto hidden min-w-0 items-center gap-2 text-right text-[11px] text-[#7f7f84] sm:flex">
              <BookIcon className="h-3.5 w-3.5 shrink-0 text-[#77777c]" />
              <span className="truncate">
                『{note.book}』 <span className="text-[#77777c]">· {note.bookAuthor}</span>
              </span>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2 text-[11px] text-[#7f7f84] sm:hidden">
            <BookIcon className="h-3.5 w-3.5 shrink-0 text-[#77777c]" />
            <span className="truncate">『{note.book}』 · {note.bookAuthor}</span>
          </div>
        </header>

        <div className="mt-10 max-w-[740px]">
          {note.body.map((block, index) => {
            if (block.type === "heading") {
              return (
                <h2
                  key={`${block.type}-${index}`}
                  className="mb-4 mt-10 text-[19px] font-semibold tracking-[-0.02em] text-[#242427]"
                >
                  {block.content}
                </h2>
              );
            }
            if (block.type === "quote") {
              return (
                <blockquote
                  key={`${block.type}-${index}`}
                  className="my-8 border-l-2 border-[#b7b7ba] py-0.5 pl-5 text-[16px] leading-7 text-[#55555a] sm:text-[17px] sm:leading-8"
                >
                  {block.content}
                </blockquote>
              );
            }
            return (
              <p
                key={`${block.type}-${index}`}
                className="mb-5 text-[15px] leading-[1.85] tracking-[-0.005em] text-[#3a3a3e] sm:text-[16px]"
              >
                {block.content}
              </p>
            );
          })}
        </div>
      </article>

      <DiscussionThread noteSlug={note.slug} initialComments={note.comments} />
    </main>
  );
}
