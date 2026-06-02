/**
 * Las 5 áreas del modelo RENACE más Aria. Cada área tiene una paleta
 * coherente para chips, cards y header. `core` es para CTA primario,
 * `tint` para fondo suave, `border` para bordes y `text` para texto sobre fondo claro.
 */
export const AREA_IDS = [
  "emocional",
  "fisica",
  "juridica",
  "laboral",
  "comunidad"
] as const;

export type AreaId = (typeof AREA_IDS)[number];

export type AreaTheme = {
  id: AreaId;
  label: string;
  subtitle: string;
  core: string;
  tint: string;
  border: string;
  text: string;
  onCore: string;
};

export const AREA_THEMES: Record<AreaId, AreaTheme> = {
  emocional: {
    id: "emocional",
    label: "Emocional",
    subtitle: "Tu espacio interior",
    core: "#B83A66",
    tint: "#FCE4EC",
    border: "#F0CCD9",
    text: "#7A1F3D",
    onCore: "#FFFFFF"
  },
  fisica: {
    id: "fisica",
    label: "Física",
    subtitle: "Cuerpo y mente van unidos",
    core: "#0F6E56",
    tint: "#DFF1E8",
    border: "#C7E4D5",
    text: "#0B5443",
    onCore: "#FFFFFF"
  },
  juridica: {
    id: "juridica",
    label: "Jurídica",
    subtitle: "Tu caso, paso a paso",
    core: "#1B6FC2",
    tint: "#DBE9F7",
    border: "#BDD4ED",
    text: "#0E4E8E",
    onCore: "#FFFFFF"
  },
  laboral: {
    id: "laboral",
    label: "Laboral",
    subtitle: "Tu camino al empleo",
    core: "#B47119",
    tint: "#F9E8C9",
    border: "#E8C97D",
    text: "#7A4F0A",
    onCore: "#FFFFFF"
  },
  comunidad: {
    id: "comunidad",
    label: "Red",
    subtitle: "No estás solo en esto",
    core: "#5A4FB8",
    tint: "#E5E3FA",
    border: "#C9C5EE",
    text: "#39307F",
    onCore: "#FFFFFF"
  }
};

export const ARIA_THEME = {
  label: "Aria",
  subtitle: "Tu acompañante",
  core: "#0F6E56",
  tint: "#DFF1E8",
  border: "#C7E4D5",
  text: "#0B5443",
  onCore: "#FFFFFF"
} as const;
