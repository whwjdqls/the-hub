import "server-only";

import { getViewer, type Viewer } from "@/lib/auth";
import { getMember, weeklyProgress, type Member } from "@/lib/data";
import { demoPeriod, getCurrentPeriod, type TrackerPeriod } from "@/lib/period";
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
  source: "demo" | "live" | "setup-required";
  rows: ProgressRow[];
  period: TrackerPeriod;
  viewer: Viewer | null;
};

function demoState(): DashboardState {
  return {
    source: "demo",
    period: demoPeriod,
    viewer: null,
    rows: weeklyProgress.map((progress) => ({
      member: getMember(progress.memberId),
      note: progress.note,
      comments: progress.comments,
      passUsed: progress.passUsed,
      passApplied: progress.passApplied,
      isCurrentUser: progress.memberId === "jiho",
    })),
  };
}

export async function getDashboardState(): Promise<DashboardState> {
  if (!isSupabaseConfigured()) return demoState();

  const period = getCurrentPeriod();
  const viewer = await getViewer();
  if (!viewer) return { ...demoState(), period, source: "setup-required" };

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
    return { ...demoState(), period, viewer, source: "setup-required" };
  }

  if (!profilesResult.data?.length) {
    return { ...demoState(), period, viewer, source: "setup-required" };
  }

  const checkins = new Map(
    (checkinsResult.data ?? []).map((item) => [item.user_id, item]),
  );
  const passes = new Map((passesResult.data ?? []).map((item) => [item.user_id, item]));
  const rows: ProgressRow[] = (profilesResult.data ?? []).map((profile) => {
    const checkin = checkins.get(profile.id);
    const displayName = profile.display_name || "Member";
    return {
      member: {
        id: profile.id,
        name: displayName,
        initial: displayName.slice(-1),
        role: profile.role || "Member",
      },
      note: checkin?.note_submitted ? "작성" : "대기",
      comments: checkin?.comments_completed ? "완료" : "진행중",
      passUsed: passes.has(profile.id),
      passApplied: passes.get(profile.id)?.week_start === period.weekStart,
      isCurrentUser: profile.id === viewer.id,
    };
  });

  return { source: "live", period, viewer, rows };
}
