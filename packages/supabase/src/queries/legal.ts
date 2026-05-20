import type {
  RenaceClient,
  LegalCase,
  ConsultRequest,
  ConsultCategory
} from "../types/database";

export async function getActiveLegalCase(
  client: RenaceClient,
  userId: string
): Promise<LegalCase | null> {
  const { data, error } = await client
    .from("legal_cases")
    .select("*")
    .eq("user_id", userId)
    .in("status", ["open", "in_progress"])
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function listConsultRequests(
  client: RenaceClient,
  userId: string
): Promise<ConsultRequest[]> {
  const { data, error } = await client
    .from("consult_requests")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function createConsultRequest(
  client: RenaceClient,
  userId: string,
  input: { category: ConsultCategory; body: string }
): Promise<ConsultRequest> {
  const { data, error } = await client
    .from("consult_requests")
    .insert({ user_id: userId, category: input.category, body: input.body })
    .select("*")
    .single();
  if (error) throw error;
  return data;
}
