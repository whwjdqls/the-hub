import "server-only";

import { getViewer, type Viewer } from "@/lib/auth";
import { memberFromProfile, type Member } from "@/lib/models";
import { getCurrentPeriod, type TrackerPeriod } from "@/lib/period";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

export type ProgressRow = {
  member: Member;
  note: "작성" | "대기";
  comments: "완료" | "진행중";
  passUsed: boolean;
  passApplied: boolean;
  isCurrentUser: boolean;
};

export type DashboardState = {
  source: "live" | "setup-required" | "unconfigured";
  rows: ProgressRow[];
  period: TrackerPeriod;
  viewer: Viewer | null;
};

export async function getDashboardState(): Promise<DashboardState> {
  const period = getCurrentPeriod();
  if (!isSupabaseConfigured()) {
    return { source: "unconfigured", period, viewer: null, rows: [] };
  }
  const viewer = await getViewer();
  if (!viewer) return { source: "setup-required", period, viewer: null, rows: [] };

  const supabase = await createClient();
  const [profilesResult, checkinsResult, passesResult] = await Promise.all([
    supabase.from("profiles").select("id, display_name, role, created_at").order("created_at"),
    supabase
      .from("weekly_checkins")
      .select("user_id, note_submitted, comments_completed")
      .eq("week_start", period.weekStart),
    supabase
      .from("monthly_passes")
      .select("user_id, week_start")
      .eq("month_start", period.monthStart),
  ]);

  if (profilesResult.error || checkinsResult.error || passesResult.error) {
    return { source: "setup-required", period, viewer, rows: [] };
  }

  if (!profilesResult.data?.length) {
    return { source: "setup-required", period, viewer, rows: [] };
  }

  const checkins = new Map(
    (checkinsResult.data ?? []).map((item) => [item.user_id, item]),
  );
  const passes = new Map((passesResult.data ?? []).map((item) => [item.user_id, item]));
  const rows: ProgressRow[] = (profilesResult.data ?? []).map((profile) => {
    const checkin = checkins.get(profile.id);
    return {
      member: memberFromProfile(profile),
      note: checkin?.note_submitted ? "작성" : "대기",
      comments: checkin?.comments_completed ? "완료" : "진행중",
      passUsed: passes.has(profile.id),
      passApplied: passes.get(profile.id)?.week_start === period.weekStart,
      isCurrentUser: profile.id === viewer.id,
    };
  });

  return { source: "live", period, viewer, rows };
}
