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

/**
 * Devuelve la primera entrada de diario del usuario (la más antigua).
 * En la práctica, esta es la "intención inicial" que escribió durante el
 * onboarding. Se usa para destacarla en la home las primeras semanas.
 */
export async function getFirstJournal(
  client: RenaceClient,
  userId: string
): Promise<JournalEntry | null> {
  const { data, error } = await client
    .from("journal_entries")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();
  if (error) {
    console.warn("[journal] getFirstJournal failed:", error.message);
    return null;
  }
  return data ?? null;
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
