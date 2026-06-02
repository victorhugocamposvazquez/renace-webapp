import { MOOD_LABELS, CONSULT_CATEGORY_LABEL, type MoodScore, type ConsultCategory } from "../schemas";
import { AREA_LABEL } from "../content/areaNav";
import type { AreaId } from "../schemas/profile";
import { weekFromDay } from "./progress";

export type RecoveryActivityKind =
  | "mood"
  | "journal"
  | "course"
  | "course_completed"
  | "course_enrolled"
  | "community"
  | "job"
  | "consult";

export type RecoveryDayActivity = {
  kind: RecoveryActivityKind;
  area?: AreaId;
  title: string;
  detail?: string;
  time?: string;
};

export type RecoveryDayDetail = {
  day: number;
  date: string;
  week: number;
  moodScore: number | null;
  moodEmoji: string | null;
  moodLabel: string | null;
  moodNote: string | null;
  isCurrent: boolean;
  activities: RecoveryDayActivity[];
  hadActivity: boolean;
};

function addDays(isoDate: string, delta: number): string {
  const d = new Date(`${isoDate}T12:00:00`);
  d.setDate(d.getDate() + delta);
  return d.toISOString().slice(0, 10);
}

function dateKey(iso: string): string {
  return iso.slice(0, 10);
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
}

export function formatProgramDayDate(isoDate: string): string {
  const d = new Date(`${isoDate}T12:00:00`);
  return d.toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long"
  });
}

export function formatProgramDayDateShort(isoDate: string): string {
  const d = new Date(`${isoDate}T12:00:00`);
  return d.toLocaleDateString("es-ES", {
    weekday: "short",
    day: "numeric",
    month: "short"
  });
}

type MoodInput = { created_at: string; score: number; note?: string | null };
type JournalInput = { created_at: string; content: string; sentiment?: string | null };
type EnrollmentInput = {
  enrolled_at: string;
  last_seen_at: string;
  completed_at: string | null;
  progress_percent: number;
  title: string;
  area: AreaId;
};
type PostInput = { created_at: string; body: string };
type ApplicationInput = { created_at: string; title: string; company: string };
type ConsultInput = { created_at: string; category: ConsultCategory; body: string };

/**
 * Histórico detallado día a día del programa de recuperación.
 * Cruza mood, diario, cursos, red, laboral y jurídica por fecha calendario.
 */
export function buildRecoveryDayTimeline(input: {
  dayInProgram: number;
  lastActiveDate: string | null;
  moods: MoodInput[];
  journals: JournalInput[];
  enrollments: EnrollmentInput[];
  posts: PostInput[];
  applications: ApplicationInput[];
  consults: ConsultInput[];
}): RecoveryDayDetail[] {
  const { dayInProgram, lastActiveDate, moods, journals, enrollments, posts, applications, consults } =
    input;

  const anchor = lastActiveDate ?? new Date().toISOString().slice(0, 10);
  const byDate = new Map<string, RecoveryDayActivity[]>();

  function push(date: string, activity: RecoveryDayActivity) {
    const key = dateKey(date);
    const list = byDate.get(key) ?? [];
    list.push(activity);
    byDate.set(key, list);
  }

  for (const j of journals) {
    push(j.created_at, {
      kind: "journal",
      area: "emocional",
      title: "Entrada en el diario",
      detail: j.content.length > 160 ? `${j.content.slice(0, 157)}…` : j.content,
      time: formatTime(j.created_at)
    });
  }

  for (const e of enrollments) {
    push(e.enrolled_at, {
      kind: "course_enrolled",
      area: e.area,
      title: `Inscripción · ${e.title}`,
      detail: `Área ${AREA_LABEL[e.area]}`,
      time: formatTime(e.enrolled_at)
    });

    const seenKey = dateKey(e.last_seen_at);
    const enrolledKey = dateKey(e.enrolled_at);
    if (seenKey !== enrolledKey || e.progress_percent > 0) {
      push(e.last_seen_at, {
        kind: "course",
        area: e.area,
        title: e.title,
        detail:
          e.progress_percent >= 100
            ? "Curso completado"
            : `Avance al ${e.progress_percent}% · lección ${Math.max(1, e.progress_percent > 0 ? Math.ceil((e.progress_percent / 100) * 3) : 1)}`,
        time: formatTime(e.last_seen_at)
      });
    }

    if (e.completed_at) {
      push(e.completed_at, {
        kind: "course_completed",
        area: e.area,
        title: `Completaste · ${e.title}`,
        detail: `Área ${AREA_LABEL[e.area]}`,
        time: formatTime(e.completed_at)
      });
    }
  }

  for (const p of posts) {
    push(p.created_at, {
      kind: "community",
      area: "comunidad",
      title: "Publicación en la Red",
      detail: p.body.length > 120 ? `${p.body.slice(0, 117)}…` : p.body,
      time: formatTime(p.created_at)
    });
  }

  for (const a of applications) {
    push(a.created_at, {
      kind: "job",
      area: "laboral",
      title: `Interés laboral · ${a.title}`,
      detail: a.company,
      time: formatTime(a.created_at)
    });
  }

  for (const c of consults) {
    push(c.created_at, {
      kind: "consult",
      area: "juridica",
      title: `Consulta · ${CONSULT_CATEGORY_LABEL[c.category]}`,
      detail: c.body.length > 120 ? `${c.body.slice(0, 117)}…` : c.body,
      time: formatTime(c.created_at)
    });
  }

  const moodByDate = new Map<string, MoodInput>();
  for (const m of moods) {
    const key = dateKey(m.created_at);
    if (!moodByDate.has(key)) moodByDate.set(key, m);
  }

  const days: RecoveryDayDetail[] = [];
  for (let day = 1; day <= dayInProgram; day++) {
    const daysBack = dayInProgram - day;
    const date = addDays(anchor, -daysBack);
    const mood = moodByDate.get(date) ?? null;
    const activities = (byDate.get(date) ?? []).sort((a, b) =>
      (a.time ?? "").localeCompare(b.time ?? "")
    );

    days.push({
      day,
      date,
      week: weekFromDay(day),
      moodScore: mood?.score ?? null,
      moodEmoji: mood ? (MOOD_LABELS[mood.score as MoodScore]?.emoji ?? null) : null,
      moodLabel: mood ? (MOOD_LABELS[mood.score as MoodScore]?.label ?? null) : null,
      moodNote: mood?.note?.trim() || null,
      isCurrent: day === dayInProgram,
      activities,
      hadActivity: activities.length > 0 || mood !== null
    });
  }

  return days.reverse();
}

/** @deprecated Usar buildRecoveryDayTimeline */
export type ProgramDayEntry = Pick<
  RecoveryDayDetail,
  "day" | "date" | "week" | "moodScore" | "moodEmoji" | "moodLabel" | "isCurrent"
>;

export function buildProgramDayHistory(input: {
  dayInProgram: number;
  lastActiveDate: string | null;
  moods: { created_at: string; score: number }[];
}): ProgramDayEntry[] {
  return buildRecoveryDayTimeline({ ...input, journals: [], enrollments: [], posts: [], applications: [], consults: [] })
    .reverse()
    .map(({ day, date, week, moodScore, moodEmoji, moodLabel, isCurrent }) => ({
      day,
      date,
      week,
      moodScore,
      moodEmoji,
      moodLabel,
      isCurrent
    }));
}
