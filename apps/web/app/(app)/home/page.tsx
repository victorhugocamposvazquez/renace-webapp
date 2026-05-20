import type { Metadata } from "next";
import { requireUser } from "@/lib/auth";
import {
  getProfile,
  listAreaProgress,
  listTrustedContacts,
  getTodayMood,
  fillAllAreas,
  getFirstJournal,
  listInProgressCourses,
  listMyUpcomingLiveClasses
} from "@renace/supabase";
import { pickMicroAction, totalProgress, weekFromDay } from "@renace/core";
import { AppHeader } from "@/components/AppHeader";
import { Renace360 } from "@/components/Renace360";
import { AriaTeaser } from "@/components/AriaTeaser";
import { MicroActionCard } from "@/components/MicroActionCard";
import { RecoveryProgress } from "@/components/RecoveryProgress";
import { IntentCard } from "@/components/IntentCard";
import { ContinueWatchingShelf } from "@/components/cursos/ContinueWatchingShelf";
import { MyLiveClassesCard } from "@/components/cursos/MyLiveClassesCard";

export const metadata: Metadata = { title: "Inicio · RENACE" };

export default async function HomePage() {
  const { client, userId } = await requireUser();
  const [
    profile,
    rawAreas,
    contacts,
    todayMood,
    firstJournal,
    inProgressCourses,
    myLiveClasses
  ] = await Promise.all([
    getProfile(client, userId),
    listAreaProgress(client, userId),
    listTrustedContacts(client, userId),
    getTodayMood(client, userId),
    getFirstJournal(client, userId),
    listInProgressCourses(client, userId, 6),
    listMyUpcomingLiveClasses(client, userId, 3)
  ]);
  if (!profile) {
    // El middleware ya debería habernos llevado a /onboarding, pero por si acaso:
    return null;
  }
  // La intención se destaca solo las primeras 3 semanas y siempre que la
  // primera entrada tenga el prefijo del onboarding ("Día 1.").
  const showIntent =
    firstJournal !== null &&
    profile.day_in_program <= 21 &&
    /^día\s*1/i.test(firstJournal.content);

  const areas = fillAllAreas(rawAreas, userId);
  const total = totalProgress(areas);
  const week = weekFromDay(profile.day_in_program);
  const action = pickMicroAction({
    dayInProgram: profile.day_in_program,
    lastMood: todayMood?.score ?? null
  });

  const ariaIntro = buildAriaIntro({
    aliasFirst: profile.alias.split(" ")[0] ?? profile.alias,
    todayMoodScore: todayMood?.score ?? null
  });

  return (
    <div className="flex flex-1 flex-col gap-4 pb-4">
      <AppHeader
        alias={profile.alias.split(" ")[0] ?? profile.alias}
        trustedContacts={contacts}
        notifications={todayMood ? 0 : 1}
      />

      <section className="px-5">
        <Renace360
          progress={areas}
          totalPercent={total}
          dayInProgram={profile.day_in_program}
          week={week}
          alias={profile.alias}
        />
      </section>

      <section className="px-5">
        <RecoveryProgress
          progress={areas}
          totalPercent={total}
          dayInProgram={profile.day_in_program}
          week={week}
        />
      </section>

      {showIntent && firstJournal && (
        <section className="px-5">
          <IntentCard entry={firstJournal} dayInProgram={profile.day_in_program} />
        </section>
      )}

      {inProgressCourses.length > 0 && (
        <section className="px-5">
          <ContinueWatchingShelf
            courses={inProgressCourses}
            subtitle={
              inProgressCourses.every(
                (c) => (c.enrollment?.progress_percent ?? 0) === 0
              )
                ? "Acabas de empezar. Da el primer paso cuando quieras."
                : "Continúa donde lo dejaste"
            }
          />
        </section>
      )}

      {myLiveClasses.length > 0 && (
        <section className="px-5">
          <MyLiveClassesCard classes={myLiveClasses} />
        </section>
      )}

      <section className="px-5">
        <MicroActionCard action={action} />
      </section>

      <section className="px-5">
        <AriaTeaser ariaName={profile.aria_name} intro={ariaIntro} />
      </section>
    </div>
  );
}

function buildAriaIntro({
  aliasFirst,
  todayMoodScore
}: {
  aliasFirst: string;
  todayMoodScore: number | null;
}): string {
  if (todayMoodScore === null) {
    return `Hola ${aliasFirst}. ¿Cómo te encuentras hoy? Cuéntame en una palabra.`;
  }
  if (todayMoodScore <= 2) {
    return `He visto que hoy te estás sintiendo bajo. ¿Probamos un ejercicio de respiración 4-7-8?`;
  }
  if (todayMoodScore === 3) {
    return `Día neutro. ¿Hacemos un repaso de cómo va tu plan?`;
  }
  return `Buen ánimo hoy. ¿Aprovechamos para avanzar en algo del plan?`;
}
