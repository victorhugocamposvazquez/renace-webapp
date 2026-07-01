import type { RenaceClient, ActivityKind } from "../types/database";

export type ActivityLog = {
  id: string;
  user_id: string;
  kind: string;
  payload: Record<string, unknown>;
  created_at: string;
};

export async function logActivity(
  client: RenaceClient,
  userId: string,
  input: { kind: ActivityKind | string; payload?: Record<string, unknown> }
): Promise<ActivityLog> {
  const { data, error } = await client
    .from("activity_logs")
    .insert({
      user_id: userId,
      kind: input.kind,
      payload: input.payload ?? {}
    })
    .select("*")
    .single();
  if (error) throw error;
  return data as ActivityLog;
}

export async function getTodayMicroActionDone(
  client: RenaceClient,
  userId: string,
  actionId: string
): Promise<boolean> {
  const since = new Date();
  since.setHours(0, 0, 0, 0);
  const { data, error } = await client
    .from("activity_logs")
    .select("id, payload")
    .eq("user_id", userId)
    .eq("kind", "micro_action")
    .gte("created_at", since.toISOString());
  if (error) throw error;
  return (data ?? []).some(
    (row) => (row.payload as { actionId?: string })?.actionId === actionId
  );
}

export async function listActivityLogs(
  client: RenaceClient,
  userId: string,
  limit = 100
): Promise<ActivityLog[]> {
  const { data, error } = await client
    .from("activity_logs")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []) as ActivityLog[];
}

export async function listActiveDates(
  client: RenaceClient,
  userId: string,
  days = 60
): Promise<string[]> {
  const since = new Date();
  since.setDate(since.getDate() - days);

  const [activities, moods, journals] = await Promise.all([
    client
      .from("activity_logs")
      .select("created_at")
      .eq("user_id", userId)
      .gte("created_at", since.toISOString()),
    client
      .from("mood_logs")
      .select("created_at")
      .eq("user_id", userId)
      .gte("created_at", since.toISOString()),
    client
      .from("journal_entries")
      .select("created_at")
      .eq("user_id", userId)
      .gte("created_at", since.toISOString())
  ]);

  const dates = new Set<string>();
  for (const row of activities.data ?? []) {
    dates.add(row.created_at.slice(0, 10));
  }
  for (const row of moods.data ?? []) {
    dates.add(row.created_at.slice(0, 10));
  }
  for (const row of journals.data ?? []) {
    dates.add(row.created_at.slice(0, 10));
  }
  return [...dates].sort();
}

export async function hasWeeklyCheckinThisWeek(
  client: RenaceClient,
  userId: string
): Promise<boolean> {
  const now = new Date();
  const day = now.getDay();
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((day + 6) % 7));
  monday.setHours(0, 0, 0, 0);

  const { data, error } = await client
    .from("activity_logs")
    .select("id")
    .eq("user_id", userId)
    .eq("kind", "weekly_checkin")
    .gte("created_at", monday.toISOString())
    .limit(1);
  if (error) throw error;
  return (data?.length ?? 0) > 0;
}

export async function getWeekActivitySummary(
  client: RenaceClient,
  userId: string
): Promise<{ activeDays: number; moodDays: number; actionsDone: number }> {
  const now = new Date();
  const day = now.getDay();
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((day + 6) % 7));
  monday.setHours(0, 0, 0, 0);
  const since = monday.toISOString();

  const [activities, moods] = await Promise.all([
    client
      .from("activity_logs")
      .select("kind, created_at")
      .eq("user_id", userId)
      .gte("created_at", since),
    client
      .from("mood_logs")
      .select("created_at")
      .eq("user_id", userId)
      .gte("created_at", since)
  ]);

  const dates = new Set<string>();
  for (const row of activities.data ?? []) {
    dates.add(row.created_at.slice(0, 10));
  }
  for (const row of moods.data ?? []) {
    dates.add(row.created_at.slice(0, 10));
  }

  const actionsDone =
    activities.data?.filter((a) => a.kind === "micro_action").length ?? 0;

  return {
    activeDays: dates.size,
    moodDays: moods.data?.length ?? 0,
    actionsDone
  };
}

function startOfTodayIso(): string {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

/** ¿Hay actividad del tipo indicado registrada hoy? */
export async function hasActivityKindToday(
  client: RenaceClient,
  userId: string,
  kind: string
): Promise<boolean> {
  const { data, error } = await client
    .from("activity_logs")
    .select("id")
    .eq("user_id", userId)
    .eq("kind", kind)
    .gte("created_at", startOfTodayIso())
    .limit(1);
  if (error) throw error;
  return (data?.length ?? 0) > 0;
}

/** ¿Hay entrada de diario hoy? */
export async function hasJournalToday(
  client: RenaceClient,
  userId: string
): Promise<boolean> {
  const { data, error } = await client
    .from("journal_entries")
    .select("id")
    .eq("user_id", userId)
    .gte("created_at", startOfTodayIso())
    .limit(1);
  if (error) throw error;
  return (data?.length ?? 0) > 0;
}

/** ¿El usuario visitó/progresó un curso hoy (last_seen_at)? */
export async function hasCourseSeenToday(
  client: RenaceClient,
  userId: string,
  courseId?: string
): Promise<boolean> {
  const since = startOfTodayIso();
  let q = client
    .from("course_enrollments")
    .select("course_id")
    .eq("user_id", userId)
    .gte("last_seen_at", since);
  if (courseId) q = q.eq("course_id", courseId);
  const { data, error } = await q.limit(1);
  if (error) throw error;
  return (data?.length ?? 0) > 0;
}

/** ¿Hay actividad física hoy (respiración, paseo o curso de área física)? */
export async function hasFisicaActivityToday(
  client: RenaceClient,
  userId: string
): Promise<boolean> {
  const since = startOfTodayIso();
  const [breathing, microActions, fisicaSeen] = await Promise.all([
    client
      .from("activity_logs")
      .select("id")
      .eq("user_id", userId)
      .eq("kind", "breathing")
      .gte("created_at", since)
      .limit(1),
    client
      .from("activity_logs")
      .select("payload")
      .eq("user_id", userId)
      .eq("kind", "micro_action")
      .gte("created_at", since),
    client
      .from("course_enrollments")
      .select("course:courses!course_enrollments_course_id_fkey(area)")
      .eq("user_id", userId)
      .gte("last_seen_at", since)
  ]);
  if (breathing.error) throw breathing.error;
  if (microActions.error) throw microActions.error;
  if (fisicaSeen.error) throw fisicaSeen.error;

  type FisicaSeenRow = {
    course: { area?: string } | { area?: string }[] | null;
  };

  if ((breathing.data?.length ?? 0) > 0) return true;
  const paseoDone = (microActions.data ?? []).some(
    (r) => (r.payload as { actionId?: string })?.actionId === "paseo"
  );
  if (paseoDone) return true;
  return ((fisicaSeen.data as FisicaSeenRow[] | null) ?? []).some((r) => {
    const courseRaw = Array.isArray(r.course) ? r.course[0] : r.course;
    return courseRaw?.area === "fisica";
  });
}

/** ¿Tiene recordatorio activo en alguna clase en directo? */
export async function hasLiveReminderToday(
  client: RenaceClient,
  userId: string
): Promise<boolean> {
  const { data, error } = await client
    .from("course_enrollments")
    .select("course:courses!course_enrollments_course_id_fkey(kind)")
    .eq("user_id", userId)
    .eq("reminder_set", true);
  if (error) throw error;

  type ReminderRow = {
    course: { kind?: string } | { kind?: string }[] | null;
  };

  return ((data as ReminderRow[] | null) ?? []).some((r) => {
    const courseRaw = Array.isArray(r.course) ? r.course[0] : r.course;
    return courseRaw?.kind === "live_class";
  });
}
