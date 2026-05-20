import type { RenaceClient, JournalEntry } from "../types/database";

export async function listJournal(
  client: RenaceClient,
  userId: string,
  limit = 20
): Promise<JournalEntry[]> {
  const { data, error } = await client
    .from("journal_entries")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data ?? [];
}

export async function addJournalEntry(
  client: RenaceClient,
  userId: string,
  input: { content: string }
): Promise<JournalEntry> {
  const { data, error } = await client
    .from("journal_entries")
    .insert({ user_id: userId, content: input.content })
    .select("*")
    .single();
  if (error) throw error;
  return data;
}

export async function deleteJournalEntry(
  client: RenaceClient,
  userId: string,
  entryId: string
): Promise<void> {
  const { error } = await client
    .from("journal_entries")
    .delete()
    .eq("id", entryId)
    .eq("user_id", userId);
  if (error) throw error;
}
