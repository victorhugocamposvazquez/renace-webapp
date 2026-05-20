import Link from "next/link";
import { IconPlayerPlayFilled, IconClockHour3 } from "@tabler/icons-react";
import type { CourseWithEnrollment } from "@renace/supabase";
import { formatDuration } from "@renace/core";
import { CourseThumbnail } from "./CourseThumbnail";

/**
 * Estantería "Continuar viendo" en formato horizontal grande, con cards
 * más anchas que un CourseCard estándar y un foco fuerte en el progreso.
 */
export function ContinueWatchingShelf({
  courses
}: {
  courses: CourseWithEnrollment[];
}) {
  if (courses.length === 0) return null;
  return (
    <section className="-mx-5">
      <header className="mb-3 flex items-end justify-between gap-3 px-5">
        <div>
          <h2 className="text-base font-bold text-ink-primary">Continuar viendo</h2>
          <p className="text-xs text-ink-subtle">Donde lo dejaste</p>
        </div>
      </header>
      <ul
        role="list"
        className="hide-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2"
      >
        {courses.map((c) => {
          const progress = c.enrollment?.progress_percent ?? 0;
          const remaining = Math.max(
            5,
            Math.round((c.total_minutes * (100 - progress)) / 100)
          );
          return (
            <li key={c.id} className="snap-start" style={{ width: 260 }}>
              <Link
                href={`/cursos/${c.slug}`}
                className="card-lift flex flex-col gap-3 p-3 outline-none focus-visible:ring-2 focus-visible:ring-brand-600"
              >
                <div className="flex gap-3">
                  <CourseThumbnail
                    accent={c.accent_color}
                    emoji={c.emoji}
                    size="sm"
                    rounded="xl"
                  />
                  <div className="flex flex-1 flex-col">
                    <h3 className="line-clamp-2 text-sm font-bold text-ink-primary">
                      {c.title}
                    </h3>
                    <p className="line-clamp-1 mt-0.5 text-[11px] text-ink-subtle">
                      Lección {(c.enrollment?.current_lesson ?? 0) + 1} de{" "}
                      {c.lessons_count}
                    </p>
                    <div className="mt-auto flex items-center gap-1 text-[11px] font-medium text-ink-muted">
                      <IconClockHour3 size={11} aria-hidden />
                      <span>{formatDuration(remaining)} restantes</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-outline-soft">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${progress}%`,
                        background: `linear-gradient(90deg, ${c.accent_color}, ${c.accent_color}dd)`
                      }}
                      aria-hidden
                    />
                  </div>
                  <span className="text-[11px] font-bold text-ink-secondary">
                    {progress}%
                  </span>
                  <span
                    aria-hidden
                    className="ml-1 grid h-7 w-7 place-items-center rounded-full text-ink-inverse"
                    style={{ background: c.accent_color }}
                  >
                    <IconPlayerPlayFilled size={12} aria-hidden />
                  </span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
