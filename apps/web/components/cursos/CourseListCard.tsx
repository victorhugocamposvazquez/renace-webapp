import Link from "next/link";
import { IconBroadcast, IconCheck } from "@tabler/icons-react";
import type { CourseWithEnrollment } from "@renace/supabase";
import { formatDuration } from "@renace/core";
import { AREA_THEMES } from "@renace/tokens";

/**
 * Tarjeta de curso al estilo v3: tile con emoji sobre el color del área,
 * etiqueta de área, título, metadatos y un botón de acción a la derecha.
 */
export function CourseListCard({ course }: { course: CourseWithEnrollment }) {
  const theme = AREA_THEMES[course.area];
  const enrolled = course.enrollment;
  const progress = enrolled?.progress_percent ?? 0;
  const isLive = course.kind === "live_class";
  const done = !!enrolled?.completed_at;
  const inProgress = enrolled && !done && progress > 0;

  const cta = done ? "Ver" : inProgress ? "Seguir" : "Empezar";

  const metaParts = [
    course.instructor_name ?? undefined,
    formatDuration(course.total_minutes),
    isLive ? undefined : `${course.lessons_count} lecciones`
  ].filter(Boolean);

  return (
    <Link
      href={`/cursos/${course.slug}`}
      className="flex items-center gap-3.5 rounded-2xl border border-outline-soft bg-elevated p-3 shadow-soft outline-none transition-transform active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-brand-600"
    >
      <span
        aria-hidden
        className="grid h-14 w-14 shrink-0 place-items-center rounded-xl text-2xl"
        style={{ backgroundColor: theme.tint }}
      >
        {course.emoji ?? "🎓"}
      </span>

      <div className="flex min-w-0 flex-1 flex-col">
        <span className="flex flex-wrap items-center gap-1.5">
          <span
            className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-extrabold tracking-wide"
            style={{ backgroundColor: theme.tint, color: theme.text }}
          >
            {theme.label}
            {inProgress ? ` · ${progress}%` : ""}
          </span>
          {isLive && (
            <span className="inline-flex items-center gap-0.5 rounded-full bg-state-danger/10 px-2 py-0.5 text-[10px] font-extrabold uppercase text-state-danger">
              <IconBroadcast size={10} aria-hidden /> Directo
            </span>
          )}
          {done && (
            <span className="inline-flex items-center gap-0.5 rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-extrabold text-brand-700">
              <IconCheck size={10} aria-hidden /> Completado
            </span>
          )}
        </span>

        <h3 className="mt-1 line-clamp-2 text-sm font-bold leading-snug text-ink-primary">
          {course.title}
        </h3>

        {metaParts.length > 0 && (
          <p className="mt-0.5 line-clamp-1 text-[11.5px] font-semibold text-ink-muted">
            {metaParts.join(" · ")}
          </p>
        )}
      </div>

      <span
        className="shrink-0 rounded-xl px-3.5 py-2 text-[12px] font-extrabold text-ink-inverse"
        style={{ backgroundColor: theme.core }}
      >
        {cta}
      </span>
    </Link>
  );
}
