import type { RenaceClient, MoodLog } from "../types/database";

export async function listRecentMoods(
  client: RenaceClient,
  userId: string,
  limit = 14
): Promise<MoodLog[]> {
  const { data, error } = await client
    .from("mood_logs")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data ?? [];
}

export async function getTodayMood(
  client: RenaceClient,
  userId: string
): Promise<MoodLog | null> {
  const since = new Date();
  since.setHours(0, 0, 0, 0);
  const { data, error } = await client
    .from("mood_logs")
    .select("*")
    .eq("user_id", userId)
    .gte("created_at", since.toISOString())
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function logMood(
  client: RenaceClient,
  userId: string,
  input: { score: number; note?: string | null }
): Promise<MoodLog> {
  const { data, error } = await client
    .from("mood_logs")
    .insert({ user_id: userId, score: input.score, note: input.note ?? null })
    .select("*")
    .single();
  if (error) throw error;
  return data;
}
