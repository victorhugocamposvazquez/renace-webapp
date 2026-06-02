import type { AreaId } from "../schemas/profile";

export const AREA_LABEL: Record<AreaId, string> = {
  laboral: "Laboral",
  emocional: "Emocional",
  fisica: "Física",
  juridica: "Jurídica",
  comunidad: "Red"
};

export const AREA_HREF: Record<AreaId, string> = {
  laboral: "/laboral",
  emocional: "/emocional",
  fisica: "/fisica",
  juridica: "/juridica",
  comunidad: "/comunidad"
};

export const AREA_ORDER: AreaId[] = [
  "laboral",
  "emocional",
  "fisica",
  "juridica",
  "comunidad"
];
