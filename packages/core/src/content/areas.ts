import type { AreaId } from "../schemas/profile";

export const AREA_META: Record<
  AreaId,
  { label: string; subtitle: string; eyebrow: string; purpose: string }
> = {
  emocional: {
    label: "Emocional",
    subtitle: "Tu espacio interior",
    eyebrow: "Área de tu vida",
    purpose:
      "Aquí cuidas cómo te sientes: registras tu ánimo, reconoces tus detonantes y aprendes a frenar los impulsos difíciles."
  },
  fisica: {
    label: "Física",
    subtitle: "Cuerpo y mente van unidos",
    eyebrow: "Área de tu vida",
    purpose:
      "Recuperas el ritmo de tu cuerpo: descanso, movimiento y respiración para sostener los días duros."
  },
  juridica: {
    label: "Jurídica",
    subtitle: "Tu caso, paso a paso",
    eyebrow: "Área de tu vida",
    purpose:
      "Ordenas tu situación legal sin agobios: resuelves dudas y das un paso cada vez con apoyo cercano."
  },
  laboral: {
    label: "Laboral",
    subtitle: "Tu camino al empleo",
    eyebrow: "Área de tu vida",
    purpose:
      "Avanzas hacia el empleo a tu ritmo: preparas tu perfil, exploras ofertas y vuelves a la vida laboral."
  },
  comunidad: {
    label: "Red",
    subtitle: "No estás solo en esto",
    eyebrow: "Área de tu vida",
    purpose:
      "Te apoyas en tu red: grupos, encuentros y personas que entienden por dónde pasas y caminan contigo."
  }
};
