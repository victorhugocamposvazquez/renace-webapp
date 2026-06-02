import type { AreaId } from "../schemas/profile";

export type AreaProgressStatus = "on_track" | "attention" | "blocked" | "done";

export type ProgressSnapshot = {
  enrollments: Array<{ area: AreaId; progress_percent: number; completed: boolean }>;
  moodCount: number;
  hasMoodToday: boolean;
  journalCount: number;
  triggersCount: number;
  milestonesDone: number;
  milestonesTotal: number;
  consultCount: number;
  hasLegalCase: boolean;
  postCount: number;
  eventAttendances: number;
  jobApplications: number;
};

export type AreaProgressPatch = {
  percent: number;
  status: AreaProgressStatus;
};

function clamp(n: number, max = 100): number {
  return Math.min(max, Math.max(0, Math.round(n)));
}

function avgCourseProgress(
  enrollments: ProgressSnapshot["enrollments"],
  area: AreaId
): number {
  const areaCourses = enrollments.filter((e) => e.area === area);
  if (areaCourses.length === 0) return 0;
  return areaCourses.reduce((s, e) => s + e.progress_percent, 0) / areaCourses.length;
}

function statusFromPercent(percent: number): AreaProgressStatus {
  if (percent >= 100) return "done";
  if (percent < 10) return "attention";
  return "on_track";
}

/**
 * Recalcula el % de las 5 áreas a partir de la actividad acumulada del usuario.
 * Pensado para demo: cada acción mueve el 360 de forma creíble.
 */
export function recalculateAreaProgress(
  snapshot: ProgressSnapshot
): Record<AreaId, AreaProgressPatch> {
  const milestoneBonus = Math.min(snapshot.milestonesDone * 2, 10);

  const emocional = clamp(
    avgCourseProgress(snapshot.enrollments, "emocional") * 0.45 +
      (snapshot.hasMoodToday ? 12 : 0) +
      Math.min(snapshot.journalCount * 8, 24) +
      Math.min(snapshot.moodCount * 2, 12) +
      Math.min(snapshot.triggersCount * 3, 7) +
      milestoneBonus * 0.5
  );

  const fisica = clamp(
    avgCourseProgress(snapshot.enrollments, "fisica") * 0.55 +
      (snapshot.hasMoodToday ? 6 : 0) +
      Math.min(snapshot.milestonesDone * 5, 20) +
      milestoneBonus * 0.3
  );

  const laboral = clamp(
    avgCourseProgress(snapshot.enrollments, "laboral") * 0.5 +
      snapshot.jobApplications * 12 +
      Math.min(snapshot.milestonesDone * 4, 16) +
      milestoneBonus * 0.4
  );

  const juridica = clamp(
    (snapshot.hasLegalCase ? 25 : 0) +
      snapshot.consultCount * 18 +
      avgCourseProgress(snapshot.enrollments, "juridica") * 0.3 +
      milestoneBonus * 0.2
  );

  const comunidad = clamp(
    snapshot.postCount * 15 +
      snapshot.eventAttendances * 20 +
      avgCourseProgress(snapshot.enrollments, "comunidad") * 0.3 +
      milestoneBonus * 0.3
  );

  return {
    emocional: { percent: emocional, status: statusFromPercent(emocional) },
    fisica: { percent: fisica, status: statusFromPercent(fisica) },
    juridica: { percent: juridica, status: statusFromPercent(juridica) },
    laboral: { percent: laboral, status: statusFromPercent(laboral) },
    comunidad: { percent: comunidad, status: statusFromPercent(comunidad) }
  };
}

export type LaboralPhase = {
  phase: number;
  label: string;
  subtitle: string;
};

/** Fase laboral derivada del progreso en el área (1–4). */
export function laboralPhaseFromPercent(percent: number): LaboralPhase {
  if (percent < 25) {
    return {
      phase: 1,
      label: "Exploración",
      subtitle: "Conoce opciones y define tu objetivo"
    };
  }
  if (percent < 50) {
    return {
      phase: 2,
      label: "Formación",
      subtitle: "Construyendo habilidades clave"
    };
  }
  if (percent < 75) {
    return {
      phase: 3,
      label: "Búsqueda activa",
      subtitle: "Próximo hito · primera entrevista real"
    };
  }
  return {
    phase: 4,
    label: "Entrevistas",
    subtitle: "Estás en la recta final"
  };
}

/** Fecha local YYYY-MM-DD para comparar actividad diaria. */
export function todayDateString(now = new Date()): string {
  return now.toISOString().slice(0, 10);
}
