"use server";

import { revalidatePath } from "next/cache";
import { LogActivitySchema } from "@renace/core";
import { logActivity, getTodayMicroActionDone } from "@renace/supabase";
import { requireUser } from "@/lib/auth";
import { syncProgressAndRevalidate } from "@/lib/progress";

export async function completeMicroActionAction(formData: FormData) {
  const { client, userId } = await requireUser();
  const actionId = formData.get("actionId");
  const title = formData.get("title");
  if (typeof actionId !== "string" || typeof title !== "string") {
    return { ok: false as const, error: "Acción no válida" };
  }

  const already = await getTodayMicroActionDone(client, userId, actionId);
  if (already) return { ok: true as const, already: true };

  await logActivity(client, userId, {
    kind: "micro_action",
    payload: { actionId, title }
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
