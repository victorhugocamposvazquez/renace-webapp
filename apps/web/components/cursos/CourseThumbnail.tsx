import Image from "next/image";
import { getCourseImage } from "@/lib/courseImages";

/**
 * "Poster" del curso.
 *
 * - Si hay imagen mapeada (Unsplash) para el `slug`: la usamos como fondo,
 *   con un degradado del `accent_color` por encima para mantener la
 *   identidad cromática del curso y asegurar contraste del emoji.
 * - Si no hay imagen: fallback al gradient + halos blancos (look anterior),
 *   para que cursos sin imagen sigan teniendo un poster cuidado.
 */
export function CourseThumbnail({
  slug,
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

  const imageUrl = getCourseImage(slug);

  if (imageUrl) {
    return (
      <div
        aria-hidden
        className={`relative grid place-items-center overflow-hidden ${sizeClass} ${roundedClass}`}
      >
        <Image
          src={imageUrl}
          alt=""
          fill
          sizes="(max-width: 640px) 50vw, 240px"
          className="object-cover"
        />
        {/* Tinte del color del curso para preservar identidad y contraste */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${withAlpha(accent, 0.55)} 0%, ${withAlpha(
              darken(accent, 18),
              0.7
            )} 100%)`
          }}
        />
        {/* Sombra inferior para mejorar legibilidad de overlays externos */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/30 to-transparent" />
        <span className="relative drop-shadow-md">{emoji ?? "🎓"}</span>
      </div>
    );
  }

  return (
    <div
      aria-hidden
      className={`relative grid place-items-center overflow-hidden ${sizeClass} ${roundedClass}`}
      style={{
        background: `linear-gradient(135deg, ${accent} 0%, ${darken(accent, 25)} 100%)`
      }}
    >
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

function darken(hex: string, percent: number): string {
  const clean = hex.replace("#", "");
  const num = parseInt(clean, 16);
  const r = Math.max(0, ((num >> 16) & 0xff) - Math.round((255 * percent) / 100));
  const g = Math.max(0, ((num >> 8) & 0xff) - Math.round((255 * percent) / 100));
  const b = Math.max(0, (num & 0xff) - Math.round((255 * percent) / 100));
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

function withAlpha(hex: string, alpha: number): string {
  const clean = hex.replace("#", "");
  const num = parseInt(clean, 16);
  const r = (num >> 16) & 0xff;
  const g = (num >> 8) & 0xff;
  const b = num & 0xff;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
