"use client";

import { useTransition } from "react";
import { AREA_LABEL, AREA_ORDER } from "@renace/core";
import { AREA_THEMES } from "@renace/tokens";
import { weeklyCheckinAction } from "@/app/(app)/home/actions";

export function WeeklyCheckin({
  doneThisWeek,
  summary
}: {
  doneThisWeek: boolean;
  summary: { activeDays: number; moodDays: number; actionsDone: number };
}) {
  const [isPending, startTransition] = useTransition();

  if (doneThisWeek) {
    return (
      <section className="card border-brand-200/60 bg-brand-50/40">
        <p className="label-eyebrow text-brand-700">Check-in semanal</p>
        <p className="mt-1 text-sm font-semibold text-ink-primary">
          Esta semana: {summary.activeDays} días activos · {summary.moodDays} registros de ánimo ·{" "}
          {summary.actionsDone} acciones completadas
        </p>
        <p className="mt-1 text-xs text-ink-muted">Ya elegiste tu área a reforzar. ¡Buen trabajo!</p>
      </section>
    );
  }

  return (
    <section className="card border-brand-200/60 bg-brand-50/40">
      <p className="label-eyebrow text-brand-700">Check-in semanal</p>
      <h2 className="mt-1 text-base font-bold text-ink-primary">¿Qué área quieres reforzar?</h2>
      <p className="mt-1 text-sm text-ink-muted">
        {summary.activeDays} días activos esta semana. Elige un foco para la próxima.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {AREA_ORDER.map((area) => {
          const theme = AREA_THEMES[area];
          return (
            <button
              key={area}
              type="button"
              disabled={isPending}
              onClick={() => {
                startTransition(async () => {
                  const fd = new FormData();
                  fd.set("area", area);
                  await weeklyCheckinAction(fd);
                });
              }}
              className="rounded-full border px-3 py-2 text-xs font-bold transition active:scale-95"
              style={{
                borderColor: theme.border,
                backgroundColor: theme.tint,
                color: theme.text
              }}
            >
              {AREA_LABEL[area]}
            </button>
          );
        })}
      </div>
    </section>
  );
}
