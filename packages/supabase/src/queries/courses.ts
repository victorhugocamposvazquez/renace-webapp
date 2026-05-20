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
 *
 * Devuelve null si el curso no existe o si la migration `courses_v2` aún
 * no se aplicó.
 */
export async function getCourseBySlug(
  client: RenaceClient,
  userId: string,
  slug: string
): Promise<CourseWithEnrollment | null> {
  try {
    const { data: course, error: courseErr } = await client
      .from("courses")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();
    if (courseErr) throw courseErr;
    if (!course) return null;
    let enrollment: CourseEnrollment | null = null;
    try {
      const { data, error } = await client
        .from("course_enrollments")
        .select("*")
        .eq("course_id", course.id)
        .eq("user_id", userId)
        .maybeSingle();
      if (error) throw error;
      enrollment = data ?? null;
    } catch (err) {
      console.warn(
        "[courses] getCourseBySlug enrollment failed:",
        (err as Error).message
      );
    }
    return { ...course, enrollment };
  } catch (err) {
    console.warn("[courses] getCourseBySlug failed:", (err as Error).message);
    return null;
  }
}

/**
 * Cursos on-demand (kind='course') de un área concreta, joined con la
 * inscripción del usuario si existe (progress, last_seen_at, etc.).
 *
 * Defensive: si la migration `courses_v2` aún no se aplicó, devuelve [] en
 * lugar de tirar para que la página padre no rompa.
 */
export async function listAreaCourses(
  client: RenaceClient,
  userId: string,
  area: AreaId
): Promise<CourseWithEnrollment[]> {
  try {
    const { data, error } = await client
      .from("courses")
      .select(
        `
        *,
        enrollment:course_enrollments!course_enrollments_course_id_fkey(*)
      `
      )
      .eq("area", area)
      .eq("kind", "course");
    if (error) throw error;

    type Row = Course & { enrollment: CourseEnrollment[] | null };
    return ((data as unknown as Row[]) ?? []).map((row) => {
      const mine =
        row.enrollment?.find((e) => e.user_id === userId) ?? null;
      const { enrollment: _enroll, ...course } = row;
      void _enroll;
      return { ...course, enrollment: mine };
    });
  } catch (err) {
    console.warn("[courses] listAreaCourses failed:", (err as Error).message);
    return [];
  }
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
  try {
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
  } catch (err) {
    console.warn(
      "[courses] listUpcomingLiveClasses failed:",
      (err as Error).message
    );
    return [];
  }
}

/**
 * "Tu plan en marcha": cursos del usuario inscritos y NO completados,
 * ordenados por última vez vistos. Incluye los recién inscritos (0%) para
 * que el usuario sepa dónde retomar.
 *
 * Excluye `live_class`: las clases en directo se gestionan aparte con
 * `listMyUpcomingLiveClasses`.
 */
export async function listInProgressCourses(
  client: RenaceClient,
  userId: string,
  limit = 8
): Promise<CourseWithEnrollment[]> {
  try {
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
      .order("last_seen_at", { ascending: false })
      .limit(limit * 2); // pedimos margen porque luego filtramos live_class
    if (error) throw error;

    type Row = CourseEnrollment & { course: Course | Course[] | null };
    const out: CourseWithEnrollment[] = [];
    for (const row of (data as unknown as Row[]) ?? []) {
      const courseRaw = Array.isArray(row.course) ? row.course[0] : row.course;
      if (!courseRaw) continue;
      if (courseRaw.kind === "live_class") continue;
      const { course: _c, ...enrollment } = row;
      void _c;
      out.push({ ...courseRaw, enrollment });
      if (out.length >= limit) break;
    }
    return out;
  } catch (err) {
    console.warn(
      "[courses] listInProgressCourses failed:",
      (err as Error).message
    );
    return [];
  }
}

/**
 * Alias retro-compatible. @deprecated usar listInProgressCourses
 */
export const listContinueWatching = listInProgressCourses;

/**
 * Todas las clases en directo futuras (cualquier área), joined con la
 * inscripción del usuario para saber si tiene recordatorio.
 */
export async function listAllUpcomingLiveClasses(
  client: RenaceClient,
  userId: string,
  limit = 20
): Promise<CourseWithEnrollment[]> {
  try {
    const { data, error } = await client
      .from("courses")
      .select(
        `
        *,
        enrollment:course_enrollments!course_enrollments_course_id_fkey(*)
      `
      )
      .eq("kind", "live_class")
      .gte("starts_at", new Date().toISOString())
      .order("starts_at", { ascending: true })
      .limit(limit);
    if (error) throw error;
    type Row = Course & { enrollment: CourseEnrollment[] | null };
    return ((data as unknown as Row[]) ?? []).map((row) => {
      const mine = row.enrollment?.find((e) => e.user_id === userId) ?? null;
      const { enrollment: _e, ...course } = row;
      void _e;
      return { ...course, enrollment: mine };
    });
  } catch (err) {
    console.warn(
      "[courses] listAllUpcomingLiveClasses failed:",
      (err as Error).message
    );
    return [];
  }
}

/**
 * Todos los cursos on-demand del catálogo, joined con el enrollment del usuario.
 * Útil para el hub global agrupado por área.
 */
export async function listAllCourses(
  client: RenaceClient,
  userId: string
): Promise<CourseWithEnrollment[]> {
  try {
    const { data, error } = await client
      .from("courses")
      .select(
        `
        *,
        enrollment:course_enrollments!course_enrollments_course_id_fkey(*)
      `
      )
      .eq("kind", "course")
      .order("title", { ascending: true });
    if (error) throw error;
    type Row = Course & { enrollment: CourseEnrollment[] | null };
    return ((data as unknown as Row[]) ?? []).map((row) => {
      const mine = row.enrollment?.find((e) => e.user_id === userId) ?? null;
      const { enrollment: _e, ...course } = row;
      void _e;
      return { ...course, enrollment: mine };
    });
  } catch (err) {
    console.warn("[courses] listAllCourses failed:", (err as Error).message);
    return [];
  }
}

/**
 * Clases en directo futuras a las que el usuario tiene recordatorio activo.
 * Útil para destacar "Tus próximas clases" en home/hub.
 */
export async function listMyUpcomingLiveClasses(
  client: RenaceClient,
  userId: string,
  limit = 6
): Promise<CourseWithEnrollment[]> {
  try {
    const { data, error } = await client
      .from("course_enrollments")
      .select(
        `
        *,
        course:courses!course_enrollments_course_id_fkey(*)
      `
      )
      .eq("user_id", userId)
      .eq("reminder_set", true)
      .limit(limit * 3);
    if (error) throw error;
    type Row = CourseEnrollment & { course: Course | Course[] | null };
    const nowIso = new Date().toISOString();
    const out: CourseWithEnrollment[] = [];
    for (const row of (data as unknown as Row[]) ?? []) {
      const courseRaw = Array.isArray(row.course) ? row.course[0] : row.course;
      if (!courseRaw) continue;
      if (courseRaw.kind !== "live_class") continue;
      if (!courseRaw.starts_at || courseRaw.starts_at < nowIso) continue;
      const { course: _c, ...enrollment } = row;
      void _c;
      out.push({ ...courseRaw, enrollment });
    }
    out.sort((a, b) => (a.starts_at ?? "").localeCompare(b.starts_at ?? ""));
    return out.slice(0, limit);
  } catch (err) {
    console.warn(
      "[courses] listMyUpcomingLiveClasses failed:",
      (err as Error).message
    );
    return [];
  }
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
