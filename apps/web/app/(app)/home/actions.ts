"use server";

import { revalidatePath } from "next/cache";
import { LogActivitySchema } from "@renace/core";
import { logActivity, hasActivityKindToday } from "@renace/supabase";
import { requireUser } from "@/lib/auth";
import { syncProgressAndRevalidate } from "@/lib/progress";

/**
 * Marca la "acción del día" como hecha de forma explícita y persistente.
 * Se registra como activity_log kind `day_action`, de modo que el estado del
 * paso no dependa de heurísticas frágiles ni cambie si cambia el ánimo.
 */
export async function completeDayActionAction(formData: FormData) {
  const { client, userId } = await requireUser();
  const actionKind = formData.get("actionKind");

  const already = await hasActivityKindToday(client, userId, "day_action");
  if (already) return { ok: true as const, already: true };

  await logActivity(client, userId, {
    kind: "day_action",
    payload: { actionKind: typeof actionKind === "string" ? actionKind : "generic" }
  });
  await syncProgressAndRevalidate(client, userId);
  revalidatePath("/home");
  return { ok: true as const, already: false };
}

export async function logBreathingAction(formData: FormData) {
  const { client, userId } = await requireUser();
  const parsed = LogActivitySchema.safeParse({
    kind: "breathing",
    payload: {
      protocol: formData.get("protocol") ?? "4-7-8",
      durationSeconds: Number(formData.get("durationSeconds") ?? 120)
    }
  });
  if (!parsed.success) return { ok: false as const };

  await logActivity(client, userId, parsed.data);
  await syncProgressAndRevalidate(client, userId);
  return { ok: true as const };
}

export async function weeklyCheckinAction(formData: FormData) {
  const { client, userId } = await requireUser();
  const area = formData.get("area");
  if (typeof area !== "string") return { ok: false as const, error: "Área no válida" };

  await logActivity(client, userId, {
    kind: "weekly_checkin",
    payload: { focusArea: area }
  });
  await syncProgressAndRevalidate(client, userId);
  revalidatePath("/recorrido/dias");
  revalidatePath("/home");
  return { ok: true as const };
}
