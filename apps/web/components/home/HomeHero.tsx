import { IconMoodSmile, IconTrendingUp } from "@tabler/icons-react";
import type { MoodLog } from "@renace/supabase";
import type { ProgramDayEntry } from "@renace/core";
import { MOOD_LABELS, type MoodScore } from "@renace/core";
import { ProgramDayStrip } from "./ProgramDayStrip";

export function HomeHero({
  programDays,
  totalPercent,
  todayMood
}: {
  programDays: ProgramDayEntry[];
  totalPercent: number;
  todayMood: MoodLog | null;
}) {
  const moodLabel =
    todayMood !== null
      ? MOOD_LABELS[todayMood.score as MoodScore]?.label ?? "Registrado"
      : null;

  return (
    <div className="relative mb-2 mt-3 flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
      <ProgramDayStrip days={programDays} />
      <StatPill
        icon={IconTrendingUp}
        label={`${totalPercent}%`}
        sub="Recuperación"
        accent="brand"
      />
      <StatPill
        icon={IconMoodSmile}
        label={moodLabel ?? "Sin ánimo"}
        sub={moodLabel ? "Hoy" : "Regístralo"}
        accent={moodLabel ? "emocional" : "muted"}
        highlight={!moodLabel}
      />
    </div>
  );
}

function StatPill({
  icon: Icon,
  label,
  sub,
  accent = "neutral",
  highlight = false
}: {
  icon: React.ComponentType<{ size?: number; className?: string; "aria-hidden"?: boolean }>;
  label: string;
  sub: string;
  accent?: "brand" | "emocional" | "neutral" | "muted";
  highlight?: boolean;
}) {
  const accentClass =
    accent === "brand"
      ? "border-brand-200/80 bg-brand-50/80 text-brand-800"
      : accent === "emocional"
        ? "border-area-emocional-border/80 bg-area-emocional-tint/60 text-area-emocional-text"
        : highlight
          ? "border-dashed border-outline-medium bg-elevated/70 text-ink-secondary"
          : "border-outline-soft/80 bg-elevated/80 text-ink-primary";

  return (
    <div
      className={`flex min-w-[108px] shrink-0 flex-col gap-1 rounded-2xl border px-3 py-2.5 shadow-soft backdrop-blur-sm ${accentClass}`}
    >
      <div className="flex items-center gap-1.5">
        <Icon size={14} aria-hidden className="opacity-80" />
        <span className="text-[13px] font-bold leading-none">{label}</span>
      </div>
      <span className="text-[11px] font-medium opacity-75">{sub}</span>
    </div>
  );
}
