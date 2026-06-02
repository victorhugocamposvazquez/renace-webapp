import Link from "next/link";
import { IconClockHour3, IconPlayerPlayFilled, IconBookmark } from "@tabler/icons-react";
import type { CourseWithEnrollment } from "@renace/supabase";
import { formatDuration } from "@renace/core";
import { CourseThumbnail } from "./CourseThumbnail";
import { AreaBadge } from "./AreaBadge";

const DEMAND_LABEL = {
  alta: "Alta demanda",
  muy_alta: "Muy demandado",
  transversal: "Transversal"
} as const;

/**
 * Card en formato "poster horizontal" pensado para carruseles.
 * - Thumbnail con gradient propio del curso.
 * - Título + instructor.
 * - Pie con duración / progreso si hay enrollment.
 */
export function CourseCard({
  course,
  width = 200
}: {
  course: CourseWithEnrollment;
  width?: number;
}) {
  const enrolled = course.enrollment;
  const progress = enrolled?.progress_percent ?? 0;
  const inProgress = enrolled && progress > 0 && !enrolled.completed_at;
  const done = enrolled?.completed_at;

  return (
    <Link
      href={`/cursos/${course.slug}`}
      className="group flex flex-col gap-2 outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2 rounded-2xl"
      style={{ width: `${width}px` }}
    >
      <div className="relative">
        <CourseThumbnail
          slug={course.slug}
          accent={course.accent_color}
          emoji={course.emoji}
          size="md"
        />
        {/* Play overlay */}
        <span
          aria-hidden
          className="absolute right-2 bottom-2 grid h-9 w-9 place-items-center rounded-full bg-white/90 shadow-card text-ink-primary transition group-hover:scale-110"
        >
          <IconPlayerPlayFilled size={16} aria-hidden />
        </span>
        {done && (
          <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-brand-600 px-2 py-0.5 text-[10px] font-bold text-ink-inverse">
            Completado
          </span>
        )}
        {!done && inProgress && (
          <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-accent-500 px-2 py-0.5 text-[10px] font-bold text-ink-inverse">
            En curso
          </span>
        )}
        {!done && !inProgress && (
          <span className="absolute left-2 top-2">
            <AreaBadge area={course.area} />
          </span>
        )}
        {/* Progress bar dentro del poster */}
        {inProgress && (
          <div className="absolute inset-x-2 bottom-2 h-1.5 overflow-hidden rounded-full bg-black/30">
            <div
              className="h-full bg-white"
              style={{ width: `${progress}%` }}
              aria-hidden
            />
          </div>
        )}
      </div>
      <div className="flex flex-col gap-0.5">
        <div className="mb-0.5">
          <AreaBadge area={course.area} size="sm" />
        </div>
        <h3 className="line-clamp-2 text-sm font-bold text-ink-primary">
          {course.title}
        </h3>
        <p className="line-clamp-1 text-xs text-ink-subtle">
          {course.instructor_name ?? DEMAND_LABEL[course.demand]}
        </p>
        <div className="mt-1 flex items-center gap-1.5 text-[11px] font-medium text-ink-muted">
          <IconClockHour3 size={12} aria-hidden />
          <span>{formatDuration(course.total_minutes)}</span>
          <span aria-hidden>·</span>
          <span>{course.lessons_count} lec.</span>
          {enrolled?.reminder_set && (
            <>
              <span aria-hidden>·</span>
              <IconBookmark size={12} aria-hidden className="text-accent-500" />
            </>
          )}
        </div>
      </div>
    </Link>
  );
}
