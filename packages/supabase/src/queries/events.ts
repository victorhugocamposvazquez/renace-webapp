import type { RenaceClient, LiveEvent } from "../types/database";

export type LiveEventWithAttendance = LiveEvent & {
  attendees: number;
  attending: boolean;
};

export async function listUpcomingEvents(
  client: RenaceClient,
  meId: string,
  limit = 10
): Promise<LiveEventWithAttendance[]> {
  const { data, error } = await client
    .from("live_events")
    .select(
      `id, title, kind, starts_at, capacity, description,
       attendees:event_attendees(user_id)`
    )
    .gte("starts_at", new Date().toISOString())
    .order("starts_at", { ascending: true })
    .limit(limit);
  if (error) throw error;

  type RawRow = LiveEvent & { attendees: { user_id: string }[] };
  return (data as unknown as RawRow[] | null ?? []).map((row) => ({
    id: row.id,
    title: row.title,
    kind: row.kind,
    starts_at: row.starts_at,
    capacity: row.capacity,
    description: row.description,
    attendees: row.attendees.length,
    attending: row.attendees.some((a) => a.user_id === meId)
  }));
}

/** Eventos a los que el usuario se apuntó, con la fecha en que lo hizo. */
export async function listAttendedEventActivity(
  client: RenaceClient,
  userId: string
): Promise<{ created_at: string; title: string }[]> {
  const { data, error } = await client
    .from("event_attendees")
    .select("created_at, event:live_events(title)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  type RawRow = {
    created_at: string;
    event: { title: string } | { title: string }[] | null;
  };
  return (data as unknown as RawRow[] | null ?? []).map((row) => ({
    created_at: row.created_at,
    title:
      (Array.isArray(row.event) ? row.event[0]?.title : row.event?.title) ??
      "Evento de la Red"
  }));
}

export async function toggleAttendance(
  client: RenaceClient,
  userId: string,
  eventId: string
): Promise<{ attending: boolean }> {
  const { data: existing, error: findErr } = await client
    .from("event_attendees")
    .select("event_id")
    .eq("event_id", eventId)
    .eq("user_id", userId)
    .maybeSingle();
  if (findErr) throw findErr;
  if (existing) {
    const { error } = await client
      .from("event_attendees")
      .delete()
      .eq("event_id", eventId)
      .eq("user_id", userId);
    if (error) throw error;
    return { attending: false };
  }
  const { error } = await client
    .from("event_attendees")
    .insert({ event_id: eventId, user_id: userId });
  if (error) throw error;
  return { attending: true };
}
