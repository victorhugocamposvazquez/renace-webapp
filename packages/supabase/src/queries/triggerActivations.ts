import type { RenaceClient } from "../types/database";

export type TriggerActivation = {
  id: string;
  user_id: string;
  trigger_id: string;
  intensity: number | null;
  note: string | null;
  created_at: string;
  trigger?: { label: string } | null;
};

export async function logTriggerActivation(
  client: RenaceClient,
  userId: string,
  input: { triggerId: string; intensity?: number; note?: string | null }
): Promise<TriggerActivation> {
  await client
    .from("triggers")
    .update({ last_seen_at: new Date().toISOString() })
    .eq("id", input.triggerId)
    .eq("user_id", userId);

  const { data, error } = await client
    .from("trigger_activations")
    .insert({
      user_id: userId,
      trigger_id: input.triggerId,
      intensity: input.intensity ?? null,
      note: input.note ?? null
    })
    .select("*")
    .single();
  if (error) throw error;
  return data as TriggerActivation;
}

export async function listTriggerActivations(
  client: RenaceClient,
  userId: string,
  limit = 50
): Promise<TriggerActivation[]> {
  const { data, error } = await client
    .from("trigger_activations")
    .select("*, trigger:triggers(label)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []) as TriggerActivation[];
}
