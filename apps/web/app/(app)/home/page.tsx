import { Suspense } from "react";
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
  listMyUpcomingLiveClasses,
  listRecentMoods
} from "@renace/supabase";
import { pickMicroAction, totalProgress, weekFromDay, buildProgramDayHistory } from "@renace/core";
import { AppHeader } from "@/components/AppHeader";
import { Renace360 } from "@/components/Renace360";
import { AriaTeaser } from "@/components/AriaTeaser";
import { MicroActionCard } from "@/components/MicroActionCard";
import { RecoveryProgress } from "@/components/RecoveryProgress";
import { IntentCard } from "@/components/IntentCard";
import { ContinueWatchingShelf } from "@/components/cursos/ContinueWatchingShelf";
import { MyLiveClassesCard } from "@/components/cursos/MyLiveClassesCard";
import { WelcomeTour } from "@/components/WelcomeTour";
import { HomeHero } from "@/components/home/HomeHero";

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
    myLiveClasses,
    recentMoods
  ] = await Promise.all([
    getProfile(client, userId),
    listAreaProgress(client, userId),
    listTrustedContacts(client, userId),
    getTodayMood(client, userId),
    getFirstJournal(client, userId),
    listInProgressCourses(client, userId, 6),
    listMyUpcomingLiveClasses(client, userId, 3),
    listRecentMoods(client, userId, 30)
  ]);
  if (!profile) return null;

  const showIntent =
    firstJournal !== null &&
    profile.day_in_program <= 21 &&
    /^día\s*1/i.test(firstJournal.content);

  const areas = fillAllAreas(rawAreas, userId);
  const total = totalProgress(areas);
  const week = weekFromDay(profile.day_in_program);
  const programDays = buildProgramDayHistory({
    dayInProgram: profile.day_in_program,
    lastActiveDate: profile.last_active_date,
    moods: recentMoods
  });
  const action = pickMicroAction({
    dayInProgram: profile.day_in_program,
    lastMood: todayMood?.score ?? null
  });

  const ariaIntro = buildAriaIntro({
    aliasFirst: profile.alias.split(" ")[0] ?? profile.alias,
    todayMoodScore: todayMood?.score ?? null
  });

  return (
    <div className="page-stack">
      <Suspense fallback={null}>
        <WelcomeTour />
      </Suspense>

      <div className="home-hero relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-hero-gradient"
        />
        <div className="relative px-5 pt-[max(env(safe-area-inset-top),0px)]">
          <AppHeader
            alias={profile.alias.split(" ")[0] ?? profile.alias}
            trustedContacts={contacts}
            notifications={todayMood ? 0 : 1}
            embedded
          />
          <HomeHero
            programDays={programDays}
            totalPercent={total}
            todayMood={todayMood}
          />
          <Renace360
            progress={areas}
            totalPercent={total}
            dayInProgram={profile.day_in_program}
            week={week}
            alias={profile.alias}
          />
        </div>
      </div>

      <section className="page-inset -mt-2">
        <RecoveryProgress
          progress={areas}
          totalPercent={total}
          dayInProgram={profile.day_in_program}
          week={week}
        />
      </section>

      {showIntent && firstJournal && (
        <section className="page-inset">
          <IntentCard entry={firstJournal} dayInProgram={profile.day_in_program} />
        </section>
      )}

      {inProgressCourses.length > 0 && (
        <section>
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
        <section className="page-inset">
          <MyLiveClassesCard classes={myLiveClasses} />
        </section>
      )}

      <section className="page-inset">
        <MicroActionCard action={action} />
      </section>

      <section className="page-inset">
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
