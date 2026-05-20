import type { RenaceClient, TimelineMilestone } from "../types/database";

export async function listMilestones(
  client: RenaceClient,
  userId: string
): Promise<TimelineMilestone[]> {
  const { data, error } = await client
    .from("timeline_milestones")
    .select("*")
    .eq("user_id", userId)
    .order("order_index", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function setMilestoneStatus(
  client: RenaceClient,
  userId: string,
  id: string,
  status: "pending" | "in_progress" | "done"
): Promise<TimelineMilestone> {
  const { data, error } = await client
    .from("timeline_milestones")
    .update({ status })
    .eq("id", id)
    .eq("user_id", userId)
    .select("*")
    .single();
  if (error) throw error;
  return data;
}

export async function seedDefaultMilestones(
  client: RenaceClient,
  userId: string,
  defaults: Array<{
    week: number;
    title: string;
    body: string;
    order_index: number;
    initial_status: "pending" | "in_progress" | "done";
  }>
): Promise<void> {
  const { data: existing, error: findErr } = await client
    .from("timeline_milestones")
    .select("id")
    .eq("user_id", userId)
    .limit(1);
  if (findErr) throw findErr;
  if (existing && existing.length > 0) return;

  const rows = defaults.map((d) => ({
    user_id: userId,
    week: d.week,
    title: d.title,
    body: d.body,
    order_index: d.order_index,
    status: d.initial_status
  }));
  const { error } = await client.from("timeline_milestones").insert(rows);
  if (error) throw error;
}
