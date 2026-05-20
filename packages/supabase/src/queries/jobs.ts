import type { RenaceClient, JobOffer, JobApplication } from "../types/database";

export async function listJobOffers(
  client: RenaceClient,
  limit = 20
): Promise<JobOffer[]> {
  const { data, error } = await client
    .from("job_offers")
    .select("*")
    .order("match_score", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data ?? [];
}

export async function listMyApplications(
  client: RenaceClient,
  userId: string
): Promise<JobApplication[]> {
  const { data, error } = await client
    .from("job_applications")
    .select("*")
    .eq("user_id", userId);
  if (error) throw error;
  return data ?? [];
}

export async function markInterested(
  client: RenaceClient,
  userId: string,
  offerId: string
): Promise<JobApplication> {
  const { data, error } = await client
    .from("job_applications")
    .upsert(
      { user_id: userId, offer_id: offerId, status: "interested" },
      { onConflict: "user_id,offer_id" }
    )
    .select("*")
    .single();
  if (error) throw error;
  return data;
}
