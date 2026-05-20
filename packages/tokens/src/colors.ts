/**
 * Paleta RENACE — refresh "app 2026".
 * - Neutros cálidos (zinc + sutil tinte cálido) para fondos limpios.
 * - Brand verde RENACE conservado pero recalibrado con un 600 más vibrante.
 * - Acento púrpura (`accent`) para gradients y CTAs especiales (Aria).
 * - Tonos `text` casi negros para un contraste moderno tipo iOS / 2026.
 */
export const palette = {
  /* Fondos y neutros */
  background: {
    canvas: "#F4F4F2",
    surface: "#FAFAF9",
    elevated: "#FFFFFF"
  },
  border: {
    soft: "#ECEAE6",
    medium: "#D6D3CE",
    strong: "#9CA39B"
  },
  text: {
    primary: "#0A0A0A",
    secondary: "#27272A",
    muted: "#52525B",
    subtle: "#71717A",
    disabled: "#A1A1AA",
    onColor: "#FFFFFF"
  },

  /* Verde RENACE — color de marca y Área Física */
  brand: {
    50: "#ECFBF3",
    100: "#D5F4E2",
    200: "#A6E7C2",
    300: "#5FD49C",
    400: "#26BB7C",
    500: "#0FA065",
    600: "#0A8554",
    700: "#0B6A45",
    800: "#0C5238"
  },

  /* Acento púrpura para Aria, gradients y CTAs premium */
  accent: {
    50: "#F4F1FF",
    100: "#E8E2FF",
    200: "#CFC1FF",
    300: "#AE96FF",
    400: "#8A6CFB",
    500: "#6F4FE8",
    600: "#5A3DCC",
    700: "#4530A3"
  },

  /* Estados */
  state: {
    danger: "#E11D48",
    warning: "#C2410C",
    success: "#0A8554",
    info: "#2563EB"
  }
} as const;

export type Palette = typeof palette;
