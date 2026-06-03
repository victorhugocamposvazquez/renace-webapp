import type { AreaId } from "../schemas/profile";

export type ProgressLike = { area: AreaId; percent: number };

export function totalProgress(rows: ProgressLike[]): number {
  if (rows.length === 0) return 0;
  const sum = rows.reduce((acc, r) => acc + r.percent, 0);
  return Math.round(sum / rows.length);
}

export function weekFromDay(day: number): number {
  return Math.max(1, Math.ceil(day / 7));
}

export type ProgramPhase = {
  /** Número de fase (1–3). */
  phase: number;
  totalPhases: number;
  name: string;
  description: string;
  /** Semana dentro de la fase (1–4). */
  weekInPhase: number;
  weeksInPhase: number;
};

const PROGRAM_PHASES = [
  {
    name: "Estabilizar tu día",
    description:
      "Recuperar ritmos básicos: descanso, cuerpo y un ánimo más estable."
  },
  {
    name: "Reconstruir tus rutinas",
    description:
      "Asentar hábitos, retomar la formación y empezar a mirar hacia fuera."
  },
  {
    name: "Reinsertarte y sostener",
    description:
      "Dar pasos hacia el empleo y la vida social, con la red que te sostiene."
  }
] as const;

/**
 * Devuelve la fase del programa (1–3) a partir del día.
 * Cada fase dura 4 semanas; la 3ª es abierta (se mantiene a partir de la semana 9).
 */
export function programPhase(day: number): ProgramPhase {
  const week = weekFromDay(day);
  const weeksInPhase = 4;
  const totalPhases = PROGRAM_PHASES.length;
  const rawPhase = Math.ceil(week / weeksInPhase);
  const phase = Math.min(totalPhases, Math.max(1, rawPhase));
  const weekInPhase =
    phase === totalPhases
      ? Math.min(weeksInPhase, week - (totalPhases - 1) * weeksInPhase)
      : ((week - 1) % weeksInPhase) + 1;
  const meta = PROGRAM_PHASES[phase - 1]!;
  return {
    phase,
    totalPhases,
    name: meta.name,
    description: meta.description,
    weekInPhase: Math.max(1, weekInPhase),
    weeksInPhase
  };
}
