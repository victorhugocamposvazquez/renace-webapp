import Link from "next/link";
import {
  IconClockHour3,
  IconPlayerPlayFilled,
  IconCheck,
  IconBroadcast
} from "@tabler/icons-react";
import type { CourseWithEnrollment } from "@renace/supabase";
import { formatDuration } from "@renace/core";
import { CourseThumbnail } from "./CourseThumbnail";
import { AreaBadge } from "./AreaBadge";

/**
 * Tarjeta ancha para listados del hub de cursos.
 * Muestra claramente el área, progreso y metadatos.
 */
export function CourseListCard({ course }: { course: CourseWithEnrollment }) {
  const enrolled = course.enrollment;
  const progress = enrolled?.progress_percent ?? 0;
  const isLive = course.kind === "live_class";
  const done = !!enrolled?.completed_at;
  const inProgress = enrolled && !done && progress > 0;
  const fresh = enrolled && !done && progress === 0;

  return (
    <Link
      href={`/cursos/${course.slug}`}
      className="card-interactive flex gap-3 p-3 outline-none focus-visible:ring-2 focus-visible:ring-brand-600"
    >
      <CourseThumbnail
        slug={course.slug}
        accent={course.accent_color}
        emoji={course.emoji}
        size="sm"
        rounded="xl"
      />
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <div className="flex flex-wrap items-center gap-1.5">
          <AreaBadge area={course.area} />
          {isLive && (
            <span className="inline-flex items-center gap-0.5 rounded-full bg-state-danger/10 px-2 py-0.5 text-[10px] font-bold uppercase text-state-danger">
              <IconBroadcast size={10} aria-hidden />
              Directo
            </span>
          )}
          {done && (
            <span className="inline-flex items-center gap-0.5 rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-bold text-brand-700">
              <IconCheck size={10} aria-hidden />
              Completado
            </span>
          )}
          {inProgress && (
            <span className="text-[10px] font-bold text-accent-600">{progress}%</span>
          )}
          {fresh && (
            <span className="text-[10px] font-bold text-ink-subtle">Recién empezado</span>
          )}
        </div>

        <h3 className="line-clamp-2 text-[15px] font-bold leading-snug text-ink-primary">
          {course.title}
        </h3>

        <p className="line-clamp-1 text-[12px] text-ink-muted">
          {course.instructor_name ?? course.exit_market}
        </p>

        <div className="mt-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-ink-subtle">
            <IconClockHour3 size={12} aria-hidden />
            <span>{formatDuration(course.total_minutes)}</span>
            {!isLive && (
              <>
                <span aria-hidden>·</span>
                <span>{course.lessons_count} lecciones</span>
              </>
            )}
          </div>
          <span
            className="inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold text-ink-inverse"
            style={{ background: course.accent_color }}
          >
            <IconPlayerPlayFilled size={10} aria-hidden />
            {done ? "Ver" : fresh || !enrolled ? "Empezar" : "Continuar"}
          </span>
        </div>

        {(inProgress || fresh) && enrolled && (
          <div className="h-1 overflow-hidden rounded-full bg-outline-soft">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${Math.max(progress, fresh ? 4 : 0)}%`,
                background: course.accent_color
              }}
              aria-hidden
            />
          </div>
        )}
      </div>
    </Link>
  );
}
