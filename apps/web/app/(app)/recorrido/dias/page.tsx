import type { Metadata } from "next";
import Link from "next/link";
import { IconChevronRight } from "@tabler/icons-react";
import { requireUser } from "@/lib/auth";
import {
  getProfile,
  listRecentMoods,
  listJournal,
  listEnrollmentActivity,
  listCommunityPosts,
  listJobApplicationActivity,
  listConsultRequests,
  listActivityLogs,
  listRecentCravings,
  listTriggerActivations,
  listMilestones,
  hasWeeklyCheckinThisWeek,
  getWeekActivitySummary
} from "@renace/supabase";
import { buildRecoveryDayTimeline, weekFromDay } from "@renace/core";
import { BackLink } from "@/components/BackLink";
import { RecoveryDayCard } from "@/components/recorrido/RecoveryDayCard";
import { WeeklyCheckin } from "@/components/recorrido/WeeklyCheckin";

export const metadata: Metadata = { title: "Histórico diario · RENACE" };

export default async function RecoveryDaysPage() {
  const { client, userId } = await requireUser();
  const [
    profile,
    moods,
    journals,
    enrollments,
    posts,
    applications,
    consults,
    activities,
    cravings,
    triggerActivations,
    milestones,
    weekCheckinDone,
    weekSummary
  ] = await Promise.all([
    getProfile(client, userId),
    listRecentMoods(client, userId, 90),
    listJournal(client, userId, 50),
    listEnrollmentActivity(client, userId),
    listCommunityPosts(client, userId, 30),
    listJobApplicationActivity(client, userId),
    listConsultRequests(client, userId),
    listActivityLogs(client, userId, 200),
    listRecentCravings(client, userId, 60),
    listTriggerActivations(client, userId, 60),
    listMilestones(client, userId),
    hasWeeklyCheckinThisWeek(client, userId),
    getWeekActivitySummary(client, userId)
  ]);

  if (!profile) return null;

  const days = buildRecoveryDayTimeline({
    dayInProgram: profile.day_in_program,
    lastActiveDate: profile.last_active_date,
    moods,
    journals,
    enrollments,
    posts: posts.map((p) => ({ created_at: p.created_at, body: p.body })),
    applications,
    consults: consults.map((c) => ({
      created_at: c.created_at,
      category: c.category,
      body: c.body
    })),
    activities: activities.map((a) => ({
      created_at: a.created_at,
      kind: a.kind,
      payload: a.payload
    })),
    cravings: cravings.map((c) => ({
      created_at: c.created_at,
      intensity: c.intensity,
      note: c.note
    })),
    triggerActivations: triggerActivations.map((t) => ({
      created_at: t.created_at,
      label:
        (t.trigger as { label?: string } | null)?.label ??
        (Array.isArray(t.trigger) ? t.trigger[0]?.label : undefined) ??
        "Disparador"
    })),
    milestonesDone: milestones
      .filter((m) => m.status === "done")
      .map((m) => ({ created_at: m.created_at, title: m.title }))
  });

  const activeDays = days.filter((d) => d.hadActivity).length;
  const week = weekFromDay(profile.day_in_program);
  const isSunday = new Date().getDay() === 0;

  return (
    <div className="page-stack px-5 py-5">
      <BackLink fallbackHref="/home" />

      <header className="relative overflow-hidden rounded-[24px] border border-outline-soft/70 bg-elevated p-5 shadow-soft">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-brand-100/60 blur-2xl"
        />
        <p className="label-eyebrow text-brand-700">Tu recuperación</p>
        <h1 className="display-title">Histórico día a día</h1>
        <p className="mt-1 display-subtitle">
          Cada día del programa con lo que registraste: ánimo, diario, cursos, Red, laboral,
          jurídica, acciones y prevención.
        </p>
        <dl className="mt-4 flex flex-wrap gap-2">
          <StatChip label={`Día ${profile.day_in_program}`} sub="En el programa" />
          <StatChip label={`Semana ${week}`} sub="Actual" />
          <StatChip label={`${activeDays} días`} sub="Con actividad" />
        </dl>
      </header>

      {(isSunday || !weekCheckinDone) && (
        <WeeklyCheckin doneThisWeek={weekCheckinDone} summary={weekSummary} />
      )}

      <div className="flex flex-col gap-4">
        {days.map((day) => (
          <RecoveryDayCard key={day.day} day={day} />
        ))}
      </div>

      <Link
        href="/recorrido"
        className="btn-secondary flex items-center justify-center gap-1 text-sm"
      >
        Ver hitos del recorrido
        <IconChevronRight size={16} aria-hidden />
      </Link>
    </div>
  );
}

function StatChip({ label, sub }: { label: string; sub: string }) {
  return (
    <div className="rounded-2xl border border-outline-soft/80 bg-canvas px-3 py-2">
      <dt className="text-sm font-bold text-ink-primary">{label}</dt>
      <dd className="text-[11px] text-ink-muted">{sub}</dd>
    </div>
  );
}
