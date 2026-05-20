/**
 * Plantilla de hitos del "Recorrido". Cuando un usuario completa onboarding,
 * insertamos estos hitos en `timeline_milestones` con su user_id.
 */
export type DefaultMilestone = {
  week: number;
  title: string;
  body: string;
  order_index: number;
  initial_status: "pending" | "in_progress" | "done";
};

export const DEFAULT_MILESTONES: DefaultMilestone[] = [
  {
    week: 1,
    title: "Registro y evaluación",
    body: "Registro · evaluación emocional · contacto con terapeuta",
    order_index: 1,
    initial_status: "done"
  },
  {
    week: 2,
    title: "Activación y red",
    body: "Rutina deportiva · grupo de apoyo · reducción de impulsos · SEPE",
    order_index: 2,
    initial_status: "done"
  },
  {
    week: 4,
    title: "Formación y rumbo",
    body: "Curso de logística · CV · mejora de hábitos · pago de deudas",
    order_index: 3,
    initial_status: "in_progress"
  },
  {
    week: 12,
    title: "Primera entrevista",
    body: "Consigue entrevista · estabilidad mayor · mentor asignado",
    order_index: 4,
    initial_status: "pending"
  },
  {
    week: 24,
    title: "Vida estable",
    body: "Trabajo estable · seguimiento preventivo · ayudar a otros",
    order_index: 5,
    initial_status: "pending"
  }
];
