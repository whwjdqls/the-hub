import "server-only";

import { getViewer } from "@/lib/auth";
import { memberFromProfile } from "@/lib/models";
import {
  getPreviousPeriods,
  getWeekDeadline,
  type TrackerPeriod,
} from "@/lib/period";
import type { OutcomeStatus, ProgressRow } from "@/lib/progress";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

export type WeekHistory = {
  period: TrackerPeriod;
  rows: ProgressRow[];
};

export async function getWeeklyHistory(): Promise<WeekHistory[]> {
  if (!isSupabaseConfigured()) return [];
  const viewer = await getViewer();
  if (!viewer) return [];
  const supabase = await createClient();
  const periods = getPreviousPeriods(Math.max(getPreviousPeriods(1)[0].weekNumber, 1));
  const starts = periods.map((period) => period.weekStart);
  const [profilesResult, checkinsResult, passesResult, notesResult] = await Promise.all([
    supabase.from("profiles").select("id, display_name, role, created_at").order("created_at"),
    supabase
      .from("weekly_checkins")
      .select("user_id, week_start, note_submitted, comments_completed, note_status, comments_status")
      .in("week_start", starts),
    supabase.from("monthly_passes").select("user_id, week_start, month_start"),
    supabase
      .from("reading_notes")
      .select("user_id, week_start, created_at")
      .in("week_start", starts),
  ]);
  if (
    profilesResult.error ||
    checkinsResult.error ||
    passesResult.error ||
    notesResult.error
  ) {
    return [];
  }

  const profiles = profilesResult.data ?? [];
  const checkins = checkinsResult.data ?? [];
  const passes = passesResult.data ?? [];
  const notes = notesResult.data ?? [];

  return periods.map((period) => {
    const deadline = getWeekDeadline(period.weekStart);
    const deadlinePassed = Date.now() >= deadline.getTime();
    const periodPasses = new Set(
      passes
        .filter((pass) => pass.week_start === period.weekStart)
        .map((pass) => pass.user_id),
    );
    const onTimeAuthors = new Set(
      notes
        .filter(
          (note) =>
            note.week_start === period.weekStart &&
            new Date(note.created_at).getTime() < deadline.getTime(),
        )
        .map((note) => note.user_id),
    );

    const rows: ProgressRow[] = profiles.map((profile) => {
      const checkin = checkins.find(
        (item) => item.user_id === profile.id && item.week_start === period.weekStart,
      );
      const passApplied = periodPasses.has(profile.id);
      const storedNote =
        (checkin?.note_status as OutcomeStatus | undefined) ??
        (checkin?.note_submitted ? "submitted" : "pending");
      const storedComments =
        (checkin?.comments_status as OutcomeStatus | undefined) ??
        (checkin?.comments_completed ? "submitted" : "pending");
      const hasEligibleOtherNote = [...onTimeAuthors].some((id) => id !== profile.id);
      const allOthersPassed = profiles
        .filter((other) => other.id !== profile.id)
        .every((other) => periodPasses.has(other.id));

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
        passUsed: passes.some((pass) => pass.user_id === profile.id),
        passApplied,
        isCurrentUser: profile.id === viewer.id,
      };
    });
    return { period, rows };
  });
}
