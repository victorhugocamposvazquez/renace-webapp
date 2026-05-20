export const fontFamily = {
  sans: [
    "Inter",
    "-apple-system",
    "BlinkMacSystemFont",
    "Segoe UI",
    "Roboto",
    "Helvetica",
    "Arial",
    "sans-serif"
  ]
} as const;

export const fontSize = {
  /* mobile-first scale, en px (Tailwind los traduce a rem si quieres) */
  xs: "11px",
  sm: "12px",
  base: "14px",
  md: "15px",
  lg: "16px",
  xl: "18px",
  "2xl": "22px",
  "3xl": "26px",
  "4xl": "30px"
} as const;

export const lineHeight = {
  tight: 1.15,
  snug: 1.3,
  normal: 1.5,
  relaxed: 1.6
} as const;

export const fontWeight = {
  regular: "400",
  medium: "500",
  semibold: "600",
  bold: "700"
} as const;

export const letterSpacing = {
  tight: "-0.5px",
  snug: "-0.2px",
  normal: "0",
  wide: "0.3px",
  wider: "0.8px"
} as const;
