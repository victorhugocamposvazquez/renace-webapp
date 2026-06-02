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
