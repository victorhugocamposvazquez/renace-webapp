import Link from "next/link";
import { IconPlayerPlayFilled, IconClockHour3, IconSparkles } from "@tabler/icons-react";
import type { CourseWithEnrollment } from "@renace/supabase";
import { formatDuration } from "@renace/core";
import { AREA_THEMES } from "@renace/tokens";
import { AreaBadge } from "./AreaBadge";

/**
 * Lista vertical "en marcha" al estilo v3: conserva progreso, lección y CTA
 * pero en layout de lista (no carrusel).
 */
export function ContinueWatchingList({
  courses,
  title = "Tu plan en marcha",
  subtitle = "Continúa donde lo dejaste",
  seeAllHref
}: {
  courses: CourseWithEnrollment[];
  title?: string;
  subtitle?: string;
  seeAllHref?: string;
}) {
  if (courses.length === 0) return null;

  return (
    <section>
      <header className="area-section-header">
        <div className="flex flex-1 items-baseline justify-between gap-2">
          <div>
            <h2 className="text-[16px] font-bold text-ink-primary">{title}</h2>
            {subtitle && <p className="text-[12px] text-ink-muted">{subtitle}</p>}
          </div>
          {seeAllHref && (
            <Link
              href={seeAllHref}
              className="shrink-0 text-[12px] font-bold text-brand-700"
            >
              Ver todos
            </Link>
          )}
        </div>
      </header>

      <ul role="list" className="flex flex-col gap-2.5">
        {courses.map((c) => {
          const theme = AREA_THEMES[c.area];
          const progress = c.enrollment?.progress_percent ?? 0;
          const fresh = progress === 0;
          const remaining = Math.max(
            5,
            Math.round((c.total_minutes * (100 - progress)) / 100)
          );
          const currentLesson = (c.enrollment?.current_lesson ?? 0) + 1;

          return (
            <li key={c.id}>
              <Link
                href={`/cursos/${c.slug}`}
                className="flex flex-col gap-3 rounded-2xl border border-outline-soft bg-elevated p-3 shadow-soft outline-none transition-transform active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-brand-600"
              >
                <div className="flex gap-3">
                  <span
                    aria-hidden
                    className="grid h-14 w-14 shrink-0 place-items-center rounded-xl text-2xl"
                    style={{ backgroundColor: theme.tint }}
                  >
                    {c.emoji ?? "🎓"}
                  </span>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <AreaBadge area={c.area} size="sm" />
                    <span
                      className="mt-1.5 inline-flex w-fit items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide"
                      style={{
                        background: fresh ? `${theme.core}1f` : `${theme.core}29`,
                        color: theme.text
                      }}
                    >
                      {fresh ? (
                        <>
                          <IconSparkles size={10} aria-hidden />
                          Recién empezado
                        </>
                      ) : (
                        <>{progress}% completado</>
                      )}
                    </span>
                    <h3 className="mt-1 line-clamp-2 text-sm font-bold text-ink-primary">
                      {c.title}
                    </h3>
                    <p className="line-clamp-1 text-[11px] text-ink-subtle">
                      Lección {currentLesson} de {c.lessons_count}
                    </p>
                    <div className="mt-auto flex items-center gap-1 text-[11px] font-medium text-ink-muted">
                      <IconClockHour3 size={11} aria-hidden />
                      <span>{formatDuration(remaining)} restantes</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className="h-1.5 flex-1 overflow-hidden rounded-full bg-outline-soft"
                    role="progressbar"
                    aria-valuenow={progress}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`Progreso: ${progress}%`}
                  >
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.max(fresh ? 4 : progress, 4)}%`,
                        backgroundColor: theme.core
                      }}
                      aria-hidden
                    />
                  </div>
                  <span
                    className="inline-flex shrink-0 items-center gap-1 rounded-xl px-3 py-2 text-[11px] font-bold text-ink-inverse"
                    style={{ backgroundColor: theme.core }}
                  >
                    <IconPlayerPlayFilled size={10} aria-hidden />
                    {fresh ? "Empezar" : "Seguir"}
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
