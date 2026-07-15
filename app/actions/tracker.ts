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
  revalidatePath("/");
}
