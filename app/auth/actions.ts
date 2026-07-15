"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

function safeNext(value: FormDataEntryValue | null) {
  const next = typeof value === "string" ? value : "/";
  return next.startsWith("/") && !next.startsWith("//") ? next : "/";
}

function authErrorPath(path: string, message: string, next?: string) {
  const params = new URLSearchParams({ error: message });
  if (next) params.set("next", next);
  return `${path}?${params.toString()}`;
}

export async function login(formData: FormData) {
  if (!isSupabaseConfigured()) {
    redirect(authErrorPath("/auth/login", "Supabase 환경변수가 필요합니다."));
  }

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = safeNext(formData.get("next"));
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(authErrorPath("/auth/login", "이메일 또는 비밀번호를 확인해주세요.", next));
  }

  redirect(next);
}

export async function signup(formData: FormData) {
  if (!isSupabaseConfigured()) {
    redirect(authErrorPath("/auth/signup", "Supabase 환경변수가 필요합니다."));
  }

  const displayName = String(formData.get("displayName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const inviteCode = String(formData.get("inviteCode") ?? "").trim();
  const expectedInviteCode = process.env.HUB_INVITE_CODE;

  if (!expectedInviteCode) {
    redirect(authErrorPath("/auth/signup", "관리자가 초대 코드를 설정해야 합니다."));
  }
  if (inviteCode !== expectedInviteCode) {
    redirect(authErrorPath("/auth/signup", "워크스페이스 초대 코드가 올바르지 않습니다."));
  }

  if (displayName.length < 2) {
    redirect(authErrorPath("/auth/signup", "이름은 2자 이상 입력해주세요."));
  }
  if (password.length < 8) {
    redirect(authErrorPath("/auth/signup", "비밀번호는 8자 이상이어야 합니다."));
  }

  const requestHeaders = await headers();
  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? requestHeaders.get("origin");
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { display_name: displayName },
      emailRedirectTo: origin ? `${origin}/auth/callback` : undefined,
    },
  });

  if (error) {
    const message = error.message.toLowerCase().includes("already")
      ? "이미 가입된 이메일입니다."
      : "가입을 완료하지 못했습니다. 잠시 후 다시 시도해주세요.";
    redirect(authErrorPath("/auth/signup", message));
  }

  if (data.session) redirect("/");
  redirect(`/auth/check-email?email=${encodeURIComponent(email)}`);
}
