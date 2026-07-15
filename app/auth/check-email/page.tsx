import Link from "next/link";

type CheckEmailPageProps = {
  searchParams: Promise<{ email?: string }>;
};

export default async function CheckEmailPage({ searchParams }: CheckEmailPageProps) {
  const { email } = await searchParams;
  return (
    <main className="fixed inset-0 z-50 grid min-h-screen place-items-center bg-white px-5">
      <div className="w-full max-w-[420px] border-y border-[#dedee0] py-10 text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#737378]">
          Check your inbox
        </p>
        <h1 className="mt-4 text-[25px] font-semibold tracking-[-0.035em]">이메일을 확인해주세요</h1>
        <p className="mx-auto mt-3 max-w-sm text-[13px] leading-6 text-[#717176]">
          {email ? `${email}로 ` : ""}인증 링크를 보냈습니다. 링크를 열면 가입이 완료됩니다.
        </p>
        <Link
          href="/auth/login"
          className="mt-7 inline-flex h-9 items-center border border-[#cdcdcf] px-4 text-[12px] font-medium hover:border-[#77777c]"
        >
          로그인으로 돌아가기
        </Link>
      </div>
    </main>
  );
}
