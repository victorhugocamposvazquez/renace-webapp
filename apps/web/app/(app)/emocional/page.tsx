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
  listInProgressCourses,
  listAreaProgress
} from "@renace/supabase";
import { type MoodScore } from "@renace/core";
import { AREA_THEMES } from "@renace/tokens";
import { BackLink } from "@/components/BackLink";
import { AreaHeader } from "@/components/AreaHeader";
import { MoodPicker } from "@/components/emocional/MoodPicker";
import { JournalSection } from "@/components/emocional/JournalSection";
import { TriggersSection } from "@/components/emocional/TriggersSection";
import { CravingNowButton } from "@/components/emocional/CravingNowButton";
import { MoodEvolution } from "@/components/emocional/MoodEvolution";
import { LiveEventCard } from "@/components/LiveEventCard";
import { CourseListSection } from "@/components/cursos/CourseListSection";
import { ContinueWatchingList } from "@/components/cursos/ContinueWatchingList";
import { LiveClassesSection } from "@/components/cursos/LiveClassesSection";

export const metadata: Metadata = { title: "Emocional · RENACE" };

export default async function EmocionalPage() {
  const { client, userId } = await requireUser();
  const [today, journal, triggers, moods, events, courses, liveClasses, inProgress, areaProgress] =
    await Promise.all([
      getTodayMood(client, userId),
      listJournal(client, userId, 5),
      listTriggers(client, userId),
      listRecentMoods(client, userId, 14),
      listUpcomingEvents(client, userId, 1),
      listAreaCourses(client, userId, "emocional"),
      listUpcomingLiveClasses(client, userId, "emocional"),
      listInProgressCourses(client, userId, 8),
      listAreaProgress(client, userId)
    ]);
  const emocionalPercent = areaProgress.find((a) => a.area === "emocional")?.percent ?? 0;
  const supportEvent =
    events.find((e) => e.kind === "support_group") ?? events[0] ?? null;
  const continueEmocional = inProgress.filter((c) => c.area === "emocional");
  const recommended = courses.filter((c) => !c.enrollment).slice(0, 8);

  return (
    <div className="page-stack px-5 py-5">
      <BackLink fallbackHref="/home" />
      <AreaHeader area="emocional" percent={emocionalPercent} />

      <MoodPicker initialScore={(today?.score as MoodScore | null) ?? null} />
      <CravingNowButton triggers={triggers} />

      {continueEmocional.length > 0 && (
        <ContinueWatchingList
          courses={continueEmocional}
          subtitle="Tus cursos emocionales activos"
          seeAllHref="/cursos?tab=catalog&area=emocional"
        />
      )}

      {liveClasses.length > 0 && <LiveClassesSection classes={liveClasses} />}

      <CourseListSection
        title="Cursos de esta área"
        subtitle="Sesiones cortas guiadas"
        courses={recommended}
        seeAllHref="/cursos?tab=catalog&area=emocional"
        limit={5}
        accentColor={AREA_THEMES.emocional.core}
        emptyText="Pronto nuevos cursos por aquí."
      />

      {supportEvent && (
        <LiveEventCard event={supportEvent} accent={AREA_THEMES.emocional.core} />
      )}

      <h2 className="label-eyebrow mt-2">Tus herramientas</h2>
      <JournalSection entries={journal} />
      <TriggersSection triggers={triggers} />
      <MoodEvolution moods={moods} />
    </div>
  );
}
