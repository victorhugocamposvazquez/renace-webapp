import type { RenaceClient, Profile, AreaId } from "../types/database";

export async function getProfile(client: RenaceClient, userId: string): Promise<Profile | null> {
  const { data, error } = await client
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function completeOnboarding(
  client: RenaceClient,
  userId: string,
  input: { alias: string; areaFocus: AreaId[]; ariaName: string; ariaPersist: boolean }
): Promise<Profile> {
  const { data, error } = await client
    .from("profiles")
    .upsert(
      {
        id: userId,
        alias: input.alias,
        area_focus: input.areaFocus,
        aria_name: input.ariaName,
        aria_persist: input.ariaPersist,
        onboarding_completed: true
      },
      { onConflict: "id" }
    )
    .select("*")
    .single();
  if (error) throw error;
  return data;
}

export async function updateProfile(
  client: RenaceClient,
  userId: string,
  patch: Partial<{
    alias: string;
    area_focus: AreaId[];
    aria_name: string;
    aria_persist: boolean;
    city: string | null;
    age: number | null;
  }>
): Promise<Profile> {
  const { data, error } = await client
    .from("profiles")
    .update(patch)
    .eq("id", userId)
    .select("*")
    .single();
  if (error) throw error;
  return data;
}
