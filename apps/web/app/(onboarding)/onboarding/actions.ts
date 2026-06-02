"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import {
  ProfileOnboardingSchema,
  DEFAULT_MILESTONES,
  buildIntentJournalEntry
} from "@renace/core";
import {
  completeOnboarding,
  seedDefaultMilestones,
  upsertAreaProgress,
  addJournalEntry
} from "@renace/supabase";
import { requireUser } from "@/lib/auth";

export type OnboardingResult =
  | { ok: true }
  | { ok: false; error: string };

export async function completeOnboardingAction(
  formData: FormData
): Promise<OnboardingResult> {
  const { client, userId } = await requireUser();
  const parsed = ProfileOnboardingSchema.safeParse({
    alias: formData.get("alias"),
    reasons: formData.getAll("reasons"),
    areaFocus: formData.getAll("areaFocus"),
    ariaName: formData.get("ariaName") || "Aria",
    ariaPersist: formData.get("ariaPersist") === "on"
  });
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  await completeOnboarding(client, userId, {
    alias: parsed.data.alias,
    areaFocus: parsed.data.areaFocus,
    ariaName: parsed.data.ariaName,
    ariaPersist: parsed.data.ariaPersist,
    onboardingReasons: parsed.data.reasons
  });

  await seedDefaultMilestones(client, userId, DEFAULT_MILESTONES);

  await Promise.all(
    parsed.data.areaFocus.map((area) =>
      upsertAreaProgress(client, userId, area, { percent: 0, status: "on_track" })
    )
  );

  // Persistimos los motivos como la primera entrada de diario del usuario.
  // No bloqueamos el flujo si falla: el onboarding ya está completo.
  try {
    const content = buildIntentJournalEntry(parsed.data.reasons);
    await addJournalEntry(client, userId, { content });
  } catch (err) {
    console.warn("[onboarding] No se pudo guardar el journal inicial", err);
  }

  // Cookie de cache para que el middleware salte el query de profiles en cada
  // navegación. Ver lib/supabase/middleware.ts para detalle.
  const cookieStore = await cookies();
  cookieStore.set("renace_onboarded", "yes", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30,
    path: "/"
  });

  revalidatePath("/", "layout");
  return { ok: true };
}
