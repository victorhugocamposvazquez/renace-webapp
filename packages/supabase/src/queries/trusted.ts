import type { RenaceClient, TrustedContact } from "../types/database";

export async function listTrustedContacts(
  client: RenaceClient,
  userId: string
): Promise<TrustedContact[]> {
  const { data, error } = await client
    .from("trusted_contacts")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function addTrustedContact(
  client: RenaceClient,
  userId: string,
  input: { name: string; phone: string; relation?: string | null }
): Promise<TrustedContact> {
  const { data, error } = await client
    .from("trusted_contacts")
    .insert({
      user_id: userId,
      name: input.name,
      phone: input.phone,
      relation: input.relation ?? null
    })
    .select("*")
    .single();
  if (error) throw error;
  return data;
}

export async function deleteTrustedContact(
  client: RenaceClient,
  userId: string,
  id: string
): Promise<void> {
  const { error } = await client
    .from("trusted_contacts")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);
  if (error) throw error;
}
