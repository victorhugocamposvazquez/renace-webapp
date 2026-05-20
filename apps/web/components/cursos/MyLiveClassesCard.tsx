import Link from "next/link";
import {
  IconBellRinging,
  IconBroadcast,
  IconChevronRight
} from "@tabler/icons-react";
import type { CourseWithEnrollment } from "@renace/supabase";
import { formatCountdown } from "@renace/core";

/**
 * Card de "Tus próximas clases" pensada para la home: lista compacta
 * de clases con recordatorio activado. Si la primera está cerca, se
 * destaca con CTA de unirme.
 */
export function MyLiveClassesCard({
  classes
}: {
  classes: CourseWithEnrollment[];
}) {
  if (classes.length === 0) return null;
  return (
    <section className="rounded-3xl border border-outline-soft bg-surface p-4 shadow-card">
      <header className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-brand-50 text-brand-700">
            <IconBellRinging size={16} aria-hidden />
          </span>
          <div>
            <h2 className="text-sm font-bold text-ink-primary">
              Tus próximas clases
            </h2>
            <p className="text-[11px] text-ink-subtle">Con recordatorio activo</p>
          </div>
        </div>
      </header>

      <ul role="list" className="flex flex-col gap-2">
        {classes.map((c) => {
          const startsAt = c.starts_at ? new Date(c.starts_at) : null;
          if (!startsAt) return null;
          const diffMin = Math.round(
            (startsAt.getTime() - Date.now()) / 60000
          );
          const isSoon = diffMin > 0 && diffMin <= 30;
          const isLive = diffMin <= 0 && diffMin > -90;
          return (
            <li key={c.id}>
              <Link
                href={`/cursos/${c.slug}`}
                className="flex items-center gap-3 rounded-xl border border-outline-soft bg-canvas px-3 py-2.5 active:scale-[0.99]"
              >
                <span
                  className="grid h-9 w-9 place-items-center rounded-lg text-base"
                  style={{ background: `${c.accent_color}1f` }}
                  aria-hidden
                >
                  {c.emoji ?? "🎙️"}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-1 text-sm font-semibold text-ink-primary">
                    {c.title}
                  </p>
                  <p className="line-clamp-1 text-[11px] text-ink-subtle">
                    {isLive ? (
                      <span className="font-bold text-state-danger">
                        En directo ahora
                      </span>
                    ) : (
                      formatCountdown(startsAt)
                    )}
                    {c.instructor_name ? ` · ${c.instructor_name}` : ""}
                  </p>
                </div>
                {isSoon || isLive ? (
                  <span
                    className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold text-ink-inverse"
                    style={{ background: c.accent_color }}
                  >
                    <IconBroadcast size={11} aria-hidden />
                    Entrar
                  </span>
                ) : (
                  <IconChevronRight
                    size={16}
                    className="shrink-0 text-ink-subtle"
                    aria-hidden
                  />
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
