"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { IconPlayerPlayFilled, IconCheck, IconChevronRight } from "@tabler/icons-react";
import { updateProgressAction } from "@/app/(app)/cursos/actions";

/**
 * Controles para avanzar lecciones de un curso ya iniciado.
 *
 * MVP: cada vez que pulsas "Marcar lección como vista" se incrementa el
 * `current_lesson` y se recalcula `progress_percent`. Cuando alcanzas 100%
 * la action persiste `completed_at` automáticamente.
 */
export function ProgressControls({
  courseId,
  totalLessons,
  progress: initialProgress,
  currentLesson: initialLesson,
  accent
}: {
  courseId: string;
  totalLessons: number;
  progress: number;
  currentLesson: number;
  accent: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [progress, setProgress] = useState(initialProgress);
  const [currentLesson, setCurrentLesson] = useState(initialLesson);

  function advance() {
    const nextLesson = Math.min(totalLessons, currentLesson + 1);
    const nextProgress = Math.round((nextLesson / totalLessons) * 100);
    setCurrentLesson(nextLesson);
    setProgress(nextProgress);
    startTransition(async () => {
      const fd = new FormData();
      fd.set("courseId", courseId);
      fd.set("progress_percent", String(nextProgress));
      fd.set("current_lesson", String(nextLesson));
      await updateProgressAction(undefined, fd);
      router.refresh();
    });
  }

  const isComplete = progress >= 100;

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
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-outline-soft">
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
        <button
          type="button"
          onClick={advance}
          disabled={pending}
          className="btn-primary"
          style={{ background: accent }}
        >
          <IconPlayerPlayFilled size={16} aria-hidden />
          <span>
            {pending ? "Guardando…" : `Seguir con la lección ${currentLesson + 1}`}
          </span>
          <IconChevronRight size={16} aria-hidden />
        </button>
      ) : (
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
              Buen trabajo. Te llevamos al siguiente paso.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
