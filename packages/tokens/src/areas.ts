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
    core: "#E14B79",
    tint: "#FCE9F0",
    border: "#F6CBDD",
    text: "#9D2C53",
    onCore: "#FFFFFF"
  },
  fisica: {
    id: "fisica",
    label: "Física",
    subtitle: "Cuerpo y mente van unidos",
    core: "#1B9E55",
    tint: "#E6F4EC",
    border: "#C6E8D2",
    text: "#0E6537",
    onCore: "#FFFFFF"
  },
  juridica: {
    id: "juridica",
    label: "Jurídica",
    subtitle: "Tu caso, paso a paso",
    core: "#3C7DC4",
    tint: "#E7F0F9",
    border: "#C8DDF1",
    text: "#234E80",
    onCore: "#FFFFFF"
  },
  laboral: {
    id: "laboral",
    label: "Laboral",
    subtitle: "Tu camino al empleo",
    core: "#D99A2B",
    tint: "#FBF1DC",
    border: "#F0DCB0",
    text: "#8A5E15",
    onCore: "#FFFFFF"
  },
  comunidad: {
    id: "comunidad",
    label: "Red",
    subtitle: "No estás solo en esto",
    core: "#8167C6",
    tint: "#EFEAFA",
    border: "#DCD2F2",
    text: "#50399B",
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
