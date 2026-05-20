"use server";

import { revalidatePath } from "next/cache";
import { CommunityPostInputSchema } from "@renace/core";
import {
  createCommunityPost,
  deleteCommunityPost,
  toggleLike,
  toggleAttendance
} from "@renace/supabase";
import { requireUser } from "@/lib/auth";

export async function createPostAction(formData: FormData) {
  const { client, userId } = await requireUser();
  const parsed = CommunityPostInputSchema.safeParse({ body: formData.get("body") });
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }
  await createCommunityPost(client, userId, parsed.data);
  revalidatePath("/comunidad");
  return { ok: true as const };
}

export async function deletePostAction(formData: FormData) {
  const { client, userId } = await requireUser();
  const id = formData.get("id");
  if (typeof id !== "string" || id.length === 0) {
    return { ok: false as const, error: "Post no encontrado" };
  }
  const deleted = await deleteCommunityPost(client, userId, id);
  if (!deleted) {
    return { ok: false as const, error: "Solo puedes borrar tus propios posts" };
  }
  revalidatePath("/comunidad");
  return { ok: true as const };
}

export async function toggleLikeAction(formData: FormData) {
  const { client, userId } = await requireUser();
  const postId = formData.get("postId");
  if (typeof postId !== "string") {
    return { ok: false as const, error: "Falta post" };
  }
  const r = await toggleLike(client, userId, postId);
  revalidatePath("/comunidad");
  return { ok: true as const, liked: r.liked };
}

export async function toggleAttendanceAction(formData: FormData) {
  const { client, userId } = await requireUser();
  const eventId = formData.get("eventId");
  if (typeof eventId !== "string") {
    return { ok: false as const, error: "Falta evento" };
  }
  const r = await toggleAttendance(client, userId, eventId);
  revalidatePath("/comunidad");
  return { ok: true as const, attending: r.attending };
}
