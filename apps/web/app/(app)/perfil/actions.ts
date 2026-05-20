"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { TrustedContactInputSchema } from "@renace/core";
import {
  addTrustedContact,
  deleteTrustedContact,
  updateProfile
} from "@renace/supabase";
import { requireUser } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function addTrustedContactAction(formData: FormData) {
  const { client, userId } = await requireUser();
  const parsed = TrustedContactInputSchema.safeParse({
    name: formData.get("name"),
    phone: formData.get("phone"),
    relation: formData.get("relation") || null
  });
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }
  await addTrustedContact(client, userId, parsed.data);
  revalidatePath("/perfil");
  revalidatePath("/home");
  return { ok: true as const };
}

export async function deleteTrustedContactAction(formData: FormData) {
  const { client, userId } = await requireUser();
  const id = formData.get("id");
  if (typeof id !== "string") return { ok: false as const, error: "Falta id" };
  await deleteTrustedContact(client, userId, id);
  revalidatePath("/perfil");
  return { ok: true as const };
}

export async function updateAriaPreferenceAction(formData: FormData) {
  const { client, userId } = await requireUser();
  const persist = formData.get("persist") === "on";
  await updateProfile(client, userId, { aria_persist: persist });
  revalidatePath("/perfil");
  return { ok: true as const };
}

export async function signOutAction() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/login");
}
