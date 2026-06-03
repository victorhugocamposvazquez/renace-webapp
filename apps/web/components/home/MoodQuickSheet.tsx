"use client";

import { useState, useTransition } from "react";
import { IconMoodSmile, IconX } from "@tabler/icons-react";
import { MOOD_LABELS, type MoodScore } from "@renace/core";
import { logMoodAction } from "@/app/(app)/emocional/actions";

export function MoodQuickSheet({
  initialScore = null
}: {
  initialScore?: MoodScore | null;
}) {
  const [open, setOpen] = useState(false);
  const [score, setScore] = useState<MoodScore | null>(initialScore);
  const [saved, setSaved] = useState(initialScore !== null);
  const [isPending, startTransition] = useTransition();

  const moodLabel =
    score !== null ? MOOD_LABELS[score]?.label ?? "Registrado" : null;

  function save(n: MoodScore) {
    setScore(n);
    startTransition(async () => {
      const fd = new FormData();
      fd.set("score", String(n));
      const res = await logMoodAction(fd);
      if (res.ok) {
        setSaved(true);
        setOpen(false);
      }
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={
          "flex min-w-[108px] shrink-0 flex-col gap-1 rounded-2xl border px-3 py-2.5 shadow-soft backdrop-blur-sm transition-all active:scale-[0.98] " +
          (moodLabel
            ? "border-area-emocional-border/80 bg-area-emocional-tint/60 text-area-emocional-text"
            : "border-dashed border-outline-medium bg-elevated/70 text-ink-secondary")
        }
      >
        <div className="flex items-center gap-1.5">
          <IconMoodSmile size={14} aria-hidden className="opacity-80" />
          <span className="text-[13px] font-bold">{moodLabel ?? "¿Cómo estás?"}</span>
        </div>
        <span className="text-[11px] font-medium opacity-75">
          {moodLabel ? "Hoy · Toca para cambiar" : "Toca para registrarlo"}
        </span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-ink-primary/40 p-4 pb-[max(env(safe-area-inset-bottom),16px)]"
          role="dialog"
          aria-labelledby="mood-sheet-title"
        >
          <div className="w-full max-w-[480px] rounded-[24px] bg-elevated p-5 shadow-lift animate-[sheet-in_280ms_ease-out]">
            <div className="mb-4 flex items-center justify-between">
              <h2 id="mood-sheet-title" className="text-lg font-bold text-ink-primary">
                ¿Cómo te sientes?
              </h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Cerrar"
                className="tap-target grid place-items-center rounded-full text-ink-muted"
              >
                <IconX size={20} aria-hidden />
              </button>
            </div>
            <div className="flex justify-between gap-2">
              {([1, 2, 3, 4, 5] as MoodScore[]).map((n) => (
                <button
                  key={n}
                  type="button"
                  disabled={isPending}
                  onClick={() => save(n)}
                  aria-label={MOOD_LABELS[n]?.label}
                  className="mood-option mood-option-idle flex-1"
                >
                  <span className="text-[28px]">{MOOD_LABELS[n]?.emoji}</span>
                </button>
              ))}
            </div>
            {saved && (
              <p className="mt-3 text-center text-sm font-semibold text-brand-700">
                Guardado. Gracias por compartirlo.
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
