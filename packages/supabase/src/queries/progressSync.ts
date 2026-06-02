import {
  recalculateAreaProgress,
  todayDateString,
  type AreaId
} from "@renace/core";
import type { RenaceClient } from "../types/database";
import { upsertAreaProgress } from "./areaProgress";
import { getProfile } from "./profile";
import { getTodayMood } from "./mood";
import { listJournal } from "./journal";
import { listTriggers } from "./triggers";
import { listMilestones } from "./timeline";
import { listConsultRequests, getActiveLegalCase } from "./legal";
import { listMyApplications } from "./jobs";
import { listRecentMoods } from "./mood";

const AREAS: AreaId[] = ["emocional", "fisica", "juridica", "laboral", "comunidad"];

/**
 * Recopila actividad del usuario, recalcula las 5 áreas y opcionalmente
 * incrementa day_in_program si es un día nuevo de actividad.
 */
export async function syncUserProgress(
  client: RenaceClient,
  userId: string,
  options: { bumpDay?: boolean } = { bumpDay: true }
): Promise<void> {
  const today = todayDateString();

  const [
    profile,
    todayMood,
    journal,
    triggers,
    milestones,
    consults,
    legalCase,
    recentMoods,
    applications,
    enrollmentsRes,
    attendancesRes,
    myPostsRes
  ] = await Promise.all([
    getProfile(client, userId),
    getTodayMood(client, userId),
    listJournal(client, userId, 50),
    listTriggers(client, userId),
    listMilestones(client, userId),
    listConsultRequests(client, userId),
    getActiveLegalCase(client, userId),
    listRecentMoods(client, userId, 30),
    listMyApplications(client, userId),
    client
      .from("course_enrollments")
      .select("progress_percent, completed_at, course:courses!course_enrollments_course_id_fkey(area, kind)")
      .eq("user_id", userId),
    client.from("event_attendees").select("event_id").eq("user_id", userId),
    client
      .from("community_posts")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
  ]);

  if (!profile) return;

  type EnrollRow = {
    progress_percent: number;
    completed_at: string | null;
    course: { area: AreaId; kind: string } | { area: AreaId; kind: string }[] | null;
  };

  const enrollments = ((enrollmentsRes.data as EnrollRow[] | null) ?? [])
    .map((row) => {
      const courseRaw = Array.isArray(row.course) ? row.course[0] : row.course;
      if (!courseRaw || courseRaw.kind === "live_class") return null;
      return {
        area: courseRaw.area,
        progress_percent: row.progress_percent,
        completed: row.completed_at !== null
      };
    })
    .filter((e): e is NonNullable<typeof e> => e !== null);

  const patches = recalculateAreaProgress({
    enrollments,
    moodCount: recentMoods.length,
    hasMoodToday: todayMood !== null,
    journalCount: journal.length,
    triggersCount: triggers.length,
    milestonesDone: milestones.filter((m) => m.status === "done").length,
    milestonesTotal: milestones.length,
    consultCount: consults.length,
    hasLegalCase: legalCase !== null,
    postCount: myPostsRes.count ?? 0,
    eventAttendances: attendancesRes.data?.length ?? 0,
    jobApplications: applications.length
  });

  await Promise.all(
    AREAS.map((area) => upsertAreaProgress(client, userId, area, patches[area]))
  );

  if (!options.bumpDay) return;

  const lastActive = profile.last_active_date ?? null;

  if (lastActive === today) return;

  const nextDay = profile.day_in_program + 1;
  const { error } = await client
    .from("profiles")
    .update({ day_in_program: nextDay, last_active_date: today })
    .eq("id", userId);

  if (error) {
    await client.from("profiles").update({ day_in_program: nextDay }).eq("id", userId);
  }
}
