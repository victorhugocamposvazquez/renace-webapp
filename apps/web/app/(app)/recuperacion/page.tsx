import type { Metadata } from "next";
import Link from "next/link";
import { IconChevronRight, IconUser, IconFlame } from "@tabler/icons-react";
import { requireUser } from "@/lib/auth";
import {
  getProfile,
  listAreaProgress,
  fillAllAreas,
  listMilestones,
  seedDefaultMilestones,
  listActiveDates
} from "@renace/supabase";
import {
  totalProgress,
  weekFromDay,
  programPhase,
  computePresenceStreak,
  streakLabel,
  todayDateString,
  DEFAULT_MILESTONES,
  AREA_ORDER,
  AREA_HREF,
  AREA_LABEL
} from "@renace/core";
import { AREA_THEMES } from "@renace/tokens";
import { Renace360 } from "@/components/Renace360";
import { RecoveryProgress } from "@/components/RecoveryProgress";
import { PhaseCard } from "@/components/home/PhaseCard";
import { MilestoneItem } from "@/components/recorrido/MilestoneItem";

export const metadata: Metadata = { title: "Mi recuperación · RENACE" };

export default async function RecuperacionPage() {
  const { client, userId } = await requireUser();
  const [profile, rawAreas, activeDates] = await Promise.all([
    getProfile(client, userId),
    listAreaProgress(client, userId),
    listActiveDates(client, userId, 60)
  ]);
  if (!profile) return null;

  await seedDefaultMilestones(client, userId, DEFAULT_MILESTONES);
  const milestones = await listMilestones(client, userId);

  const areas = fillAllAreas(rawAreas, userId);
  const total = totalProgress(areas);
  const week = weekFromDay(profile.day_in_program);
  const phase = programPhase(profile.day_in_program);
  const byArea = new Map(areas.map((a) => [a.area, a]));
  const streak = computePresenceStreak(activeDates, todayDateString());
  const streakText = streakLabel(streak, profile.onboarding_reasons ?? []);

  return (
    <div className="page-stack px-5 py-5">
      <header>
        <p className="label-eyebrow text-brand-700">Tu vida, en equilibrio</p>
        <h1 className="mt-0.5 text-[28px] font-bold tracking-tight text-ink-primary">
          Mi recuperación
        </h1>
        <p className="mt-1 text-sm text-ink-muted">
          Aquí ves cómo avanzas en las cinco áreas de tu vida y tus hitos.
        </p>
        <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-[13px] font-bold text-amber-700">
          <IconFlame size={15} stroke={2.2} aria-hidden />
          {streakText}
        </span>
      </header>

      <section className="mt-2">
        <Renace360
          progress={areas}
          totalPercent={total}
          dayInProgram={profile.day_in_program}
          week={week}
          alias={profile.alias}
        />
      </section>

      <section>
        <RecoveryProgress
          progress={areas}
          totalPercent={total}
          dayInProgram={profile.day_in_program}
          week={week}
        />
      </section>

      <section>
        <PhaseCard phase={phase} />
      </section>

      <section>
        <h2 className="label-eyebrow mb-2 text-brand-700">Tus áreas de vida</h2>
        <ul role="list" className="flex flex-col gap-2">
          {AREA_ORDER.map((area) => {
            const theme = AREA_THEMES[area];
            const percent = byArea.get(area)?.percent ?? 0;
            return (
              <li key={area}>
                <Link
                  href={AREA_HREF[area]}
                  className="flex items-center gap-3 rounded-2xl border border-outline-soft bg-elevated px-4 py-3 shadow-soft transition-transform active:scale-[0.99]"
                >
                  <span
                    aria-hidden
                    className="h-9 w-1.5 shrink-0 rounded-full"
                    style={{ backgroundColor: theme.core }}
                  />
                  <span className="flex-1">
                    <span className="block text-sm font-bold text-ink-primary">
                      {AREA_LABEL[area]}
                    </span>
                    <span className="block text-xs text-ink-muted">
                      {percent > 0 ? `${percent}% de avance` : "Da tu primer paso"}
                    </span>
                  </span>
                  <IconChevronRight size={18} aria-hidden className="text-ink-subtle" />
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <section id="hitos" className="scroll-mt-20">
        <div className="mb-2 flex items-baseline justify-between gap-2">
          <h2 className="label-eyebrow text-brand-700">Tus hitos</h2>
          <Link
            href="/recorrido/dias"
            className="text-xs font-bold text-brand-700"
          >
            Ver día a día
          </Link>
        </div>
        <ol role="list">
          {milestones.map((m, i) => (
            <MilestoneItem
              key={m.id}
              milestone={m}
              isFirst={i === 0}
              isLast={i === milestones.length - 1}
            />
          ))}
        </ol>
      </section>

      <section>
        <Link
          href="/perfil"
          className="flex items-center gap-3 rounded-2xl border border-outline-soft bg-elevated px-4 py-3.5 shadow-soft transition-transform active:scale-[0.99]"
        >
          <span
            aria-hidden
            className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-700"
          >
            <IconUser size={20} aria-hidden stroke={1.8} />
          </span>
          <span className="flex-1">
            <span className="block text-sm font-bold text-ink-primary">Tu perfil y ajustes</span>
            <span className="block text-xs text-ink-muted">
              Contactos de confianza, datos y privacidad.
            </span>
          </span>
          <IconChevronRight size={18} aria-hidden className="text-brand-600" />
        </Link>
      </section>
    </div>
  );
}
