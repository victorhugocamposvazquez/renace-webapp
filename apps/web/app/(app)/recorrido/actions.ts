"use server";

import { revalidatePath } from "next/cache";
import { MilestoneStatusUpdateSchema } from "@renace/core";
import { setMilestoneStatus } from "@renace/supabase";
import { requireUser } from "@/lib/auth";

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
  revalidatePath("/recorrido");
  revalidatePath("/home");
  return { ok: true as const };
}
