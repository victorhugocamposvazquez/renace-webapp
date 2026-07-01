import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { IconClockHour3 } from "@tabler/icons-react";
import { requireUser } from "@/lib/auth";
import { getCourseBySlug } from "@renace/supabase";
import {
  getCourseLesson,
  getCourseLessons,
  lessonBodyToParagraphs,
  AREA_LABEL
} from "@renace/core";
import { AREA_THEMES } from "@renace/tokens";
import { areaHeroGradient, HERO_RADIAL_GLOW } from "@/lib/areaHeroStyles";
import { BackLink } from "@/components/BackLink";
import { LessonCompleteButton } from "@/components/cursos/LessonCompleteButton";

type Props = { params: Promise<{ slug: string; n: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, n } = await params;
  const lessonNum = Number.parseInt(n, 10);
  const { client, userId } = await requireUser();
  const course = await getCourseBySlug(client, userId, slug);
  const lesson = getCourseLesson(slug, lessonNum, course?.lessons_count);
  if (course && lesson) {
    return { title: `${lesson.title} · ${course.title} · RENACE` };
  }
  return { title: `${slug} · RENACE` };
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

  const theme = AREA_THEMES[course.area];
  const enrolled = course.enrollment;
  const currentLesson = enrolled?.current_lesson ?? 0;
  const alreadyDone = lessonNum <= currentLesson;
  const isCurrent = lessonNum === currentLesson + 1 || (currentLesson === 0 && lessonNum === 1);

  return (
    <div className="page-stack px-5 py-5">
      <BackLink fallbackHref={`/cursos/${slug}`} label={course.title} />

      <header className="relative -mx-5">
        <div
          className="relative overflow-hidden px-5 pb-6 pt-6 text-ink-inverse"
          style={{
            background: areaHeroGradient(theme.core, theme.coreDark)
          }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -right-20 -top-10 h-48 w-48 rounded-full opacity-20"
            style={{ background: HERO_RADIAL_GLOW }}
          />
          <div className="relative flex items-center gap-3">
            <span
              aria-hidden
              className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-white/20 text-2xl backdrop-blur-sm"
            >
              {course.emoji ?? "📖"}
            </span>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/80">
                {AREA_LABEL[course.area]} · Lección {lessonNum}/{lessons.length}
              </p>
              <h1 className="mt-0.5 text-xl font-bold leading-tight">{lesson.title}</h1>
            </div>
          </div>
          <p className="relative mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-white/85">
            <IconClockHour3 size={13} aria-hidden />
            {lesson.durationMin} min · Lectura guiada
          </p>
        </div>
      </header>

      <div
        className="h-1.5 overflow-hidden rounded-full bg-outline-soft"
        role="progressbar"
        aria-valuenow={Math.round((lessonNum / lessons.length) * 100)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Lección ${lessonNum} de ${lessons.length}`}
      >
        <div
          className="h-full rounded-full transition-all"
          style={{
            width: `${Math.round((lessonNum / lessons.length) * 100)}%`,
            background: theme.core
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
      </article>

      {enrolled ? (
        <LessonCompleteButton
          courseId={course.id}
          slug={slug}
          lessonIndex={lessonNum}
          totalLessons={lessons.length}
          accent={theme.core}
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
