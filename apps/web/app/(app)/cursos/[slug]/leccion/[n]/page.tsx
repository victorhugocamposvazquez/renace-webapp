import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  IconClockHour3,
  IconPlayerPlayFilled
} from "@tabler/icons-react";
import { requireUser } from "@/lib/auth";
import { getCourseBySlug } from "@renace/supabase";
import {
  getCourseLesson,
  getCourseLessons,
  lessonBodyToParagraphs
} from "@renace/core";
import { BackLink } from "@/components/BackLink";
import { LessonCompleteButton } from "@/components/cursos/LessonCompleteButton";

type Props = { params: Promise<{ slug: string; n: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, n } = await params;
  const lesson = getCourseLesson(slug, Number.parseInt(n, 10));
  return {
    title: lesson ? `${lesson.title} · RENACE` : `${slug} · RENACE`
  };
}

function renderParagraph(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-bold text-ink-primary">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

export default async function LessonPage({ params }: Props) {
  const { slug, n } = await params;
  const lessonNum = Number.parseInt(n, 10);
  if (Number.isNaN(lessonNum) || lessonNum < 1) notFound();

  const { client, userId } = await requireUser();
  const course = await getCourseBySlug(client, userId, slug);
  if (!course || course.kind === "live_class") notFound();

  const lessons = getCourseLessons(slug, course.lessons_count);
  const lesson = getCourseLesson(slug, lessonNum, course.lessons_count);
  if (!lesson) notFound();

  const enrolled = course.enrollment;
  const currentLesson = enrolled?.current_lesson ?? 0;
  const alreadyDone = lessonNum <= currentLesson;
  const isCurrent = lessonNum === currentLesson + 1 || (currentLesson === 0 && lessonNum === 1);

  return (
    <div className="flex flex-1 flex-col gap-5 px-5 py-5">
      <BackLink fallbackHref={`/cursos/${slug}`} label={course.title} />

      <header>
        <p className="label-eyebrow">
          Lección {lessonNum} de {lessons.length}
        </p>
        <h1 className="mt-1 text-2xl font-bold text-ink-primary">{lesson.title}</h1>
        <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-ink-subtle">
          <IconClockHour3 size={13} aria-hidden />
          {lesson.durationMin} min · {lesson.type === "video" ? "Vídeo" : lesson.type === "audio" ? "Audio guiado" : "Lectura"}
        </p>
      </header>

      <div className="h-1.5 overflow-hidden rounded-full bg-outline-soft">
        <div
          className="h-full rounded-full transition-all"
          style={{
            width: `${Math.round((lessonNum / lessons.length) * 100)}%`,
            background: course.accent_color
          }}
          aria-hidden
        />
      </div>

      <article className="card flex flex-col gap-4">
        {lessonBodyToParagraphs(lesson.body).map((para, i) => (
          <p key={i} className="text-sm leading-relaxed text-ink-secondary whitespace-pre-line">
            {renderParagraph(para)}
          </p>
        ))}

        {lesson.type !== "text" && (
          <div
            className="flex items-center gap-3 rounded-xl border border-dashed border-outline-soft bg-canvas px-4 py-6"
            style={{ borderColor: `${course.accent_color}44` }}
          >
            <span
              className="grid h-12 w-12 place-items-center rounded-full text-ink-inverse"
              style={{ background: course.accent_color }}
            >
              <IconPlayerPlayFilled size={18} aria-hidden />
            </span>
            <div>
              <p className="text-sm font-bold text-ink-primary">
                {lesson.type === "video" ? "Vídeo demostrativo" : "Audio guiado"}
              </p>
              <p className="text-xs text-ink-subtle">
                En la versión completa reproduciremos el contenido aquí. Lee la guía de arriba y marca la lección como vista.
              </p>
            </div>
          </div>
        )}
      </article>

      {enrolled ? (
        <LessonCompleteButton
          courseId={course.id}
          slug={slug}
          lessonIndex={lessonNum}
          totalLessons={lessons.length}
          accent={course.accent_color}
          alreadyDone={alreadyDone && !isCurrent}
        />
      ) : (
        <p className="text-center text-sm text-ink-muted">
          Inscríbete en el curso para guardar tu progreso.
        </p>
      )}
    </div>
  );
}
