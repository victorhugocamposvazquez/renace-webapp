import type { RenaceClient, AriaMessage } from "../types/database";

export async function listAriaMessages(
  client: RenaceClient,
  userId: string,
  limit = 50
): Promise<AriaMessage[]> {
  const { data, error } = await client
    .from("aria_messages")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: true })
    .limit(limit);
  if (error) throw error;
  return data ?? [];
}

export async function persistAriaMessage(
  client: RenaceClient,
  userId: string,
  role: "user" | "assistant" | "system",
  content: string
): Promise<void> {
  const { error } = await client
    .from("aria_messages")
    .insert({ user_id: userId, role, content });
  if (error) throw error;
}

export async function clearAriaHistory(
  client: RenaceClient,
  userId: string
): Promise<void> {
  const { error } = await client
    .from("aria_messages")
    .delete()
    .eq("user_id", userId);
  if (error) throw error;
}
