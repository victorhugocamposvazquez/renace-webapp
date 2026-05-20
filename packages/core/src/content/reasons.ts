import type { OnboardingReason } from "../schemas/profile";

/**
 * Copy de los motivos que el usuario puede marcar en el onboarding.
 *
 * El tono se mantiene neutro, sin morbo: la propuesta del proyecto es no
 * etiquetar a la persona como "adicto" sino acompañar el proceso. Las
 * etiquetas que se muestran al usuario hablan en primera persona.
 */
export const REASON_META: Record<
  OnboardingReason,
  { label: string; emoji: string; short: string }
> = {
  trabajo: {
    label: "Volver a trabajar",
    emoji: "💼",
    short: "Recuperar mi vida laboral"
  },
  familia: {
    label: "Recuperar mi familia",
    emoji: "🫂",
    short: "Reconstruir mis vínculos cercanos"
  },
  adiccion: {
    label: "Salir de una adicción",
    emoji: "🌱",
    short: "Dejar atrás lo que me ata"
  },
  salud: {
    label: "Cuidar mi salud",
    emoji: "🫀",
    short: "Recuperar cuerpo y descanso"
  },
  legal: {
    label: "Ordenar mi situación legal",
    emoji: "⚖️",
    short: "Resolver lo que tengo pendiente"
  },
  estabilidad: {
    label: "Tener estabilidad",
    emoji: "🪴",
    short: "Una vida con menos sobresaltos"
  },
  paz: {
    label: "Encontrar paz interior",
    emoji: "🧘",
    short: "Vivir con la cabeza más en calma"
  },
  "no-recaer": {
    label: "No volver a caer",
    emoji: "🛡️",
    short: "Sostener lo que ya he conseguido"
  },
  cero: {
    label: "Empezar de cero",
    emoji: "🌅",
    short: "Una vida nueva, desde hoy"
  }
};

/**
 * Construye el contenido de la primera entrada de diario del usuario a
 * partir de los motivos elegidos en el onboarding.
 */
export function buildIntentJournalEntry(reasons: OnboardingReason[]): string {
  if (reasons.length === 0) {
    return "Día 1. Empiezo este camino.";
  }
  const lines = reasons.map((r) => `· ${REASON_META[r].short}.`);
  return [
    "Día 1. Hoy empiezo este camino.",
    "",
    "Estoy aquí para:",
    ...lines,
    "",
    "Cuando dude, vuelvo a esta página."
  ].join("\n");
}
