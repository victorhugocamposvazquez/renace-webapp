"use server";

import { revalidatePath } from "next/cache";
import { MoodLogInputSchema, JournalEntryInputSchema, TriggerInputSchema, CravingLogSchema, type TriggerSeverity } from "@renace/core";
import {
  logMood,
  addJournalEntry,
  deleteJournalEntry,
  addTrigger,
  deleteTrigger,
  logCraving,
  logTriggerActivation
} from "@renace/supabase";
import { requireUser } from "@/lib/auth";
import { syncProgressAndRevalidate } from "@/lib/progress";

export async function logMoodAction(formData: FormData) {
  const { client, userId } = await requireUser();
  const parsed = MoodLogInputSchema.safeParse({
    score: Number(formData.get("score")),
    note: (formData.get("note") as string | null) ?? null
  });
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }
  await logMood(client, userId, parsed.data);
  await syncProgressAndRevalidate(client, userId);
  return { ok: true as const };
}

export async function addJournalAction(formData: FormData) {
  const { client, userId } = await requireUser();
  const parsed = JournalEntryInputSchema.safeParse({ content: formData.get("content") });
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }
  await addJournalEntry(client, userId, parsed.data);
  await syncProgressAndRevalidate(client, userId);
  return { ok: true as const };
}

export async function deleteJournalAction(formData: FormData) {
  const { client, userId } = await requireUser();
  const id = formData.get("id");
  if (typeof id !== "string" || id.length === 0) {
    return { ok: false as const, error: "Entrada no encontrada" };
  }
  await deleteJournalEntry(client, userId, id);
  revalidatePath("/emocional");
  return { ok: true as const };
}

export async function addTriggerAction(formData: FormData) {
  const { client, userId } = await requireUser();
  const severity = Number(formData.get("severity")) as TriggerSeverity;
  const parsed = TriggerInputSchema.safeParse({
    label: formData.get("label"),
    severity
  });
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }
  await addTrigger(client, userId, { label: parsed.data.label, severity: parsed.data.severity });
  await syncProgressAndRevalidate(client, userId);
  return { ok: true as const };
}

export async function deleteTriggerAction(formData: FormData) {
  const { client, userId } = await requireUser();
  const id = formData.get("id");
  if (typeof id !== "string") return { ok: false as const, error: "Falta id" };
  await deleteTrigger(client, userId, id);
  revalidatePath("/emocional");
  return { ok: true as const };
}

export async function logCravingAction(formData: FormData) {
  const { client, userId } = await requireUser();
  const parsed = CravingLogSchema.safeParse({
    intensity: Number(formData.get("intensity")),
    note: (formData.get("note") as string | null) ?? null,
    triggerId: (formData.get("triggerId") as string | null) || null
  });
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }
  await logCraving(client, userId, {
    intensity: parsed.data.intensity,
    note: parsed.data.note,
    triggerId: parsed.data.triggerId
  });
  await syncProgressAndRevalidate(client, userId);
  revalidatePath("/emocional");
  revalidatePath("/recorrido/dias");
  return { ok: true as const };
}

export async function activateTriggerAction(formData: FormData) {
  const { client, userId } = await requireUser();
  const triggerId = formData.get("triggerId");
  if (typeof triggerId !== "string") return { ok: false as const, error: "Falta trigger" };
  await logTriggerActivation(client, userId, { triggerId });
  await syncProgressAndRevalidate(client, userId);
  revalidatePath("/emocional");
  revalidatePath("/recorrido/dias");
  return { ok: true as const };
}
