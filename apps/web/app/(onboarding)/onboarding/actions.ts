"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { ProfileOnboardingSchema, DEFAULT_MILESTONES } from "@renace/core";
import {
  completeOnboarding,
  seedDefaultMilestones,
  upsertAreaProgress
} from "@renace/supabase";
import { requireUser } from "@/lib/auth";

export async function completeOnboardingAction(formData: FormData) {
  const { client, userId } = await requireUser();
  const parsed = ProfileOnboardingSchema.safeParse({
    alias: formData.get("alias"),
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
    ariaPersist: parsed.data.ariaPersist
  });

  await seedDefaultMilestones(client, userId, DEFAULT_MILESTONES);

  await Promise.all(
    parsed.data.areaFocus.map((area) =>
      upsertAreaProgress(client, userId, area, { percent: 0, status: "on_track" })
    )
  );

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
  redirect("/home");
}
