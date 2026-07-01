import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { IconSchool, IconChevronRight } from "@tabler/icons-react";
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
  listUpcomingLiveClasses,
  listAreaCourses,
  getTodayMicroActionDone,
  listActiveDates,
  hasJournalToday,
  hasFisicaActivityToday,
  hasLiveReminderToday,
  hasCourseSeenToday,
  hasActivityKindToday
} from "@renace/supabase";
import {
  pickMicroAction,
  totalProgress,
  weekFromDay,
  programPhase,
  computePresenceStreak,
  streakLabel,
  todayDateString,
  formatShortDateTime
} from "@renace/core";
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
import { PhaseCard } from "@/components/home/PhaseCard";
import { TodayPath } from "@/components/home/TodayPath";

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
    fisicaLive,
    fisicaCourses
  ] = await Promise.all([
    getProfile(client, userId),
    listAreaProgress(client, userId),
    listTrustedContacts(client, userId),
    getTodayMood(client, userId),
    getFirstJournal(client, userId),
    listInProgressCourses(client, userId, 6),
    listMyUpcomingLiveClasses(client, userId, 3),
    listUpcomingLiveClasses(client, userId, "fisica"),
    listAreaCourses(client, userId, "fisica")
  ]);
  if (!profile) return null;

  const areas = fillAllAreas(rawAreas, userId);
  const total = totalProgress(areas);
  const week = weekFromDay(profile.day_in_program);
  const phase = programPhase(profile.day_in_program);
  const action = pickMicroAction({
    dayInProgram: profile.day_in_program,
    lastMood: todayMood?.score ?? null
  });

  const topCourse = inProgressCourses[0];

  const [microDone, activeDates, journalToday, physicalDone, liveReminder, breathingToday, courseSeenToday] =
    await Promise.all([
      getTodayMicroActionDone(client, userId, action.id),
      listActiveDates(client, userId, 60),
      hasJournalToday(client, userId),
      hasFisicaActivityToday(client, userId),
      hasLiveReminderToday(client, userId),
      hasActivityKindToday(client, userId, "breathing"),
      topCourse ? hasCourseSeenToday(client, userId, topCourse.id) : Promise.resolve(false)
    ]);

  const today = todayDateString();
  const streak = computePresenceStreak(activeDates, today);
  const reasons = profile.onboarding_reasons ?? [];
  const streakText = streakLabel(streak, reasons);

  const courseHref = topCourse
    ? `/cursos/${topCourse.slug}/leccion/${Math.max(1, (topCourse.enrollment?.current_lesson ?? 0) + 1)}`
    : null;

  const courseForPath =
    topCourse && courseHref
      ? {
          title: topCourse.title,
          meta: `Lección ${Math.max(1, (topCourse.enrollment?.current_lesson ?? 0) + 1)} de ${topCourse.lessons_count}`,
          href: courseHref
        }
      : null;

  const nextLive = myLiveClasses[0];
  const liveForPath =
    nextLive && nextLive.starts_at
      ? {
          title: nextLive.title,
          when: formatShortDateTime(new Date(nextLive.starts_at)),
          href: "/cursos?tab=live"
        }
      : null;

  // Paso "hábito físico": proponemos algo realmente físico — una clase de
  // Física en directo próxima o, si no hay, un vídeo de Física grabado.
  const fisicaLiveNext = fisicaLive.find((c) => c.starts_at);
  const fisicaVideo =
    fisicaCourses.find(
      (c) => c.kind !== "live_class" && c.enrollment && !c.enrollment.completed_at
    ) ?? fisicaCourses.find((c) => c.kind !== "live_class");

  const physicalForPath =
    fisicaLiveNext && fisicaLiveNext.starts_at
      ? {
          kind: "live" as const,
          title: fisicaLiveNext.title,
          when: formatShortDateTime(new Date(fisicaLiveNext.starts_at)),
          meta: "Clase en directo · Física",
          href: "/cursos?tab=live&area=fisica"
        }
      : fisicaVideo
        ? {
            kind: "video" as const,
            title: fisicaVideo.title,
            meta: `Vídeo de Física · ${fisicaVideo.lessons_count} ${
              fisicaVideo.lessons_count === 1 ? "lección" : "lecciones"
            }`,
            href: `/cursos/${fisicaVideo.slug}`
          }
        : null;

  const ariaIntro = buildAriaIntro({
    aliasFirst: profile.alias.split(" ")[0] ?? profile.alias,
    todayMoodScore: todayMood?.score ?? null
  });

  const showIntent =
    firstJournal !== null &&
    profile.day_in_program <= 21 &&
    /^día\s*1/i.test(firstJournal.content);

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

          <p className="label-eyebrow mt-3 text-brand-700">Tu vida, en equilibrio</p>
          <section className="mt-1">
            <Renace360
              progress={areas}
              totalPercent={total}
              dayInProgram={profile.day_in_program}
              week={week}
              alias={profile.alias}
            />
          </section>

          <section className="mt-5">
            <PhaseCard phase={phase} />
          </section>

          <p className="label-eyebrow mt-5 text-brand-700">Mi día</p>

          <div id="mi-animo" className="scroll-mt-24">
            <HomeHero
              dayInProgram={profile.day_in_program}
              week={week}
              totalPercent={total}
              todayMoodScore={todayMood?.score ?? null}
              streak={streak}
              streakText={streakText}
            />
          </div>

          <section className="page-inset -mx-5 mt-4 space-y-4 px-5">
            <TodayPath
              moodDone={todayMood !== null}
              physicalDone={physicalDone}
              physical={physicalForPath}
              liveDone={liveForPath ? liveReminder : breathingToday}
              liveClass={liveForPath}
              courseDone={courseSeenToday}
              course={courseForPath}
              diaryDone={journalToday}
            />
            <div id="accion-hoy" className="scroll-mt-24">
              <MicroActionCard action={action} doneToday={microDone} />
            </div>
          </section>

          {inProgressCourses.length > 0 ? (
            <section className="mt-4">
              <ContinueWatchingShelf
                courses={inProgressCourses}
                subtitle="Continúa donde lo dejaste"
              />
            </section>
          ) : (
            <section className="mt-4">
              <Link
                href="/cursos"
                className="flex items-center gap-3 rounded-2xl border border-dashed border-outline-medium bg-elevated/70 px-4 py-3.5 active:scale-[0.99]"
              >
                <span
                  aria-hidden
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-700"
                >
                  <IconSchool size={20} aria-hidden />
                </span>
                <span className="flex-1">
                  <span className="block text-sm font-bold text-ink-primary">
                    Empieza tu primer curso
                  </span>
                  <span className="block text-xs text-ink-subtle">
                    Lecciones cortas y guiadas. Elige una y empieza hoy.
                  </span>
                </span>
                <IconChevronRight size={18} aria-hidden className="text-brand-600" />
              </Link>
            </section>
          )}
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

      {myLiveClasses.length > 0 && (
        <section className="page-inset">
          <MyLiveClassesCard classes={myLiveClasses} />
        </section>
      )}

      <section className="page-inset">
        <p className="label-eyebrow mb-2 text-brand-700">Estamos contigo</p>
        <AriaTeaser intro={ariaIntro} />
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
    return `${aliasFirst}, ¿cómo amaneces hoy? El equipo está aquí si quieres contarlo.`;
  }
  if (todayMoodScore <= 2) {
    return `${aliasFirst}, parece un día difícil. ¿Hablamos con el equipo o probamos una respiración guiada?`;
  }
  if (todayMoodScore === 3) {
    return `Día neutro, ${aliasFirst}. ¿Repasamos juntos cómo va tu plan?`;
  }
  return `Buen ánimo hoy, ${aliasFirst}. ¿Avanzamos en algo del plan cuando te venga bien?`;
}
