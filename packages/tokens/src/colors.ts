/**
 * Paleta RENACE. Los hex provienen del prototipo v5 con ajustes
 * para asegurar AA contra los fondos crudos (#F5F7F4 / #ECEFE9).
 * Cada `area` color contiene `core`, `tint` (fondo suave), `border` y `text`.
 */
export const palette = {
  /* Fondos y neutros */
  background: {
    canvas: "#ECEFE9",
    surface: "#F5F7F4",
    elevated: "#FFFFFF"
  },
  border: {
    soft: "#D8E0D4",
    medium: "#C5D0BF",
    strong: "#8A9388"
  },
  text: {
    primary: "#1A2E1F",
    secondary: "#2C3A2E",
    muted: "#3D4A3F",
    subtle: "#5C6759",
    disabled: "#8A9388",
    onColor: "#FFFFFF"
  },

  /* Verde RENACE — color de marca y Área Física */
  brand: {
    50: "#E7F4ED",
    100: "#DFF1E8",
    200: "#C7E4D5",
    400: "#2BB68A",
    500: "#1A8A6A",
    600: "#0F6E56",
    700: "#0B5443"
  },

  /* Estados */
  state: {
    danger: "#E24B4A",
    warning: "#B47119",
    success: "#0F6E56",
    info: "#1B6FC2"
  }
} as const;

export type Palette = typeof palette;
