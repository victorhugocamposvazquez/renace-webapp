"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { IconCheck, IconChevronRight } from "@tabler/icons-react";
import { updateProgressAction } from "@/app/(app)/cursos/actions";
import { CelebrationBurst } from "@/components/CelebrationBurst";

export function LessonCompleteButton({
  courseId,
  slug,
  lessonIndex,
  totalLessons,
  accent,
  alreadyDone
}: {
  courseId: string;
  slug: string;
  lessonIndex: number;
  totalLessons: number;
  accent: string;
  alreadyDone: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const isLast = lessonIndex >= totalLessons;
  const nextHref = isLast
    ? `/cursos/${slug}`
    : `/cursos/${slug}/leccion/${lessonIndex + 1}`;

  function complete() {
    const nextLesson = Math.min(totalLessons, lessonIndex);
    const nextProgress = Math.round((nextLesson / totalLessons) * 100);
    startTransition(async () => {
      const fd = new FormData();
      fd.set("courseId", courseId);
      fd.set("progress_percent", String(nextProgress));
      fd.set("current_lesson", String(nextLesson));
      await updateProgressAction(undefined, fd);
      router.push(nextHref);
      router.refresh();
    });
  }

  if (alreadyDone && !isLast) {
    return (
      <Link href={nextHref} className="btn-primary" style={{ background: accent }}>
        <span>Siguiente lección</span>
        <IconChevronRight size={16} aria-hidden />
      </Link>
    );
  }

  if (alreadyDone && isLast) {
    return (
      <div className="flex flex-col gap-3">
        <CelebrationBurst message="¡Curso completado!" accent={accent} />
        <Link href={`/cursos/${slug}`} className="btn-primary" style={{ background: accent }}>
          Volver al curso
        </Link>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={complete}
      disabled={pending}
      className="btn-primary"
      style={{ background: accent }}
    >
      <IconCheck size={16} aria-hidden />
      <span>
        {pending
          ? "Guardando…"
          : isLast
            ? "Completar curso"
            : "Marcar como vista y continuar"}
      </span>
      {!isLast && <IconChevronRight size={16} aria-hidden />}
    </button>
  );
}
