"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  IconBellRinging,
  IconBellOff,
  IconBroadcast,
  IconCalendarTime,
  IconVideo,
  IconClockHour3
} from "@tabler/icons-react";
import type { CourseWithEnrollment } from "@renace/supabase";
import { formatCountdown, formatDuration } from "@renace/core";
import { AREA_THEMES } from "@renace/tokens";
import { toggleClassReminderAction } from "@/app/(app)/cursos/actions";
import { CourseThumbnail } from "./CourseThumbnail";
import { AreaBadge } from "./AreaBadge";

/**
 * Card grande para una clase en directo:
 * - Si falta poco (<30 min): CTA principal "Unirme ahora" (color del curso).
 * - Si falta más: CTA "Recordarme" toggleable (campana on/off).
 *
 * Optimistic UI: la campana cambia al instante, sincroniza con servidor en
 * background y revierte si falla.
 */
export function LiveClassCard({
  course,
  variant = "full"
}: {
  course: CourseWithEnrollment;
  variant?: "full" | "compact";
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [optimisticReminder, setOptimisticReminder] = useState<boolean>(
    course.enrollment?.reminder_set ?? false
  );

  const theme = AREA_THEMES[course.area];
  const accent = theme.core;
  const accentDark = theme.coreDark;

  if (!course.starts_at) return null;
  const startsAt = new Date(course.starts_at);
  const now = new Date();
  const diffMs = startsAt.getTime() - now.getTime();
  const diffMin = Math.round(diffMs / 60000);
  const isLive = diffMs <= 0 && diffMin > -90;
  const isSoon = diffMin > 0 && diffMin <= 30;

  function onToggleReminder() {
    const next = !optimisticReminder;
    setOptimisticReminder(next);
    startTransition(async () => {
      const fd = new FormData();
      fd.set("courseId", course.id);
      const res = await toggleClassReminderAction(undefined, fd);
      if (res && "error" in res) {
        setOptimisticReminder(!next);
      } else {
        router.refresh();
      }
    });
  }

  if (variant === "compact") {
    return (
      <article className="card-lift flex items-center gap-3 p-3">
        <CourseThumbnail
          slug={course.slug}
          accent={accent}
          emoji={course.emoji}
          size="sm"
          rounded="xl"
        />
        <div className="flex-1">
          <div className="mb-1 flex flex-wrap items-center gap-1.5">
            <AreaBadge area={course.area} size="sm" />
            {isLive ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-state-danger px-1.5 py-0.5 text-[10px] font-bold uppercase text-ink-inverse">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
                En directo
              </span>
            ) : (
              <span
                className="inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-bold uppercase text-ink-inverse"
                style={{ background: accent }}
              >
                <IconBroadcast size={10} aria-hidden />
                En directo
              </span>
            )}
          </div>
          <h3 className="line-clamp-1 text-sm font-bold text-ink-primary">
            {course.title}
          </h3>
          <p className="line-clamp-1 text-[11px] text-ink-subtle">
            {formatCountdown(startsAt)} · {formatDuration(course.total_minutes)}
          </p>
        </div>
        {isLive || isSoon ? (
          <Link
            href={`/cursos/${course.slug}`}
            className="grid h-10 w-10 place-items-center rounded-full text-ink-inverse shadow-card active:scale-95"
            style={{ background: accent }}
            aria-label="Unirme a la clase en directo"
          >
            <IconVideo size={18} aria-hidden />
          </Link>
        ) : (
          <button
            type="button"
            onClick={onToggleReminder}
            disabled={pending}
            aria-pressed={optimisticReminder}
            aria-label={
              optimisticReminder
                ? "Quitar recordatorio"
                : "Activar recordatorio"
            }
            className={
              "grid h-10 w-10 place-items-center rounded-full border transition active:scale-95 " +
              (optimisticReminder
                ? "border-transparent bg-accent-500 text-ink-inverse"
                : "border-outline-soft bg-canvas text-ink-secondary")
            }
          >
            {optimisticReminder ? (
              <IconBellRinging size={18} aria-hidden />
            ) : (
              <IconBellOff size={18} aria-hidden />
            )}
          </button>
        )}
      </article>
    );
  }

  // FULL
  return (
    <article
      className="relative overflow-hidden rounded-3xl p-5 text-ink-inverse shadow-lift"
      style={{
        background: `linear-gradient(135deg, ${accent} 0%, ${accentDark} 100%)`
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-12 h-48 w-48 rounded-full opacity-20"
        style={{ background: "radial-gradient(circle, #fff 0%, transparent 70%)" }}
      />

      <div className="relative flex flex-wrap items-center gap-2">
        <AreaBadge area={course.area} onDark />
        {isLive ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-state-danger">
            <span className="h-2 w-2 animate-pulse rounded-full bg-state-danger" />
            En directo ahora
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-2 py-1 text-[11px] font-bold uppercase tracking-wider">
            <IconBroadcast size={12} aria-hidden />
            Clase en directo
          </span>
        )}
        <span className="ml-auto text-[11px] font-medium opacity-90">
          {formatCountdown(startsAt)}
        </span>
      </div>

      <h3 className="relative mt-3 text-xl font-bold leading-tight">
        {course.title}
      </h3>
      {course.description && (
        <p className="relative mt-1.5 line-clamp-2 text-sm text-white/85">
          {course.description}
        </p>
      )}

      <div className="relative mt-3 flex items-center gap-3 text-xs">
        {course.instructor_name && (
          <span className="font-medium opacity-90">{course.instructor_name}</span>
        )}
        <span className="inline-flex items-center gap-1 opacity-90">
          <IconClockHour3 size={12} aria-hidden />
          {formatDuration(course.total_minutes)}
        </span>
      </div>

      <div className="relative mt-4 flex gap-2">
        {isLive || isSoon ? (
          <Link
            href={`/cursos/${course.slug}`}
            className="btn-white flex-1 text-center"
            style={{ color: accentDark }}
          >
            <IconVideo size={16} aria-hidden className="-mt-px" />
            <span>{isLive ? "Unirme ahora" : "Preparar mi entrada"}</span>
          </Link>
        ) : (
          <button
            type="button"
            onClick={onToggleReminder}
            disabled={pending}
            aria-pressed={optimisticReminder}
            className={
              "flex flex-1 items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-sm font-bold transition active:scale-[0.98] " +
              (optimisticReminder
                ? "bg-white/95 text-ink-primary"
                : "bg-white/20 text-ink-inverse")
            }
          >
            {optimisticReminder ? (
              <>
                <IconBellRinging size={16} aria-hidden />
                Recordatorio activo
              </>
            ) : (
              <>
                <IconCalendarTime size={16} aria-hidden />
                Recordarme
              </>
            )}
          </button>
        )}
      </div>
    </article>
  );
}
