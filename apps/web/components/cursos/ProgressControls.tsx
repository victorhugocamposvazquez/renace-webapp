"use client";

import Link from "next/link";
import { IconPlayerPlayFilled, IconCheck, IconChevronRight } from "@tabler/icons-react";
import { CelebrationBurst } from "@/components/CelebrationBurst";

/**
 * Controles de progreso con enlace a la lección actual.
 */
export function ProgressControls({
  slug,
  totalLessons,
  progress,
  currentLesson,
  accent
}: {
  courseId: string;
  slug: string;
  totalLessons: number;
  progress: number;
  currentLesson: number;
  accent: string;
}) {
  const isComplete = progress >= 100;
  const nextLessonNum = Math.min(totalLessons, currentLesson + 1);

  return (
    <div className="flex flex-col gap-3">
      <div className="card flex items-center gap-3">
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-ink-subtle">
              Tu progreso
            </p>
            <p className="text-xs font-bold text-ink-secondary">
              {currentLesson} / {totalLessons} lecciones
            </p>
          </div>
          <div
            className="mt-2 h-2 overflow-hidden rounded-full bg-outline-soft"
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Progreso del curso: ${progress}%`}
          >
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${progress}%`,
                background: `linear-gradient(90deg, ${accent}, ${accent}dd)`
              }}
              aria-hidden
            />
          </div>
        </div>
        <span
          className="grid h-12 w-12 place-items-center rounded-full text-base font-bold text-ink-inverse"
          style={{ background: accent }}
        >
          {progress}%
        </span>
      </div>

      {!isComplete ? (
        <Link
          href={`/cursos/${slug}/leccion/${nextLessonNum}`}
          className="btn-primary"
          style={{ background: accent }}
        >
          <IconPlayerPlayFilled size={16} aria-hidden />
          <span>Continuar con la lección {nextLessonNum}</span>
          <IconChevronRight size={16} aria-hidden />
        </Link>
      ) : (
        <div className="flex flex-col gap-3">
          <CelebrationBurst message="¡Curso completado!" accent={accent} />
          <div className="card-lift flex items-center gap-3" style={{ background: `${accent}10` }}>
            <span
              className="grid h-10 w-10 place-items-center rounded-full text-ink-inverse"
              style={{ background: accent }}
            >
              <IconCheck size={18} aria-hidden />
            </span>
            <div>
              <div className="text-sm font-bold text-ink-primary">¡Completado!</div>
              <div className="text-xs text-ink-subtle">
                Buen trabajo. Sigue con otro curso del catálogo.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
