"use server";

import { MilestoneStatusUpdateSchema } from "@renace/core";
import { setMilestoneStatus } from "@renace/supabase";
import { requireUser } from "@/lib/auth";
import { syncProgressAndRevalidate } from "@/lib/progress";

export async function updateMilestoneStatusAction(formData: FormData) {
  const { client, userId } = await requireUser();
  const parsed = MilestoneStatusUpdateSchema.safeParse({
    id: formData.get("id"),
    status: formData.get("status")
  });
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }
  await setMilestoneStatus(client, userId, parsed.data.id, parsed.data.status);
  await syncProgressAndRevalidate(client, userId);
  return { ok: true as const };
}
