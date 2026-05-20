"use server";

import { revalidatePath } from "next/cache";
import { ConsultRequestInputSchema } from "@renace/core";
import { createConsultRequest } from "@renace/supabase";
import { requireUser } from "@/lib/auth";

export async function submitConsultRequestAction(formData: FormData) {
  const { client, userId } = await requireUser();
  const parsed = ConsultRequestInputSchema.safeParse({
    category: formData.get("category"),
    body: formData.get("body")
  });
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }
  await createConsultRequest(client, userId, parsed.data);
  revalidatePath("/juridica");
  return { ok: true as const };
}
