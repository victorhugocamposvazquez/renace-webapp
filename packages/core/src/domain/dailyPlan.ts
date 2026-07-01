/**
 * Modelo del "día" de RENACE. Centraliza el propósito de la app y la elección
 * de la ÚNICA acción del día, para que la pantalla "Hoy" tenga un solo foco.
 */

/** Frase de propósito de la app: qué es y qué se espera del usuario cada día. */
export const DAILY_PURPOSE =
  "Cada día, un paso pequeño para sostener tu recuperación.";

export type DailyActionKind =
  | "breathing"
  | "course"
  | "physical_live"
  | "physical_video";

/** Candidatos de acción derivados de datos del servidor (curso en marcha, física). */
export type DailyActionCandidate = {
  course: { title: string; meta: string; href: string } | null;
  physical:
    | {
        kind: "live" | "video";
        title: string;
        meta: string;
        when?: string;
        href: string;
      }
    | null;
};

export type DailyAction = {
  kind: DailyActionKind;
  title: string;
  body?: string;
  meta?: string;
  when?: string;
  cta: string;
  href: string;
};

const BREATHING_ACTION: DailyAction = {
  kind: "breathing",
  title: "Respiración guiada, 2 minutos",
  body: "Baja el ritmo con la guía 4-7-8. Un momento de calma para ti.",
  cta: "Empezar respiración",
  href: "/respira"
};

/**
 * Elige la ÚNICA acción del día con foco claro:
 * 1. Ánimo bajo → calma primero (respiración).
 * 2. Si no, avanzar en el curso en marcha.
 * 3. Si no hay curso, propuesta física (clase en directo o vídeo).
 * 4. Fallback: respiración.
 */
export function pickDailyAction(opts: {
  todayMoodScore: number | null;
  candidate: DailyActionCandidate;
}): DailyAction {
  const { todayMoodScore, candidate } = opts;

  if (todayMoodScore !== null && todayMoodScore <= 2) {
    return BREATHING_ACTION;
  }
  if (candidate.course) {
    return {
      kind: "course",
      title: candidate.course.title,
      meta: candidate.course.meta,
      cta: "Continuar",
      href: candidate.course.href
    };
  }
  if (candidate.physical) {
    const isLive = candidate.physical.kind === "live";
    return {
      kind: isLive ? "physical_live" : "physical_video",
      title: candidate.physical.title,
      meta: candidate.physical.meta,
      when: candidate.physical.when,
      cta: isLive ? "Guardar mi plaza" : "Ver el vídeo",
      href: candidate.physical.href
    };
  }
  return BREATHING_ACTION;
}

/** Saludo contextual breve para la cabecera de "Hoy". */
export function dailyGreeting(opts: {
  aliasFirst: string;
  todayMoodScore: number | null;
  allDone: boolean;
}): string {
  const { aliasFirst, todayMoodScore, allDone } = opts;
  if (allDone) {
    return `Todo hecho por hoy, ${aliasFirst}. Descansa, te lo has ganado.`;
  }
  if (todayMoodScore === null) {
    return `Hola, ${aliasFirst}. Empieza por decirnos cómo estás.`;
  }
  if (todayMoodScore <= 2) {
    return `Hola, ${aliasFirst}. Vamos paso a paso, sin prisa.`;
  }
  return `Hola, ${aliasFirst}. Un paso pequeño y sigues avanzando.`;
}
