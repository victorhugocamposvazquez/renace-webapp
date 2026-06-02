import { MOOD_LABELS, type MoodScore } from "../schemas/mood";
import { weekFromDay } from "./progress";

export type ProgramDayEntry = {
  day: number;
  date: string;
  week: number;
  moodScore: number | null;
  moodEmoji: string | null;
  moodLabel: string | null;
  isCurrent: boolean;
};

function addDays(isoDate: string, delta: number): string {
  const d = new Date(`${isoDate}T12:00:00`);
  d.setDate(d.getDate() + delta);
  return d.toISOString().slice(0, 10);
}

function formatProgramDate(isoDate: string): string {
  const d = new Date(`${isoDate}T12:00:00`);
  return d.toLocaleDateString("es-ES", {
    weekday: "short",
    day: "numeric",
    month: "short"
  });
}

export function formatProgramDayDate(isoDate: string): string {
  return formatProgramDate(isoDate);
}

/**
 * Construye el histórico de días del programa (1…dayInProgram).
 * Usa last_active_date como ancla del día actual y cruza con mood_logs reales.
 */
export function buildProgramDayHistory(input: {
  dayInProgram: number;
  lastActiveDate: string | null;
  moods: { created_at: string; score: number }[];
}): ProgramDayEntry[] {
  const { dayInProgram, lastActiveDate, moods } = input;
  const moodByDate = new Map<string, number>();
  for (const m of moods) {
    moodByDate.set(m.created_at.slice(0, 10), m.score);
  }

  const anchor = lastActiveDate ?? new Date().toISOString().slice(0, 10);
  const entries: ProgramDayEntry[] = [];

  for (let day = 1; day <= dayInProgram; day++) {
    const daysBack = dayInProgram - day;
    const date = addDays(anchor, -daysBack);
    const score = moodByDate.get(date) ?? null;
    entries.push({
      day,
      date,
      week: weekFromDay(day),
      moodScore: score,
      moodEmoji: score ? (MOOD_LABELS[score as MoodScore]?.emoji ?? null) : null,
      moodLabel: score ? (MOOD_LABELS[score as MoodScore]?.label ?? null) : null,
      isCurrent: day === dayInProgram
    });
  }

  return entries;
}
