import type { Metadata } from "next";
import { requireUser } from "@/lib/auth";
import {
  getTodayMood,
  listJournal,
  listTriggers,
  listRecentMoods,
  listUpcomingEvents
} from "@renace/supabase";
import { type MoodScore } from "@renace/core";
import { BackLink } from "@/components/BackLink";
import { AreaHeader } from "@/components/AreaHeader";
import { MoodPicker } from "@/components/emocional/MoodPicker";
import { JournalSection } from "@/components/emocional/JournalSection";
import { TriggersSection } from "@/components/emocional/TriggersSection";
import { MoodEvolution } from "@/components/emocional/MoodEvolution";
import { LiveEventCard } from "@/components/LiveEventCard";

export const metadata: Metadata = { title: "Emocional · RENACE" };

export default async function EmocionalPage() {
  const { client, userId } = await requireUser();
  const [today, journal, triggers, moods, events] = await Promise.all([
    getTodayMood(client, userId),
    listJournal(client, userId, 5),
    listTriggers(client, userId),
    listRecentMoods(client, userId, 14),
    listUpcomingEvents(client, userId, 1)
  ]);
  const supportEvent =
    events.find((e) => e.kind === "support_group") ?? events[0] ?? null;

  return (
    <div className="flex flex-1 flex-col gap-4 px-5 py-5">
      <BackLink href="/home" />
      <AreaHeader area="emocional" />

      <MoodPicker initialScore={(today?.score as MoodScore | null) ?? null} />

      {supportEvent && <LiveEventCard event={supportEvent} accent="#B83A66" />}

      <h2 className="label-eyebrow mt-2">Tus herramientas</h2>

      <JournalSection entries={journal} />
      <TriggersSection triggers={triggers} />
      <MoodEvolution moods={moods} />
    </div>
  );
}
