"use server";

import { revalidatePath } from "next/cache";
import { markInterested } from "@renace/supabase";
import { requireUser } from "@/lib/auth";

export async function markInterestedAction(formData: FormData) {
  const { client, userId } = await requireUser();
  const offerId = formData.get("offerId");
  if (typeof offerId !== "string") {
    return { ok: false as const, error: "Falta oferta" };
  }
  await markInterested(client, userId, offerId);
  revalidatePath("/laboral");
  return { ok: true as const };
}
