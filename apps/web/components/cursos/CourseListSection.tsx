import Link from "next/link";
import { IconChevronRight } from "@tabler/icons-react";
import type { CourseWithEnrollment } from "@renace/supabase";
import type { AreaId } from "@renace/supabase";
import { AREA_LABEL } from "@renace/core";
import { AREA_THEMES } from "@renace/tokens";
import { CourseListCard } from "./CourseListCard";

/**
 * Sección vertical de cursos al estilo v3 (lista de CourseListCard).
 */
export function CourseListSection({
  title,
  subtitle,
  courses,
  seeAllHref,
  limit,
  emptyText = "Sin contenido por ahora.",
  accentColor
}: {
  title: string;
  subtitle?: string;
  courses: CourseWithEnrollment[];
  seeAllHref?: string;
  limit?: number;
  emptyText?: string;
  /** Color de la barra lateral del encabezado (opcional). */
  accentColor?: string;
}) {
  const visible = limit ? courses.slice(0, limit) : courses;

  return (
    <section>
      <header className="area-section-header">
        {accentColor && (
          <span
            aria-hidden
            className="h-[18px] w-1 rounded-full"
            style={{ backgroundColor: accentColor }}
          />
        )}
        <div className="flex flex-1 items-baseline justify-between gap-2">
          <div>
            <h2 className="text-[16px] font-bold text-ink-primary">{title}</h2>
            {subtitle && <p className="text-[12px] text-ink-muted">{subtitle}</p>}
          </div>
          {seeAllHref && courses.length > (limit ?? courses.length) && (
            <Link
              href={seeAllHref}
              className="inline-flex shrink-0 items-center gap-0.5 text-[12px] font-bold text-brand-700"
            >
              Ver todos ({courses.length})
              <IconChevronRight size={14} aria-hidden />
            </Link>
          )}
        </div>
      </header>

      {visible.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-outline-soft bg-canvas px-4 py-6 text-sm text-ink-muted">
          {emptyText}
        </p>
      ) : (
        <ul role="list" className="flex flex-col gap-2.5">
          {visible.map((c) => (
            <li key={c.id}>
              <CourseListCard course={c} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

/** Agrupación por área con barra de color (usado en hub /cursos). */
export function AreaCourseGroup({
  area,
  courses,
  seeAllHref,
  limit = 3
}: {
  area: AreaId;
  courses: CourseWithEnrollment[];
  seeAllHref?: string;
  limit?: number;
}) {
  const theme = AREA_THEMES[area];
  return (
    <section>
      <div className="area-section-header">
        <span
          aria-hidden
          className="h-[18px] w-1 rounded-full"
          style={{ backgroundColor: theme.core }}
        />
        <h2 className="flex-1 text-[16px] font-bold text-ink-primary">
          {AREA_LABEL[area]}
        </h2>
        {seeAllHref && courses.length > limit && (
          <Link
            href={seeAllHref}
            className="shrink-0 text-[12px] font-bold"
            style={{ color: theme.text }}
          >
            Ver todos ({courses.length})
          </Link>
        )}
      </div>
      <ul role="list" className="flex flex-col gap-2.5">
        {(seeAllHref ? courses.slice(0, limit) : courses).map((c) => (
          <li key={c.id}>
            <CourseListCard course={c} />
          </li>
        ))}
      </ul>
    </section>
  );
}
