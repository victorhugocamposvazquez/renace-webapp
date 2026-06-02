import type { AreaId } from "../schemas/profile";

export const AREA_META: Record<
  AreaId,
  { label: string; subtitle: string; eyebrow: string }
> = {
  emocional: {
    label: "Emocional",
    subtitle: "Tu espacio interior",
    eyebrow: "Área 1 · Núcleo"
  },
  fisica: {
    label: "Física",
    subtitle: "Cuerpo y mente van unidos",
    eyebrow: "Área 2 · Cuerpo y mente"
  },
  juridica: {
    label: "Jurídica",
    subtitle: "Tu caso, paso a paso",
    eyebrow: "Área 3 · Asesoramiento"
  },
  laboral: {
    label: "Laboral",
    subtitle: "Tu camino al empleo",
    eyebrow: "Área 4 · Reinserción"
  },
  comunidad: {
    label: "Red",
    subtitle: "No estás solo en esto",
    eyebrow: "Apoyo entre iguales"
  }
};
