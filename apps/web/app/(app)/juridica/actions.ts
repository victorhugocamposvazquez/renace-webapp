"use server";

import { revalidatePath } from "next/cache";
import { ConsultRequestInputSchema, CONSULT_CATEGORY_LABEL } from "@renace/core";
import {
  createConsultRequest,
  deleteConsultRequest,
  ensureOpenLegalCase
} from "@renace/supabase";
import { requireUser } from "@/lib/auth";
import { syncProgressAndRevalidate } from "@/lib/progress";

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
  // Abrimos un expediente ligero para que la promesa "abriremos un expediente"
  // se cumpla en cuanto el usuario envía su primera consulta.
  await ensureOpenLegalCase(
    client,
    userId,
    `Consulta: ${CONSULT_CATEGORY_LABEL[parsed.data.category]}`
  ).catch(() => undefined);
  await syncProgressAndRevalidate(client, userId);
  revalidatePath("/juridica");
  return { ok: true as const };
}

export async function deleteConsultRequestAction(formData: FormData) {
  const { client, userId } = await requireUser();
  const id = formData.get("id");
  if (typeof id !== "string" || id.length === 0) {
    return { ok: false as const, error: "Consulta no encontrada" };
  }
  const deleted = await deleteConsultRequest(client, userId, id);
  if (!deleted) {
    return {
      ok: false as const,
      error:
        "No puedes borrar esta consulta porque ya está siendo revisada por el equipo legal."
    };
  }
  revalidatePath("/juridica");
  return { ok: true as const };
}
