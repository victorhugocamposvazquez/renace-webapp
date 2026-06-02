import type { Metadata } from "next";
import { requireUser } from "@/lib/auth";
import {
  getTodayMood,
  listJournal,
  listTriggers,
  listRecentMoods,
  listUpcomingEvents,
  listAreaCourses,
  listUpcomingLiveClasses,
  listInProgressCourses
} from "@renace/supabase";
import { type MoodScore } from "@renace/core";
import { BackLink } from "@/components/BackLink";
import { AreaHeader } from "@/components/AreaHeader";
import { MoodPicker } from "@/components/emocional/MoodPicker";
import { JournalSection } from "@/components/emocional/JournalSection";
import { TriggersSection } from "@/components/emocional/TriggersSection";
import { CravingNowButton } from "@/components/emocional/CravingNowButton";
import { MoodEvolution } from "@/components/emocional/MoodEvolution";
import { LiveEventCard } from "@/components/LiveEventCard";
import { CourseShelf } from "@/components/cursos/CourseShelf";
import { ContinueWatchingShelf } from "@/components/cursos/ContinueWatchingShelf";
import { LiveClassesSection } from "@/components/cursos/LiveClassesSection";

export const metadata: Metadata = { title: "Emocional · RENACE" };

export default async function EmocionalPage() {
  const { client, userId } = await requireUser();
  const [today, journal, triggers, moods, events, courses, liveClasses, inProgress] =
    await Promise.all([
      getTodayMood(client, userId),
      listJournal(client, userId, 5),
      listTriggers(client, userId),
      listRecentMoods(client, userId, 14),
      listUpcomingEvents(client, userId, 1),
      listAreaCourses(client, userId, "emocional"),
      listUpcomingLiveClasses(client, userId, "emocional"),
      listInProgressCourses(client, userId, 8)
    ]);
  const supportEvent =
    events.find((e) => e.kind === "support_group") ?? events[0] ?? null;
  const continueEmocional = inProgress.filter((c) => c.area === "emocional");

  const recommended = courses.filter((c) => !c.enrollment).slice(0, 8);

  return (
    <div className="page-stack px-5 py-5">
      <BackLink fallbackHref="/home" />
      <AreaHeader area="emocional" />

      <MoodPicker initialScore={(today?.score as MoodScore | null) ?? null} />

      <CravingNowButton triggers={triggers} />

      {continueEmocional.length > 0 && (
        <ContinueWatchingShelf
          courses={continueEmocional}
          subtitle="Tus cursos emocionales activos"
        />
      )}

      {liveClasses.length > 0 && <LiveClassesSection classes={liveClasses} />}

      <CourseShelf
        title="Cuidarte por dentro"
        subtitle="Sesiones cortas guiadas"
        courses={recommended}
        seeAllHref="/cursos?tab=catalog"
        emptyText="Pronto nuevos cursos por aquí."
      />

      {supportEvent && <LiveEventCard event={supportEvent} accent="#B83A66" />}

      <h2 className="label-eyebrow mt-2">Tus herramientas</h2>
      <JournalSection entries={journal} />
      <TriggersSection triggers={triggers} />
      <MoodEvolution moods={moods} />
    </div>
  );
}
