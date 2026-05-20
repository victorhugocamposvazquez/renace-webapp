import type {
  RenaceClient,
  Course,
  CourseEnrollment,
  AreaId
} from "../types/database";

export type CourseWithEnrollment = Course & {
  enrollment: CourseEnrollment | null;
};

/* ------------------------------------------------------------------ */
/* Listings                                                            */
/* ------------------------------------------------------------------ */

export async function listCourses(client: RenaceClient): Promise<Course[]> {
  const { data, error } = await client
    .from("courses")
    .select("*")
    .order("title", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

/**
 * Curso por slug, con la inscripción del usuario actual si existe.
 */
export async function getCourseBySlug(
  client: RenaceClient,
  userId: string,
  slug: string
): Promise<CourseWithEnrollment | null> {
  const { data: course, error: courseErr } = await client
    .from("courses")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (courseErr) throw courseErr;
  if (!course) return null;
  const { data: enrollment, error: enrollErr } = await client
    .from("course_enrollments")
    .select("*")
    .eq("course_id", course.id)
    .eq("user_id", userId)
    .maybeSingle();
  if (enrollErr) throw enrollErr;
  return { ...course, enrollment: enrollment ?? null };
}

/**
 * Cursos on-demand (kind='course') de un área concreta, joined con la
 * inscripción del usuario si existe (progress, last_seen_at, etc.).
 */
export async function listAreaCourses(
  client: RenaceClient,
  userId: string,
  area: AreaId
): Promise<CourseWithEnrollment[]> {
  const { data, error } = await client
    .from("courses")
    .select(
      `
      *,
      enrollment:course_enrollments!course_enrollments_course_id_fkey(*)
    `
    )
    .eq("area", area)
    .eq("kind", "course")
    .order("created_at" as never, { ascending: true });
  if (error) throw error;

  type Row = Course & { enrollment: CourseEnrollment[] | null };
  return ((data as unknown as Row[]) ?? []).map((row) => {
    const mine =
      row.enrollment?.find((e) => e.user_id === userId) ?? null;
    const { enrollment: _enroll, ...course } = row;
    void _enroll;
    return { ...course, enrollment: mine };
  });
}

/**
 * Clases en directo (kind='live_class') próximas en un área concreta.
 * Joined con `reminder_set` del usuario.
 */
export async function listUpcomingLiveClasses(
  client: RenaceClient,
  userId: string,
  area: AreaId,
  limit = 6
): Promise<CourseWithEnrollment[]> {
  const { data, error } = await client
    .from("courses")
    .select(
      `
      *,
      enrollment:course_enrollments!course_enrollments_course_id_fkey(*)
    `
    )
    .eq("area", area)
    .eq("kind", "live_class")
    .gte("starts_at", new Date().toISOString())
    .order("starts_at", { ascending: true })
    .limit(limit);
  if (error) throw error;

  type Row = Course & { enrollment: CourseEnrollment[] | null };
  return ((data as unknown as Row[]) ?? []).map((row) => {
    const mine =
      row.enrollment?.find((e) => e.user_id === userId) ?? null;
    const { enrollment: _enroll, ...course } = row;
    void _enroll;
    return { ...course, enrollment: mine };
  });
}

/**
 * "Continuar viendo": cursos del usuario con progreso > 0 y no completados,
 * ordenados por última vez vistos.
 */
export async function listContinueWatching(
  client: RenaceClient,
  userId: string,
  limit = 6
): Promise<CourseWithEnrollment[]> {
  const { data, error } = await client
    .from("course_enrollments")
    .select(
      `
      *,
      course:courses!course_enrollments_course_id_fkey(*)
    `
    )
    .eq("user_id", userId)
    .is("completed_at", null)
    .gt("progress_percent", 0)
    .order("last_seen_at", { ascending: false })
    .limit(limit);
  if (error) throw error;

  type Row = CourseEnrollment & { course: Course | Course[] | null };
  const out: CourseWithEnrollment[] = [];
  for (const row of (data as unknown as Row[]) ?? []) {
    const courseRaw = Array.isArray(row.course) ? row.course[0] : row.course;
    if (!courseRaw) continue;
    const { course: _c, ...enrollment } = row;
    void _c;
    out.push({ ...courseRaw, enrollment });
  }
  return out;
}

/* ------------------------------------------------------------------ */
/* Mutations                                                           */
/* ------------------------------------------------------------------ */

/**
 * Inscribe a un usuario en un curso (o resetea el progreso si ya estaba).
 */
export async function enrollInCourse(
  client: RenaceClient,
  userId: string,
  courseId: string
): Promise<CourseEnrollment> {
  const { data, error } = await client
    .from("course_enrollments")
    .upsert(
      {
        user_id: userId,
        course_id: courseId,
        progress_percent: 0,
        current_lesson: 0,
        last_seen_at: new Date().toISOString()
      },
      { onConflict: "user_id,course_id", ignoreDuplicates: false }
    )
    .select("*")
    .single();
  if (error) throw error;
  return data;
}

/**
 * Actualiza el progreso del usuario en un curso. Si alcanza el 100% marca
 * `completed_at` automáticamente.
 */
export async function updateCourseProgress(
  client: RenaceClient,
  userId: string,
  courseId: string,
  input: { progress_percent: number; current_lesson?: number }
): Promise<CourseEnrollment> {
  const completedAt = input.progress_percent >= 100 ? new Date().toISOString() : null;
  const { data, error } = await client
    .from("course_enrollments")
    .upsert(
      {
        user_id: userId,
        course_id: courseId,
        progress_percent: Math.min(100, Math.max(0, input.progress_percent)),
        current_lesson: input.current_lesson ?? 0,
        last_seen_at: new Date().toISOString(),
        completed_at: completedAt
      },
      { onConflict: "user_id,course_id" }
    )
    .select("*")
    .single();
  if (error) throw error;
  return data;
}

/**
 * Activa / desactiva el recordatorio para una clase en directo.
 * Crea el row si no existe.
 */
export async function toggleClassReminder(
  client: RenaceClient,
  userId: string,
  courseId: string
): Promise<{ reminder_set: boolean }> {
  const { data: existing, error: findErr } = await client
    .from("course_enrollments")
    .select("reminder_set")
    .eq("user_id", userId)
    .eq("course_id", courseId)
    .maybeSingle();
  if (findErr) throw findErr;

  const next = !(existing?.reminder_set ?? false);
  const { error: upErr } = await client
    .from("course_enrollments")
    .upsert(
      {
        user_id: userId,
        course_id: courseId,
        reminder_set: next,
        last_seen_at: new Date().toISOString()
      },
      { onConflict: "user_id,course_id" }
    );
  if (upErr) throw upErr;
  return { reminder_set: next };
}
