import type { RenaceClient, Course } from "../types/database";

export async function listCourses(client: RenaceClient): Promise<Course[]> {
  const { data, error } = await client
    .from("courses")
    .select("*")
    .order("title", { ascending: true });
  if (error) throw error;
  return data ?? [];
}
