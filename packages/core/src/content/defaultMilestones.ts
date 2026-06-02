/**
 * Hitos del recorrido alineados con actividad real del piloto.
 */
export type DefaultMilestone = {
  week: number;
  title: string;
  body: string;
  order_index: number;
  initial_status: "pending" | "in_progress" | "done";
  /** Clave para auto-completado */
  auto_key?: "onboarding" | "trusted_contact" | "first_course" | "journal_habit" | "support_group";
};

export const DEFAULT_MILESTONES: DefaultMilestone[] = [
  {
    week: 1,
    title: "Primeros pasos",
    body: "Completar onboarding y registrar tu ánimo por primera vez.",
    order_index: 0,
    initial_status: "done",
    auto_key: "onboarding"
  },
  {
    week: 1,
    title: "Contacto de confianza",
    body: "Añade al menos una persona a quien llamar cuando lo necesites.",
    order_index: 1,
    initial_status: "pending",
    auto_key: "trusted_contact"
  },
  {
    week: 2,
    title: "Primer curso",
    body: "Inscríbete y avanza en al menos una lección.",
    order_index: 2,
    initial_status: "pending",
    auto_key: "first_course"
  },
  {
    week: 2,
    title: "Diario emocional",
    body: "Escribe al menos tres entradas en tu diario.",
    order_index: 3,
    initial_status: "pending",
    auto_key: "journal_habit"
  },
  {
    week: 3,
    title: "Grupo de apoyo",
    body: "Apúntate o asiste a un evento de la Red.",
    order_index: 4,
    initial_status: "pending",
    auto_key: "support_group"
  },
  {
    week: 12,
    title: "Primera entrevista",
    body: "Consigue tu primera entrevista laboral.",
    order_index: 5,
    initial_status: "pending"
  }
];
