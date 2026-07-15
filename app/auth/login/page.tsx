import Link from "next/link";
import { login } from "@/app/auth/actions";
import { isSupabaseConfigured } from "@/lib/supabase/config";

type LoginPageProps = {
  searchParams: Promise<{ error?: string; next?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { error, next = "/" } = await searchParams;
  const configured = isSupabaseConfigured();

  return (
    <main className="fixed inset-0 z-50 grid min-h-screen place-items-center overflow-y-auto bg-white px-5 py-10">
      <div className="w-full max-w-[380px]">
        <Link
          href="/"
          className="mb-12 flex items-center justify-center gap-2.5 text-[13px] font-semibold tracking-[0.16em]"
        >
          <span className="grid h-6 w-6 place-items-center bg-[#171719] text-[10px] tracking-normal text-white">
            H
          </span>
          HUB
        </Link>

        <div className="border-y border-[#dedee0] py-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#737378]">
            Member access
          </p>
          <h1 className="mt-3 text-[25px] font-semibold tracking-[-0.035em]">로그인</h1>
          <p className="mt-2 text-[13px] leading-6 text-[#717176]">
            우리 팀의 독서 기록과 이번 달 패스를 확인하세요.
          </p>

          {!configured && (
            <p className="mt-5 border-l-2 border-[#d1242f] pl-3 text-[12px] leading-5 text-[#b4232c]">
              데모 모드입니다. 실제 로그인은 Supabase 환경변수를 연결하면 활성화됩니다.
            </p>
          )}
          {error && (
            <p className="mt-5 border-l-2 border-[#d1242f] pl-3 text-[12px] leading-5 text-[#b4232c]">
              {error}
            </p>
          )}

          <form action={login} className="mt-7 space-y-5">
            <input type="hidden" name="next" value={next} />
            <label className="block">
              <span className="mb-2 block text-[11px] font-medium text-[#55555a]">Email</span>
              <input
                name="email"
                type="email"
                autoComplete="email"
                required
                disabled={!configured}
                placeholder="you@company.com"
                className="h-10 w-full border border-[#cdcdcf] px-3 text-[13px] outline-none placeholder:text-[#77777c] focus:border-[#55555a] disabled:bg-[#fafafa]"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-[11px] font-medium text-[#55555a]">Password</span>
              <input
                name="password"
                type="password"
                autoComplete="current-password"
                required
                disabled={!configured}
                className="h-10 w-full border border-[#cdcdcf] px-3 text-[13px] outline-none focus:border-[#55555a] disabled:bg-[#fafafa]"
              />
            </label>
            <button
              type="submit"
              disabled={!configured}
              className="h-10 w-full bg-[#171719] text-[12px] font-medium text-white hover:bg-[#303033] disabled:cursor-not-allowed disabled:bg-[#b8b8bc]"
            >
              Log in
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-[12px] text-[#717176]">
          아직 계정이 없나요?{" "}
          <Link href="/auth/signup" className="font-medium text-[#242427] underline underline-offset-4">
            회원가입
          </Link>
        </p>
      </div>
    </main>
  );
}
