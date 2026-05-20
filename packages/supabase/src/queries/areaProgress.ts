import type { RenaceClient, AreaProgress, AreaId } from "../types/database";

export async function listAreaProgress(
  client: RenaceClient,
  userId: string
): Promise<AreaProgress[]> {
  const { data, error } = await client
    .from("area_progress")
    .select("*")
    .eq("user_id", userId);
  if (error) throw error;
  return data ?? [];
}

export async function upsertAreaProgress(
  client: RenaceClient,
  userId: string,
  area: AreaId,
  patch: Partial<Omit<AreaProgress, "user_id" | "area" | "updated_at">>
): Promise<AreaProgress> {
  const { data, error } = await client
    .from("area_progress")
    .upsert(
      {
        user_id: userId,
        area,
        percent: patch.percent ?? 0,
        status: patch.status ?? "on_track"
      },
      { onConflict: "user_id,area" }
    )
    .select("*")
    .single();
  if (error) throw error;
  return data;
}

/**
 * Hidrata todas las áreas devolviendo siempre las 5 (default 0/on_track si no existen).
 */
export function fillAllAreas(rows: AreaProgress[], userId: string): AreaProgress[] {
  const areas: AreaId[] = ["emocional", "fisica", "juridica", "laboral", "comunidad"];
  const byArea = new Map(rows.map((r) => [r.area, r]));
  return areas.map(
    (area) =>
      byArea.get(area) ?? {
        user_id: userId,
        area,
        percent: 0,
        status: "on_track" as const,
        updated_at: new Date().toISOString()
      }
  );
}
