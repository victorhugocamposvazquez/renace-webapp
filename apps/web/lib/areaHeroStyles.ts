/** Gradiente radial decorativo compartido en heros de área y curso. */
export const HERO_RADIAL_GLOW =
  "radial-gradient(circle, rgba(255,255,255,0.85) 0%, transparent 70%)" as const;

/** Gradiente lineal 135° entre dos tonos hex (p. ej. core → coreDark). */
export function areaHeroGradient(from: string, to: string): string {
  return `linear-gradient(135deg, ${from} 0%, ${to} 100%)`;
}

/** Oscurece un color hex (#RRGGBB) un porcentaje aproximado (0–100). */
export function darkenHex(hex: string, percent: number): string {
  const clean = hex.replace("#", "");
  const num = parseInt(clean, 16);
  const r = Math.max(0, ((num >> 16) & 0xff) - Math.round((255 * percent) / 100));
  const g = Math.max(0, ((num >> 8) & 0xff) - Math.round((255 * percent) / 100));
  const b = Math.max(0, (num & 0xff) - Math.round((255 * percent) / 100));
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

/** Tinte suave a partir de un color de área (equivalente a ~8% opacidad). */
export function areaTint(hex: string, alpha = 0.08): string {
  const clean = hex.replace("#", "");
  const num = parseInt(clean, 16);
  const r = (num >> 16) & 0xff;
  const g = (num >> 8) & 0xff;
  const b = num & 0xff;
  return `rgba(${r},${g},${b},${alpha})`;
}

/** Tinte medio para estados activos (~13% opacidad). */
export function areaTintMedium(hex: string): string {
  return areaTint(hex, 0.13);
}
