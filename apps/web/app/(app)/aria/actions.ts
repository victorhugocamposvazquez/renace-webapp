"use server";

import { revalidatePath } from "next/cache";
import { clearAriaHistory } from "@renace/supabase";
import { requireUser } from "@/lib/auth";

/**
 * Borra todo el historial de mensajes de Aria persistido en BD para el
 * usuario actual. No afecta a sus datos de mood, journal ni perfil.
 */
export async function clearAriaHistoryAction() {
  const { client, userId } = await requireUser();
  await clearAriaHistory(client, userId);
  revalidatePath("/aria");
  return { ok: true as const };
}
