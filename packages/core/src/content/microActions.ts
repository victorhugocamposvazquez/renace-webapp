/**
 * Micro-acciones del día propuestas en Home. Una sola visible cada vez;
 * la elegimos según el último mood, día y áreas activas.
 */
export type MicroAction = {
  id: string;
  title: string;
  body: string;
  cta: string;
  href: string;
  areaHint?: string;
};

export const DEFAULT_MICRO_ACTIONS: MicroAction[] = [
  {
    id: "respira",
    title: "Respira 2 minutos",
    body: "Bajamos el ritmo. Inhalar 4, mantener 7, exhalar 8.",
    cta: "Empezar respiración",
    href: "/respira",
    areaHint: "emocional"
  },
  {
    id: "diario",
    title: "Tres líneas en el diario",
    body: "Qué ha pasado hoy, qué he sentido, qué necesito.",
    cta: "Abrir diario",
    href: "/emocional#diario",
    areaHint: "emocional"
  },
  {
    id: "paseo",
    title: "Sal a caminar 15 minutos",
    body: "Aunque sea por la manzana. El cuerpo arrastra a la mente.",
    cta: "Ir a Física",
    href: "/fisica",
    areaHint: "fisica"
  },
  {
    id: "llama",
    title: "Llama a una persona de confianza",
    body: "Una llamada de 5 minutos cambia el día.",
    cta: "Ver contactos",
    href: "/perfil#trusted",
    areaHint: "emocional"
  },
  {
    id: "curso",
    title: "Avanza 10 minutos en tu curso",
    body: "10 minutos hoy son un capítulo esta semana.",
    cta: "Ir al curso",
    href: "/cursos?tab=catalog",
    areaHint: "laboral"
  }
];

/**
 * Selector determinista para que el usuario vea siempre la misma sugerencia
 * el mismo día, pero rotando por día y por mood.
 */
export function pickMicroAction(opts: {
  dayInProgram: number;
  lastMood?: number | null;
}): MicroAction {
  const list = DEFAULT_MICRO_ACTIONS;
  if (opts.lastMood !== undefined && opts.lastMood !== null && opts.lastMood <= 2) {
    return list[0]!; // respira
  }
  const idx = Math.abs(opts.dayInProgram) % list.length;
  return list[idx]!;
}
