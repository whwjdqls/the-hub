"use server";

import { revalidatePath } from "next/cache";
import { getCurrentPeriod } from "@/lib/period";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

async function authenticatedClient() {
  if (!isSupabaseConfigured()) throw new Error("Supabase is not configured.");
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;
  if (error || !userId) throw new Error("Authentication required.");
  return { supabase, userId };
}

export async function useMonthlyPass() {
  const { supabase, userId } = await authenticatedClient();
  const period = getCurrentPeriod();
  const { error } = await supabase.from("monthly_passes").insert({
    user_id: userId,
    month_start: period.monthStart,
    week_start: period.weekStart,
  });

  if (error && error.code !== "23505") throw new Error("패스를 사용하지 못했습니다.");
  revalidatePath("/");
}

export async function setWeeklyStatus(formData: FormData) {
  const field = String(formData.get("field") ?? "");
  const value = String(formData.get("value") ?? "") === "true";
  if (!new Set(["note_submitted", "comments_completed"]).has(field)) {
    throw new Error("Invalid status field.");
  }

  const { supabase, userId } = await authenticatedClient();
  const period = getCurrentPeriod();
  const { data: existing, error: readError } = await supabase
    .from("weekly_checkins")
    .select("note_submitted, comments_completed")
    .eq("user_id", userId)
    .eq("week_start", period.weekStart)
    .maybeSingle();

  if (readError) throw new Error("현재 상태를 불러오지 못했습니다.");

  const payload = {
    user_id: userId,
    week_start: period.weekStart,
    note_submitted: existing?.note_submitted ?? false,
    comments_completed: existing?.comments_completed ?? false,
    [field]: value,
  };
  const { error } = await supabase
    .from("weekly_checkins")
    .upsert(payload, { onConflict: "user_id,week_start" });

  if (error) throw new Error("이번 주 상태를 저장하지 못했습니다.");
  revalidatePath("/");
}
