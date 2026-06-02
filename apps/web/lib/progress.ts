import { revalidatePath } from "next/cache";
import { syncUserProgress, type RenaceClient } from "@renace/supabase";

const PROGRESS_PATHS = [
  "/home",
  "/perfil",
  "/emocional",
  "/fisica",
  "/juridica",
  "/laboral",
  "/comunidad",
  "/recorrido",
  "/cursos"
];

/** Sincroniza progreso del 360 y revalida las rutas principales. */
export async function syncProgressAndRevalidate(
  client: RenaceClient,
  userId: string,
  extraPaths: string[] = []
): Promise<void> {
  await syncUserProgress(client, userId);
  for (const p of [...PROGRESS_PATHS, ...extraPaths]) {
    revalidatePath(p);
  }
}
