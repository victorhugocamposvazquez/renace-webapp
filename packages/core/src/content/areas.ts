import type { AreaId } from "../schemas/profile";

export const AREA_META: Record<
  AreaId,
  { label: string; subtitle: string; eyebrow: string }
> = {
  emocional: {
    label: "Emocional",
    subtitle: "Tu espacio interior",
    eyebrow: "Tu bienestar"
  },
  fisica: {
    label: "Física",
    subtitle: "Cuerpo y mente van unidos",
    eyebrow: "Tu cuerpo"
  },
  juridica: {
    label: "Jurídica",
    subtitle: "Tu caso, paso a paso",
    eyebrow: "Tu situación legal"
  },
  laboral: {
    label: "Laboral",
    subtitle: "Tu camino al empleo",
    eyebrow: "Tu empleo"
  },
  comunidad: {
    label: "Red",
    subtitle: "No estás solo en esto",
    eyebrow: "Tu red de apoyo"
  }
};
