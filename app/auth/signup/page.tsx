import Link from "next/link";
import { signup } from "@/app/auth/actions";
import { isSupabaseConfigured } from "@/lib/supabase/config";

type SignupPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function SignupPage({ searchParams }: SignupPageProps) {
  const { error } = await searchParams;
  const configured = isSupabaseConfigured();
  const signupReady = configured && Boolean(process.env.HUB_INVITE_CODE);

  return (
    <main className="fixed inset-0 z-50 grid min-h-screen place-items-center overflow-y-auto bg-white px-5 py-10">
      <div className="w-full max-w-[380px]">
        <Link
          href="/"
          className="mb-10 flex items-center justify-center gap-2.5 text-[13px] font-semibold tracking-[0.16em]"
        >
          <span className="grid h-6 w-6 place-items-center bg-[#171719] text-[10px] tracking-normal text-white">
            H
          </span>
          HUB
        </Link>

        <div className="border-y border-[#dedee0] py-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#737378]">
            Join workspace
          </p>
          <h1 className="mt-3 text-[25px] font-semibold tracking-[-0.035em]">회원가입</h1>
          <p className="mt-2 text-[13px] leading-6 text-[#717176]">
            한 워크스페이스에는 최대 5명까지 참여할 수 있습니다.
          </p>

          {!signupReady && (
            <p className="mt-5 border-l-2 border-[#d1242f] pl-3 text-[12px] leading-5 text-[#b4232c]">
              {configured
                ? "관리자가 HUB_INVITE_CODE를 설정해야 가입할 수 있습니다."
                : "데모 모드입니다. README의 Supabase 설정을 먼저 완료해주세요."}
            </p>
          )}
          {error && (
            <p className="mt-5 border-l-2 border-[#d1242f] pl-3 text-[12px] leading-5 text-[#b4232c]">
              {error}
            </p>
          )}

          <form action={signup} className="mt-7 space-y-5">
            <label className="block">
              <span className="mb-2 block text-[11px] font-medium text-[#55555a]">Name</span>
              <input
                name="displayName"
                type="text"
                autoComplete="name"
                minLength={2}
                maxLength={30}
                required
                disabled={!signupReady}
                placeholder="김민준"
                className="h-10 w-full border border-[#cdcdcf] px-3 text-[13px] outline-none placeholder:text-[#77777c] focus:border-[#55555a] disabled:bg-[#fafafa]"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-[11px] font-medium text-[#55555a]">Email</span>
              <input
                name="email"
                type="email"
                autoComplete="email"
                required
                disabled={!signupReady}
                placeholder="you@company.com"
                className="h-10 w-full border border-[#cdcdcf] px-3 text-[13px] outline-none placeholder:text-[#77777c] focus:border-[#55555a] disabled:bg-[#fafafa]"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-[11px] font-medium text-[#55555a]">Password</span>
              <input
                name="password"
                type="password"
                autoComplete="new-password"
                minLength={8}
                required
                disabled={!signupReady}
                placeholder="8자 이상"
                className="h-10 w-full border border-[#cdcdcf] px-3 text-[13px] outline-none placeholder:text-[#77777c] focus:border-[#55555a] disabled:bg-[#fafafa]"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-[11px] font-medium text-[#55555a]">Workspace code</span>
              <input
                name="inviteCode"
                type="password"
                autoComplete="off"
                required
                disabled={!signupReady}
                placeholder="팀 초대 코드"
                className="h-10 w-full border border-[#cdcdcf] px-3 text-[13px] outline-none placeholder:text-[#77777c] focus:border-[#55555a] disabled:bg-[#fafafa]"
              />
            </label>
            <button
              type="submit"
              disabled={!signupReady}
              className="h-10 w-full bg-[#171719] text-[12px] font-medium text-white hover:bg-[#303033] disabled:cursor-not-allowed disabled:bg-[#b8b8bc]"
            >
              Create account
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-[12px] text-[#717176]">
          이미 계정이 있나요?{" "}
          <Link href="/auth/login" className="font-medium text-[#242427] underline underline-offset-4">
            로그인
          </Link>
        </p>
      </div>
    </main>
  );
}
