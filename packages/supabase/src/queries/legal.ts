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

/**
 * Borra una solicitud de consulta del propio usuario.
 * Solo se permite borrar si la consulta todavía está en estado `submitted`
 * (sin haber sido revisada por el equipo legal).
 *
 * Devuelve true si se borró, false si la consulta no era borrable
 * (ya estaba reviewing/scheduled/closed).
 */
export async function deleteConsultRequest(
  client: RenaceClient,
  userId: string,
  consultId: string
): Promise<boolean> {
  const { data, error } = await client
    .from("consult_requests")
    .delete()
    .eq("id", consultId)
    .eq("user_id", userId)
    .eq("status", "submitted")
    .select("id");
  if (error) throw error;
  return (data?.length ?? 0) > 0;
}
