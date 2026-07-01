import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  IconClockHour3,
  IconPlayerPlayFilled,
  IconBookmark,
  IconCheck,
  IconBroadcast,
  IconBellRinging,
  IconCalendarTime
} from "@tabler/icons-react";
import { requireUser } from "@/lib/auth";
import { getCourseBySlug } from "@renace/supabase";
import { formatCountdown, formatDuration, getCourseLessons, AREA_LABEL, AREA_HREF } from "@renace/core";
import { AREA_THEMES } from "@renace/tokens";
import { areaHeroGradient, areaTint, areaTintMedium, HERO_RADIAL_GLOW } from "@/lib/areaHeroStyles";
import { BackLink } from "@/components/BackLink";
import { ProgressControls } from "@/components/cursos/ProgressControls";
import { ReminderToggleForm } from "@/components/cursos/ReminderToggleForm";
import { EnrollButton } from "@/components/cursos/EnrollButton";
import { LiveClassJoinButton } from "@/components/cursos/LiveClassJoinButton";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { client, userId } = await requireUser();
  const course = await getCourseBySlug(client, userId, slug);
  return {
    title: course ? `${course.title} · RENACE` : `${slug} · RENACE`
  };
}

const AREA_HREF_MAP = AREA_HREF;
const AREA_LABEL_MAP = AREA_LABEL;

export default async function CourseDetailPage({ params }: Props) {
  const { slug } = await params;
  const { client, userId } = await requireUser();
  const course = await getCourseBySlug(client, userId, slug);
  if (!course) notFound();

  const theme = AREA_THEMES[course.area];
  const accent = theme.core;
  const enrolled = course.enrollment;
  const progress = enrolled?.progress_percent ?? 0;
  const completed = !!enrolled?.completed_at;
  const isLive = course.kind === "live_class";
  const startsAt = course.starts_at ? new Date(course.starts_at) : null;
  const diffMs = startsAt ? startsAt.getTime() - Date.now() : 0;
  const isAirNow = startsAt ? diffMs <= 0 && diffMs > -90 * 60 * 1000 : false;
  const isSoon = startsAt ? diffMs > 0 && diffMs <= 30 * 60 * 1000 : false;
  const justEnrolled =
    !isLive &&
    !!enrolled &&
    !completed &&
    progress === 0 &&
    Date.now() - new Date(enrolled.last_seen_at).getTime() < 60_000;
  const lessons = getCourseLessons(course.slug, course.lessons_count);

  return (
    <div className="page-stack px-5 py-5">
      <BackLink fallbackHref={AREA_HREF_MAP[course.area]} label={AREA_LABEL_MAP[course.area]} />

      <header className="relative -mx-5 -mt-5">
        <div
          className="relative overflow-hidden px-5 pb-6 pt-8 text-ink-inverse"
          style={{
            background: areaHeroGradient(theme.core, theme.coreDark)
          }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -right-24 -top-12 h-64 w-64 rounded-full opacity-20"
            style={{ background: HERO_RADIAL_GLOW }}
          />
          <div className="relative flex items-center gap-4">
            <span
              aria-hidden
              className="grid h-[88px] w-[88px] shrink-0 place-items-center rounded-2xl bg-white/20 text-3xl backdrop-blur-sm"
            >
              {course.emoji ?? "🎓"}
            </span>
            <div className="flex flex-col gap-1">
              <span className="inline-flex w-fit items-center gap-1 rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                {isLive ? (
                  <>
                    <IconBroadcast size={11} aria-hidden /> Clase en directo
                  </>
                ) : (
                  <>{AREA_LABEL_MAP[course.area]} · Curso</>
                )}
              </span>
              {course.instructor_name && (
                <p className="text-xs font-medium opacity-90">
                  con {course.instructor_name}
                  {course.instructor_role ? ` · ${course.instructor_role}` : ""}
                </p>
              )}
            </div>
          </div>
          <h1 className="relative mt-4 text-2xl font-bold leading-tight">
            {course.title}
          </h1>
          {course.description && (
            <p className="relative mt-2 text-sm text-white/85">{course.description}</p>
          )}

          <div className="relative mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] font-medium opacity-95">
            <span className="inline-flex items-center gap-1">
              <IconClockHour3 size={13} aria-hidden />
              {formatDuration(course.total_minutes)}
            </span>
            <span aria-hidden>·</span>
            <span>{course.lessons_count} {isLive ? "sesión" : "lecciones"}</span>
            {startsAt && (
              <>
                <span aria-hidden>·</span>
                <span className="inline-flex items-center gap-1">
                  <IconCalendarTime size={13} aria-hidden />
                  {formatCountdown(startsAt)}
                </span>
              </>
            )}
          </div>
        </div>
      </header>

      {justEnrolled && (
        <div
          className="flex items-start gap-3 rounded-2xl border p-3"
          style={{
            background: areaTint(accent, 0.08),
            borderColor: areaTint(accent, 0.2)
          }}
          role="status"
        >
          <span
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-ink-inverse"
            style={{ background: accent }}
            aria-hidden
          >
            <IconCheck size={16} />
          </span>
          <div className="text-sm">
            <p className="font-bold text-ink-primary">¡Estás inscrito!</p>
            <p className="text-xs text-ink-subtle">
              Este curso ya aparece en <strong>“Tu plan en marcha”</strong> de
              tu home y de {AREA_LABEL_MAP[course.area].toLowerCase()}. Continúa
              desde donde quieras.
            </p>
          </div>
        </div>
      )}

      {isLive ? (
        isAirNow || isSoon ? (
          <LiveClassJoinButton
            courseId={course.id}
            accent={accent}
            label={isAirNow ? "Recordarme la sesión" : "Apúntame al recordatorio"}
            initialReminder={!!enrolled?.reminder_set}
          />
        ) : (
          <ReminderToggleForm
            courseId={course.id}
            initial={!!enrolled?.reminder_set}
            accent={accent}
          />
        )
      ) : completed ? (
        <button
          disabled
          className="btn-secondary cursor-default"
          aria-label="Curso completado"
        >
          <IconCheck size={16} aria-hidden /> Completado
        </button>
      ) : enrolled ? (
        <ProgressControls
          courseId={course.id}
          slug={slug}
          totalLessons={course.lessons_count}
          progress={progress}
          currentLesson={enrolled.current_lesson}
          accent={accent}
        />
      ) : (
        <EnrollButton courseId={course.id} accent={accent} />
      )}

      <section className="card">
        <h2 className="text-sm font-bold text-ink-primary">Qué vas a conseguir</h2>
        <p className="mt-1 text-sm text-ink-secondary">{course.exit_market}</p>
        {course.format && (
          <p className="mt-2 text-xs text-ink-muted">Formato: {course.format}</p>
        )}
      </section>

      {!isLive && (
        <section>
          <h2 className="label-eyebrow mb-2">Lecciones</h2>
          <ol className="card divide-y divide-outline-soft p-0">
            {lessons.map((lesson, i) => {
              const done = enrolled ? i < (enrolled.current_lesson ?? 0) : false;
              const current = enrolled ? i === (enrolled.current_lesson ?? 0) : false;
              const lessonNum = i + 1;
              const canOpen = enrolled && (done || current || i <= (enrolled.current_lesson ?? 0));
              const inner = (
                <>
                  <span
                    className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-xs font-bold"
                    style={{
                      background: done
                        ? accent
                        : current
                          ? areaTintMedium(accent)
                          : "var(--outline-soft, #F4F4F2)",
                      color: done
                        ? theme.onCore
                        : current
                          ? theme.text
                          : "var(--ink-muted, #6E6E6E)"
                    }}
                  >
                    {done ? <IconCheck size={14} aria-hidden /> : lessonNum}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-ink-primary truncate">
                      {lesson.title}
                    </div>
                    <div className="text-[11px] text-ink-subtle">
                      {lesson.durationMin} min
                    </div>
                  </div>
                  {(current || (!enrolled && i === 0)) && (
                    <span
                      className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-ink-inverse"
                      style={{ background: accent }}
                    >
                      <IconPlayerPlayFilled size={12} aria-hidden />
                    </span>
                  )}
                </>
              );
              return (
                <li key={i}>
                  {canOpen || (!enrolled && i === 0) ? (
                    <Link
                      href={`/cursos/${slug}/leccion/${lessonNum}`}
                      className="flex items-center gap-3 px-4 py-3 transition active:bg-canvas"
                    >
                      {inner}
                    </Link>
                  ) : (
                    <div className="flex items-center gap-3 px-4 py-3 opacity-60">
                      {inner}
                    </div>
                  )}
                </li>
              );
            })}
          </ol>
        </section>
      )}

      {isLive && (
        <section id="join" className="card">
          <h2 className="text-sm font-bold text-ink-primary">
            Cómo participar
          </h2>
          <p className="mt-1 text-sm text-ink-secondary">
            Cuando empiece la clase, te llegará un aviso para entrar. Mientras
            tanto puedes activar el recordatorio para no perderla.
          </p>
          {enrolled?.reminder_set && (
            <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-accent-50 px-2.5 py-1 text-[11px] font-bold text-accent-700">
              <IconBellRinging size={12} aria-hidden /> Recordatorio activado
            </p>
          )}
          {enrolled && !enrolled.reminder_set && (
            <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-canvas px-2.5 py-1 text-[11px] font-bold text-ink-secondary">
              <IconBookmark size={12} aria-hidden /> Sin recordatorio
            </p>
          )}
        </section>
      )}
    </div>
  );
}
