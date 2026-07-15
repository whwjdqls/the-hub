"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookIcon, CalendarIcon, TimelineIcon } from "@/components/icons";
import type { Viewer } from "@/lib/auth";

const navigation = [
  { href: "/", label: "Current Week", icon: CalendarIcon },
  { href: "/timeline", label: "Timeline", icon: TimelineIcon },
  { href: "/books", label: "Books", icon: BookIcon },
];

function isActive(pathname: string, href: string) {
  if (pathname.startsWith("/notes/")) {
    return href === "/";
  }
  if (href === "/") return pathname === "/";
  return pathname.startsWith(href);
}

export function Sidebar({
  viewer,
  authConfigured,
}: {
  viewer: Viewer | null;
  authConfigured: boolean;
}) {
  const pathname = usePathname();

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[var(--sidebar-width)] flex-col border-r border-[#e6e6e8] bg-[#fafafa] md:flex">
        <div className="flex h-16 items-center border-b border-[#e6e6e8] px-5">
          <Link
            href="/"
            className="flex items-center gap-2.5 text-[13px] font-semibold tracking-[0.16em] text-[#171719]"
            aria-label="HUB 홈"
          >
            <span className="grid h-5 w-5 place-items-center bg-[#171719] text-[10px] font-semibold tracking-normal text-white">
              H
            </span>
            HUB
          </Link>
        </div>

        <nav className="flex-1 px-3 py-5" aria-label="주요 메뉴">
          <p className="mb-2 px-2 text-[10px] font-medium uppercase tracking-[0.14em] text-[#737378]">
            Workspace
          </p>
          <div className="space-y-0.5">
            {navigation.map((item) => {
              const active = isActive(pathname, item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`relative flex h-9 items-center gap-2.5 px-2 text-[13px] ${
                    active
                      ? "bg-[#eeeeef] font-medium text-[#171719]"
                      : "text-[#6b6b70] hover:bg-[#f3f3f3] hover:text-[#171719]"
                  }`}
                >
                  {active && <span className="absolute inset-y-2 left-0 w-px bg-[#171719]" />}
                  <Icon className="h-[15px] w-[15px]" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="border-t border-[#e6e6e8] px-5 py-4">
          {viewer ? (
            <div className="flex items-center gap-2.5">
              <span className="grid h-7 w-7 shrink-0 place-items-center border border-[#dcdcdf] bg-[#eeeeef] text-[10px] font-medium">
                {viewer.name.slice(-1)}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[11px] font-medium text-[#3f3f43]">{viewer.name}</p>
                <p className="truncate text-[10px] text-[#737378]">{viewer.email}</p>
              </div>
              <form action="/auth/signout" method="post">
                <button type="submit" className="text-[10px] text-[#737378] hover:text-[#171719]">
                  Log out
                </button>
              </form>
            </div>
          ) : authConfigured ? (
            <Link href="/auth/login" className="text-[11px] font-medium text-[#4a4a4f] hover:text-black">
              Log in to workspace →
            </Link>
          ) : (
            <p className="text-[11px] leading-5 text-[#737378]">Supabase 연결 후<br />워크스페이스가 시작됩니다.</p>
          )}
        </div>
      </aside>

      <header className="fixed inset-x-0 top-0 z-40 flex h-14 items-center justify-between border-b border-[#e6e6e8] bg-white/95 px-4 backdrop-blur-sm md:hidden">
        <Link
          href="/"
          className="flex items-center gap-2 text-[12px] font-semibold tracking-[0.15em]"
          aria-label="HUB 홈"
        >
          <span className="grid h-5 w-5 place-items-center bg-[#171719] text-[9px] tracking-normal text-white">
            H
          </span>
          HUB
        </Link>
        <nav className="flex h-full items-center gap-4" aria-label="모바일 메뉴">
          {navigation.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`relative flex h-full items-center text-[12px] ${
                  active ? "font-medium text-[#171719]" : "text-[#717176]"
                }`}
              >
                {item.label}
                {active && <span className="absolute inset-x-0 bottom-0 h-px bg-[#171719]" />}
              </Link>
            );
          })}
          {authConfigured &&
            (viewer ? (
              <form action="/auth/signout" method="post" className="h-full">
                <button type="submit" className="flex h-full items-center text-[10px] text-[#717176]">
                  Logout
                </button>
              </form>
            ) : (
              <Link href="/auth/login" className="flex h-full items-center text-[10px] text-[#717176]">
                Login
              </Link>
            ))}
        </nav>
      </header>
    </>
  );
}
