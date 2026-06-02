import type { RenaceClient, AreaId, CourseEnrollment } from "../types/database";

export type EnrollmentActivity = {
  enrolled_at: string;
  last_seen_at: string;
  completed_at: string | null;
  progress_percent: number;
  title: string;
  area: AreaId;
};

type EnrollmentRow = CourseEnrollment & {
  course: { title: string; area: AreaId } | { title: string; area: AreaId }[] | null;
};

export async function listEnrollmentActivity(
  client: RenaceClient,
  userId: string
): Promise<EnrollmentActivity[]> {
  const { data, error } = await client
    .from("course_enrollments")
    .select(
      "enrolled_at, last_seen_at, completed_at, progress_percent, course:courses!course_enrollments_course_id_fkey(title, area)"
    )
    .eq("user_id", userId)
    .order("last_seen_at", { ascending: false });

  if (error) throw error;

  return ((data as unknown as EnrollmentRow[]) ?? []).flatMap((row) => {
    const courseRaw = Array.isArray(row.course) ? row.course[0] : row.course;
    if (!courseRaw) return [];
    return [
      {
        enrolled_at: row.enrolled_at,
        last_seen_at: row.last_seen_at,
        completed_at: row.completed_at,
        progress_percent: row.progress_percent,
        title: courseRaw.title,
        area: courseRaw.area
      }
    ];
  });
}

export type JobApplicationActivity = {
  created_at: string;
  title: string;
  company: string;
};

type ApplicationRow = {
  created_at: string;
  offer: { title: string; company: string } | { title: string; company: string }[] | null;
};

export async function listJobApplicationActivity(
  client: RenaceClient,
  userId: string
): Promise<JobApplicationActivity[]> {
  const { data, error } = await client
    .from("job_applications")
    .select("created_at, offer:job_offers(title, company)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return ((data as unknown as ApplicationRow[]) ?? []).flatMap((row) => {
    const offerRaw = Array.isArray(row.offer) ? row.offer[0] : row.offer;
    if (!offerRaw) return [];
    return [{ created_at: row.created_at, title: offerRaw.title, company: offerRaw.company }];
  });
}
