import type { Metadata } from "next";
import { requireUser } from "@/lib/auth";
import { listCommunityPosts, listUpcomingEvents } from "@renace/supabase";
import { BackLink } from "@/components/BackLink";
import { AreaHeader } from "@/components/AreaHeader";
import { Composer } from "@/components/comunidad/Composer";
import { PostCard } from "@/components/comunidad/PostCard";
import { EventCard } from "@/components/comunidad/EventCard";

export const metadata: Metadata = { title: "Red · RENACE" };

export default async function ComunidadPage() {
  const { client, userId } = await requireUser();
  const [posts, events] = await Promise.all([
    listCommunityPosts(client, userId, 20),
    listUpcomingEvents(client, userId, 5)
  ]);
  const headline = events.find((e) => e.kind === "support_group") ?? events[0] ?? null;
  const otherEvents = events.filter((e) => e.id !== headline?.id);

  return (
    <div className="flex flex-1 flex-col gap-4 px-5 py-5">
      <BackLink />
      <AreaHeader area="comunidad" />

      {headline && <EventCard event={headline} />}

      {otherEvents.length > 0 && (
        <ul role="list" className="flex flex-col gap-2">
          {otherEvents.map((e) => (
            <li key={e.id}>
              <EventCard event={e} />
            </li>
          ))}
        </ul>
      )}

      <h2 className="label-eyebrow">Red</h2>
      <Composer />

      {posts.length === 0 ? (
        <p className="card text-sm text-ink-muted border-area-comunidad-border">
          Aún nadie ha publicado. Sé el primero en escribir.
        </p>
      ) : (
        <ul role="list" className="flex flex-col gap-2.5">
          {posts.map((p) => (
            <li key={p.id}>
              <PostCard post={p} currentUserId={userId} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
