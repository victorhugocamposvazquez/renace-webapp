"use server";

import { markInterested } from "@renace/supabase";
import { requireUser } from "@/lib/auth";
import { syncProgressAndRevalidate } from "@/lib/progress";

export async function markInterestedAction(formData: FormData) {
  const { client, userId } = await requireUser();
  const offerId = formData.get("offerId");
  if (typeof offerId !== "string") {
    return { ok: false as const, error: "Falta oferta" };
  }
  await markInterested(client, userId, offerId);
  await syncProgressAndRevalidate(client, userId);
  return { ok: true as const };
}
