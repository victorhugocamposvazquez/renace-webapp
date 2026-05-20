import type { RenaceClient, Trigger } from "../types/database";

export async function listTriggers(
  client: RenaceClient,
  userId: string
): Promise<Trigger[]> {
  const { data, error } = await client
    .from("triggers")
    .select("*")
    .eq("user_id", userId)
    .order("severity", { ascending: false })
    .order("last_seen_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function addTrigger(
  client: RenaceClient,
  userId: string,
  input: { label: string; severity: 1 | 2 | 3 }
): Promise<Trigger> {
  const { data, error } = await client
    .from("triggers")
    .insert({ user_id: userId, label: input.label, severity: input.severity })
    .select("*")
    .single();
  if (error) throw error;
  return data;
}

export async function deleteTrigger(
  client: RenaceClient,
  userId: string,
  id: string
): Promise<void> {
  const { error } = await client
    .from("triggers")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);
  if (error) throw error;
}
