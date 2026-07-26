import "server-only";

import { getViewer, type Viewer } from "@/lib/auth";
import { memberFromProfile, type Member } from "@/lib/models";
import { getCurrentPeriod, getWeekDeadline, type TrackerPeriod } from "@/lib/period";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

export type OutcomeStatus = "pending" | "submitted" | "late" | "exempt";

export type ProgressRow = {
  member: Member;
  note: OutcomeStatus;
  comments: OutcomeStatus;
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
  const [profilesResult, checkinsResult, passesResult, notesResult] = await Promise.all([
    supabase.from("profiles").select("id, display_name, role, created_at").order("created_at"),
    supabase
      .from("weekly_checkins")
      .select("user_id, note_submitted, comments_completed, note_status, comments_status")
      .eq("week_start", period.weekStart),
    supabase
      .from("monthly_passes")
      .select("user_id, week_start")
      .eq("month_start", period.monthStart),
    supabase
      .from("reading_notes")
      .select("user_id, created_at")
      .eq("week_start", period.weekStart),
  ]);

  if (profilesResult.error || checkinsResult.error || passesResult.error || notesResult.error) {
    return { source: "setup-required", period, viewer, rows: [] };
  }

  if (!profilesResult.data?.length) {
    return { source: "setup-required", period, viewer, rows: [] };
  }

  const checkins = new Map(
    (checkinsResult.data ?? []).map((item) => [item.user_id, item]),
  );
  const passes = new Map((passesResult.data ?? []).map((item) => [item.user_id, item]));
  const deadline = getWeekDeadline(period.weekStart);
  const deadlinePassed = Date.now() >= deadline.getTime();
  const onTimeNoteAuthors = new Set(
    (notesResult.data ?? [])
      .filter((note) => new Date(note.created_at).getTime() < deadline.getTime())
      .map((note) => note.user_id),
  );
  const rows: ProgressRow[] = (profilesResult.data ?? []).map((profile) => {
    const checkin = checkins.get(profile.id);
    const passApplied = passes.get(profile.id)?.week_start === period.weekStart;
    const hasEligibleOtherNote = [...onTimeNoteAuthors].some((id) => id !== profile.id);
    const allOthersPassed = (profilesResult.data ?? [])
      .filter((other) => other.id !== profile.id)
      .every((other) => passes.get(other.id)?.week_start === period.weekStart);
    const storedNote = (checkin?.note_status as OutcomeStatus | undefined)
      ?? (checkin?.note_submitted ? "submitted" : "pending");
    const storedComments = (checkin?.comments_status as OutcomeStatus | undefined)
      ?? (checkin?.comments_completed ? "submitted" : "pending");
    return {
      member: memberFromProfile(profile),
      note: passApplied ? "exempt" : storedNote,
      comments: passApplied
        ? "exempt"
        : storedComments !== "pending"
          ? storedComments
          : !hasEligibleOtherNote && (deadlinePassed || allOthersPassed)
            ? "exempt"
            : "pending",
      passUsed: passes.has(profile.id),
      passApplied,
      isCurrentUser: profile.id === viewer.id,
    };
  });

  return { source: "live", period, viewer, rows };
}
