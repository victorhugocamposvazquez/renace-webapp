/**
 * Escala de spacing 4pt-base. Garantiza touch targets ≥44pt: la unidad mínima
 * pulsable es `tap` (44px), usable para hit-areas en iconos y chips.
 */
export const spacing = {
  px: "1px",
  0: "0px",
  1: "4px",
  2: "8px",
  3: "12px",
  4: "16px",
  5: "20px",
  6: "24px",
  8: "32px",
  10: "40px",
  tap: "44px",
  12: "48px",
  14: "56px",
  16: "64px",
  20: "80px"
} as const;
