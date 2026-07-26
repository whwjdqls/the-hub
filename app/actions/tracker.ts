"use server";

import { revalidatePath } from "next/cache";
import { getCurrentPeriod } from "@/lib/period";
import { authenticatedClient } from "@/lib/supabase/authenticated";

export async function useMonthlyPass() {
  const { supabase, userId } = await authenticatedClient();
  const period = getCurrentPeriod();
  const { error } = await supabase.from("monthly_passes").insert({
    user_id: userId,
    month_start: period.monthStart,
    week_start: period.weekStart,
  });

  if (error && error.code !== "23505") throw new Error("패스를 사용하지 못했습니다.");
  const { data: existing } = await supabase
    .from("weekly_checkins")
    .select("note_submitted, comments_completed")
    .eq("user_id", userId)
    .eq("week_start", period.weekStart)
    .maybeSingle();
  await supabase.from("weekly_checkins").upsert(
    {
      user_id: userId,
      week_start: period.weekStart,
      note_submitted: existing?.note_submitted ?? false,
      comments_completed: existing?.comments_completed ?? false,
      note_status: "exempt",
      comments_status: "exempt",
    },
    { onConflict: "user_id,week_start" },
  );
  revalidatePath("/");
  revalidatePath("/history");
}
