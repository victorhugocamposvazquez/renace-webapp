import Link from "next/link";
import {
  IconPlayerPlayFilled,
  IconClockHour3,
  IconSparkles
} from "@tabler/icons-react";
import type { CourseWithEnrollment } from "@renace/supabase";
import { formatDuration } from "@renace/core";
import { CourseThumbnail } from "./CourseThumbnail";
import { SectionHeader } from "@/components/SectionHeader";

/**
 * Estantería "Tu plan en marcha": cards horizontales grandes para retomar
 * cursos en progreso o recién empezados. Foco en CTA de continuar y en el
 * estado actual (badge + lección + tiempo restante + barra de progreso).
 */
export function ContinueWatchingShelf({
  courses,
  title = "Tu plan en marcha",
  subtitle = "Continúa donde lo dejaste"
}: {
  courses: CourseWithEnrollment[];
  title?: string;
  subtitle?: string;
}) {
  if (courses.length === 0) return null;
  return (
    <section className="-mx-5">
      <div className="page-inset mb-3">
        <SectionHeader
          title={title}
          subtitle={subtitle}
          href={courses.length > 2 ? "/cursos" : undefined}
        />
      </div>
      <ul
        role="list"
        className="hide-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 scroll-pl-5 [&>li:first-child]:ml-5 [&>li:last-child]:mr-5"
      >
        {courses.map((c) => {
          const progress = c.enrollment?.progress_percent ?? 0;
          const fresh = progress === 0;
          const remaining = Math.max(
            5,
            Math.round((c.total_minutes * (100 - progress)) / 100)
          );
          const currentLesson = (c.enrollment?.current_lesson ?? 0) + 1;
          return (
            <li key={c.id} className="snap-start" style={{ width: 272 }}>
              <Link
                href={`/cursos/${c.slug}`}
                className="card-interactive flex flex-col gap-3 p-3 outline-none focus-visible:ring-2 focus-visible:ring-brand-600"
              >
                <div className="flex gap-3">
                  <CourseThumbnail
                    slug={c.slug}
                    accent={c.accent_color}
                    emoji={c.emoji}
                    size="sm"
                    rounded="xl"
                  />
                  <div className="flex flex-1 flex-col">
                    <span
                      className="inline-flex w-fit items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide"
                      style={{
                        background: fresh
                          ? `${c.accent_color}1f`
                          : `${c.accent_color}29`,
                        color: c.accent_color
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
                    <h3 className="mt-1.5 line-clamp-2 text-sm font-bold text-ink-primary">
                      {c.title}
                    </h3>
                    <p className="line-clamp-1 mt-0.5 text-[11px] text-ink-subtle">
                      Lección {currentLesson} de {c.lessons_count}
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
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.max(fresh ? 4 : progress, 4)}%`,
                        background: fresh
                          ? `${c.accent_color}66`
                          : `linear-gradient(90deg, ${c.accent_color}, ${c.accent_color}dd)`
                      }}
                      aria-hidden
                    />
                  </div>
                  <span
                    className="grid h-8 shrink-0 items-center gap-1 rounded-full px-3 text-[11px] font-bold text-ink-inverse"
                    style={{
                      gridAutoFlow: "column",
                      background: c.accent_color
                    }}
                  >
                    <IconPlayerPlayFilled size={11} aria-hidden />
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
