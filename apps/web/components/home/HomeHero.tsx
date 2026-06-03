import Link from "next/link";
import { IconCalendarWeek, IconTrendingUp, IconChevronRight, IconFlame } from "@tabler/icons-react";
import type { MoodScore } from "@renace/core";
import { MoodQuickSheet } from "./MoodQuickSheet";

export function HomeHero({
  dayInProgram,
  week,
  totalPercent,
  todayMoodScore,
  streak,
  streakText
}: {
  dayInProgram: number;
  week: number;
  totalPercent: number;
  todayMoodScore: number | null;
  streak: number;
  streakText: string;
}) {
  return (
    <div className="relative mb-2 mt-3 flex flex-col gap-2">
      <div className="flex items-center gap-2 rounded-2xl border border-brand-200/50 bg-brand-50/50 px-3 py-2">
        <IconFlame size={16} aria-hidden className="text-brand-700" />
        <span className="text-sm font-semibold text-brand-800">{streakText}</span>
        {streak >= 7 && (
          <span className="ml-auto rounded-full bg-brand-600 px-2 py-0.5 text-[10px] font-bold text-ink-inverse">
            Racha {streak}
          </span>
        )}
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
        <Link
          href="/recorrido/dias"
          className="flex min-w-[118px] shrink-0 flex-col gap-1 rounded-2xl border border-outline-soft/80 bg-elevated/80 px-3 py-2.5 shadow-soft backdrop-blur-sm transition-all hover:border-brand-200 hover:bg-brand-50/50 active:scale-[0.98]"
        >
          <div className="flex items-center justify-between gap-1">
            <div className="flex items-center gap-1.5">
              <IconCalendarWeek size={14} aria-hidden className="text-brand-700 opacity-80" />
              <span className="text-[13px] font-bold text-ink-primary">Día {dayInProgram}</span>
            </div>
            <IconChevronRight size={14} aria-hidden className="text-brand-600 opacity-70" />
          </div>
          <span className="text-[11px] font-medium text-ink-muted">Semana {week} · Ver histórico</span>
        </Link>
        <Link
          href="/recorrido"
          className="flex min-w-[118px] shrink-0 flex-col gap-1 rounded-2xl border border-brand-200/80 bg-brand-50/80 px-3 py-2.5 shadow-soft backdrop-blur-sm text-brand-800 transition-all hover:border-brand-300 hover:bg-brand-50 active:scale-[0.98]"
        >
          <div className="flex items-center justify-between gap-1">
            <div className="flex items-center gap-1.5">
              <IconTrendingUp size={14} aria-hidden className="opacity-80" />
              <span className="text-[13px] font-bold">{totalPercent}%</span>
            </div>
            <IconChevronRight size={14} aria-hidden className="opacity-70" />
          </div>
          <span className="text-[11px] font-medium opacity-75">Recuperación · Ver</span>
        </Link>
        <MoodQuickSheet initialScore={todayMoodScore as MoodScore | null} />
      </div>
    </div>
  );
}
