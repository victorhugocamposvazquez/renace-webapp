import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { IconLifebuoy, IconChevronRight, IconChartRadar } from "@tabler/icons-react";
import { requireUser } from "@/lib/auth";
import {
  getProfile,
  listTrustedContacts,
  getTodayMood,
  listInProgressCourses,
  listUpcomingLiveClasses,
  listAreaCourses,
  hasJournalToday,
  hasFisicaActivityToday,
  hasLiveReminderToday,
  hasCourseSeenToday,
  hasActivityKindToday
} from "@renace/supabase";
import {
  weekFromDay,
  formatShortDateTime,
  pickDailyAction,
  dailyGreeting,
  DAILY_PURPOSE,
  type DailyActionCandidate
} from "@renace/core";
import { AppHeader } from "@/components/AppHeader";
import { WelcomeTour } from "@/components/WelcomeTour";
import { TodayPath } from "@/components/home/TodayPath";

export const metadata: Metadata = { title: "Hoy · RENACE" };

export default async function HomePage() {
  const { client, userId } = await requireUser();
  const [profile, contacts, todayMood, inProgressCourses, fisicaLive, fisicaCourses] =
    await Promise.all([
      getProfile(client, userId),
      listTrustedContacts(client, userId),
      getTodayMood(client, userId),
      listInProgressCourses(client, userId, 6),
      listUpcomingLiveClasses(client, userId, "fisica"),
      listAreaCourses(client, userId, "fisica")
    ]);
  if (!profile) return null;

  const aliasFirst = profile.alias.split(" ")[0] ?? profile.alias;
  const week = weekFromDay(profile.day_in_program);
  const todayMoodScore = todayMood?.score ?? null;

  const topCourse = inProgressCourses[0];

  const [journalToday, physicalDone, liveReminder, breathingToday, courseSeenToday] =
    await Promise.all([
      hasJournalToday(client, userId),
      hasFisicaActivityToday(client, userId),
      hasLiveReminderToday(client, userId),
      hasActivityKindToday(client, userId, "breathing"),
      topCourse ? hasCourseSeenToday(client, userId, topCourse.id) : Promise.resolve(false)
    ]);

  // Candidato de curso en marcha para la acción del día.
  const courseCandidate =
    topCourse
      ? {
          title: topCourse.title,
          meta: `Lección ${Math.max(1, (topCourse.enrollment?.current_lesson ?? 0) + 1)} de ${topCourse.lessons_count}`,
          href: `/cursos/${topCourse.slug}/leccion/${Math.max(1, (topCourse.enrollment?.current_lesson ?? 0) + 1)}`
        }
      : null;

  // Candidato físico: clase en directo próxima o vídeo grabado de Física.
  const fisicaLiveNext = fisicaLive.find((c) => c.starts_at);
  const fisicaVideo =
    fisicaCourses.find(
      (c) => c.kind !== "live_class" && c.enrollment && !c.enrollment.completed_at
    ) ?? fisicaCourses.find((c) => c.kind !== "live_class");

  const physicalCandidate: DailyActionCandidate["physical"] =
    fisicaLiveNext && fisicaLiveNext.starts_at
      ? {
          kind: "live",
          title: fisicaLiveNext.title,
          when: formatShortDateTime(new Date(fisicaLiveNext.starts_at)),
          meta: "Clase en directo · Física",
          href: "/cursos?tab=live&area=fisica"
        }
      : fisicaVideo
        ? {
            kind: "video",
            title: fisicaVideo.title,
            meta: `Vídeo de Física · ${fisicaVideo.lessons_count} ${
              fisicaVideo.lessons_count === 1 ? "lección" : "lecciones"
            }`,
            href: `/cursos/${fisicaVideo.slug}`
          }
        : null;

  const action = pickDailyAction({
    todayMoodScore,
    candidate: { course: courseCandidate, physical: physicalCandidate }
  });

  const actionDone =
    action.kind === "breathing"
      ? breathingToday
      : action.kind === "course"
        ? courseSeenToday
        : action.kind === "physical_live"
          ? liveReminder
          : physicalDone;

  const allDone = todayMood !== null && actionDone && journalToday;
  const greeting = dailyGreeting({ aliasFirst, todayMoodScore, allDone });

  return (
    <div className="page-stack">
      <Suspense fallback={null}>
        <WelcomeTour />
      </Suspense>

      <div className="home-hero relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[320px] bg-hero-gradient"
        />
        <div className="relative px-5 pt-[max(env(safe-area-inset-top),0px)]">
          <AppHeader
            alias={aliasFirst}
            trustedContacts={contacts}
            notifications={todayMood ? 0 : 1}
            embedded
          />

          <section className="mt-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-brand-700">
              Día {profile.day_in_program} · Semana {week}
            </span>
            <h2 className="mt-3 text-[22px] font-bold leading-tight tracking-tight text-ink-primary">
              {greeting}
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-ink-muted">{DAILY_PURPOSE}</p>
          </section>

          <section className="page-inset -mx-5 mt-5 px-5">
            <div id="mi-animo" className="scroll-mt-24">
              <TodayPath
                moodDone={todayMood !== null}
                action={action}
                actionDone={actionDone}
                diaryDone={journalToday}
              />
            </div>
          </section>
        </div>
      </div>

      <section className="page-inset">
        <Link
          href="/crisis"
          className="flex items-center gap-3 rounded-2xl border border-state-danger/25 bg-state-danger/5 px-4 py-3.5 transition-transform active:scale-[0.99]"
        >
          <span
            aria-hidden
            className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-state-danger/10 text-state-danger"
          >
            <IconLifebuoy size={20} aria-hidden stroke={1.8} />
          </span>
          <span className="flex-1">
            <span className="block text-sm font-bold text-ink-primary">
              ¿Lo estás pasando mal ahora?
            </span>
            <span className="block text-xs text-ink-muted">
              Respira, llama a alguien o pide ayuda al momento.
            </span>
          </span>
          <IconChevronRight size={18} aria-hidden className="text-state-danger" />
        </Link>
      </section>

      <section className="page-inset">
        <Link
          href="/recuperacion"
          className="flex items-center gap-3 rounded-2xl border border-outline-soft bg-elevated px-4 py-3.5 shadow-soft transition-transform active:scale-[0.99]"
        >
          <span
            aria-hidden
            className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-700"
          >
            <IconChartRadar size={20} aria-hidden stroke={1.8} />
          </span>
          <span className="flex-1">
            <span className="block text-sm font-bold text-ink-primary">
              Mira cómo avanza tu recuperación
            </span>
            <span className="block text-xs text-ink-muted">
              Tu progreso, tus áreas de vida y tus hitos.
            </span>
          </span>
          <IconChevronRight size={18} aria-hidden className="text-brand-600" />
        </Link>
      </section>
    </div>
  );
}
