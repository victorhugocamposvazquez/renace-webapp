/**
 * "Poster" del curso. Usamos un gradient hecho con el `accent_color` de cada
 * curso como fallback visual (sin imágenes), con el emoji centrado.
 *
 * El gradient se construye en dos pasos para dar profundidad: una capa base
 * oscura del color del curso + una capa radial blanca semi-transparente.
 */
export function CourseThumbnail({
  accent,
  emoji,
  size = "md",
  rounded = "2xl"
}: {
  accent: string;
  emoji: string | null;
  size?: "sm" | "md" | "lg";
  rounded?: "xl" | "2xl" | "3xl";
}) {
  const sizeClass = {
    sm: "h-[88px] w-[88px] text-3xl",
    md: "h-[120px] w-full text-4xl",
    lg: "h-[160px] w-full text-5xl"
  }[size];
  const roundedClass = {
    xl: "rounded-xl",
    "2xl": "rounded-2xl",
    "3xl": "rounded-3xl"
  }[rounded];
  return (
    <div
      aria-hidden
      className={`relative grid place-items-center overflow-hidden ${sizeClass} ${roundedClass}`}
      style={{
        background: `linear-gradient(135deg, ${accent} 0%, ${darken(accent, 25)} 100%)`
      }}
    >
      {/* Halo decorativo */}
      <div
        className="absolute -top-12 -left-6 h-32 w-32 rounded-full opacity-20"
        style={{ background: "radial-gradient(circle, #fff 0%, transparent 70%)" }}
      />
      <div
        className="absolute -bottom-12 -right-6 h-32 w-32 rounded-full opacity-10"
        style={{ background: "radial-gradient(circle, #fff 0%, transparent 70%)" }}
      />
      <span className="relative drop-shadow-sm">{emoji ?? "🎓"}</span>
    </div>
  );
}

/**
 * Oscurece un hex en N puntos (0-100). Simple, sin librería.
 */
function darken(hex: string, percent: number): string {
  const clean = hex.replace("#", "");
  const num = parseInt(clean, 16);
  const r = Math.max(0, ((num >> 16) & 0xff) - Math.round((255 * percent) / 100));
  const g = Math.max(0, ((num >> 8) & 0xff) - Math.round((255 * percent) / 100));
  const b = Math.max(0, (num & 0xff) - Math.round((255 * percent) / 100));
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}
