/**
 * "Poster" del curso, estilo v3: tile plano con un tinte suave del color
 * del curso y el emoji centrado. Sin fotografías ni degradados saturados,
 * para mantener la estética limpia y coherente en toda la app.
 */
export function CourseThumbnail({
  accent,
  emoji,
  size = "md",
  rounded = "2xl"
}: {
  slug?: string | null;
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
      className={`relative grid shrink-0 place-items-center overflow-hidden ${sizeClass} ${roundedClass}`}
      style={{ backgroundColor: withAlpha(accent, 0.16) }}
    >
      <span className="relative">{emoji ?? "🎓"}</span>
    </div>
  );
}

function withAlpha(hex: string, alpha: number): string {
  const clean = hex.replace("#", "");
  const num = parseInt(clean, 16);
  const r = (num >> 16) & 0xff;
  const g = (num >> 8) & 0xff;
  const b = num & 0xff;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
