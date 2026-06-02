import type { RenaceClient } from "../types/database";

export type CravingLog = {
  id: string;
  user_id: string;
  intensity: number;
  note: string | null;
  trigger_id: string | null;
  created_at: string;
};

export async function logCraving(
  client: RenaceClient,
  userId: string,
  input: { intensity: number; note?: string | null; triggerId?: string | null }
): Promise<CravingLog> {
  const { data, error } = await client
    .from("craving_logs")
    .insert({
      user_id: userId,
      intensity: input.intensity,
      note: input.note ?? null,
      trigger_id: input.triggerId ?? null
    })
    .select("*")
    .single();
  if (error) throw error;
  return data as CravingLog;
}

export async function listRecentCravings(
  client: RenaceClient,
  userId: string,
  limit = 30
): Promise<CravingLog[]> {
  const { data, error } = await client
    .from("craving_logs")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []) as CravingLog[];
}
