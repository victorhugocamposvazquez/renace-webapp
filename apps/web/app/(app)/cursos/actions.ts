"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import {
  enrollInCourse,
  updateCourseProgress,
  toggleClassReminder
} from "@renace/supabase";

export type CoursesActionResult =
  | { ok: true }
  | { ok: true; reminder_set: boolean }
  | { error: string };

/* ------------------------------------------------------------------ */
/* enroll / continuar                                                  */
/* ------------------------------------------------------------------ */
export async function enrollCourseAction(
  _prev: unknown,
  formData: FormData
): Promise<CoursesActionResult> {
  const courseId = String(formData.get("courseId") ?? "");
  if (!courseId) return { error: "Curso no válido." };
  const { client, userId } = await requireUser();
  try {
    await enrollInCourse(client, userId, courseId);
  } catch {
    return { error: "No pudimos inscribirte. Intenta de nuevo." };
  }
  revalidatePath("/laboral");
  revalidatePath("/emocional");
  revalidatePath("/fisica");
  revalidatePath("/cursos");
  return { ok: true };
}

/* ------------------------------------------------------------------ */
/* updateProgress (cliente envía progress_percent + current_lesson)    */
/* ------------------------------------------------------------------ */
export async function updateProgressAction(
  _prev: unknown,
  formData: FormData
): Promise<CoursesActionResult> {
  const courseId = String(formData.get("courseId") ?? "");
  const progressRaw = formData.get("progress_percent");
  const lessonRaw = formData.get("current_lesson");
  const progress = Number.parseInt(String(progressRaw ?? "0"), 10);
  const lesson = Number.parseInt(String(lessonRaw ?? "0"), 10);
  if (!courseId || Number.isNaN(progress)) {
    return { error: "Datos inválidos." };
  }
  const { client, userId } = await requireUser();
  try {
    await updateCourseProgress(client, userId, courseId, {
      progress_percent: progress,
      current_lesson: Number.isNaN(lesson) ? 0 : lesson
    });
  } catch {
    return { error: "No pudimos guardar tu progreso." };
  }
  revalidatePath("/laboral");
  revalidatePath("/emocional");
  revalidatePath("/fisica");
  revalidatePath(`/cursos`);
  return { ok: true };
}

/* ------------------------------------------------------------------ */
/* reminder toggle                                                     */
/* ------------------------------------------------------------------ */
export async function toggleClassReminderAction(
  _prev: unknown,
  formData: FormData
): Promise<CoursesActionResult> {
  const courseId = String(formData.get("courseId") ?? "");
  if (!courseId) return { error: "Clase no válida." };
  const { client, userId } = await requireUser();
  try {
    const res = await toggleClassReminder(client, userId, courseId);
    revalidatePath("/fisica");
    revalidatePath("/emocional");
    revalidatePath("/cursos");
    return { ok: true, reminder_set: res.reminder_set };
  } catch {
    return { error: "No pudimos guardar el recordatorio." };
  }
}
