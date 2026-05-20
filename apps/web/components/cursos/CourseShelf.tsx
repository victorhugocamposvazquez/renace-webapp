import Link from "next/link";
import { IconChevronRight } from "@tabler/icons-react";
import type { CourseWithEnrollment } from "@renace/supabase";
import { CourseCard } from "./CourseCard";

/**
 * Estantería horizontal con scroll-snap, tipo "Netflix".
 * Cabecera con título y CTA opcional "Ver todos".
 */
export function CourseShelf({
  title,
  subtitle,
  courses,
  seeAllHref,
  emptyText = "Sin contenido por ahora."
}: {
  title: string;
  subtitle?: string;
  courses: CourseWithEnrollment[];
  seeAllHref?: string;
  emptyText?: string;
}) {
  return (
    <section className="-mx-5">
      <header className="mb-3 flex items-end justify-between gap-3 px-5">
        <div>
          <h2 className="text-base font-bold text-ink-primary">{title}</h2>
          {subtitle && (
            <p className="text-xs text-ink-subtle">{subtitle}</p>
          )}
        </div>
        {seeAllHref && courses.length > 0 && (
          <Link
            href={seeAllHref}
            className="inline-flex items-center gap-0.5 text-xs font-bold text-brand-700 active:opacity-70"
          >
            Ver todos
            <IconChevronRight size={14} aria-hidden />
          </Link>
        )}
      </header>

      {courses.length === 0 ? (
        <p className="mx-5 rounded-2xl bg-canvas px-4 py-6 text-sm text-ink-muted">
          {emptyText}
        </p>
      ) : (
        <ul
          role="list"
          className="hide-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 scroll-pl-5 [&>li:first-child]:ml-5 [&>li:last-child]:mr-5"
        >
          {courses.map((c) => (
            <li key={c.id} className="snap-start">
              <CourseCard course={c} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
