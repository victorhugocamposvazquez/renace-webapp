"use client";

import { useState, useTransition } from "react";
import { IconCheck } from "@tabler/icons-react";
import { MOOD_LABELS, type MoodScore } from "@renace/core";
import { logMoodAction } from "@/app/(app)/emocional/actions";
import { cn } from "@/lib/cn";

export function MoodPicker({ initialScore = null }: { initialScore?: MoodScore | null }) {
  const [score, setScore] = useState<MoodScore | null>(initialScore);
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(initialScore !== null);
  const [isPending, startTransition] = useTransition();

  function choose(n: MoodScore) {
    setScore(n);
    setSaved(false);
    setError(null);
  }

  function save() {
    if (score === null) return;
    setError(null);
    startTransition(async () => {
      const fd = new FormData();
      fd.set("score", String(score));
      if (note.trim()) fd.set("note", note.trim());
      const result = await logMoodAction(fd);
      if (!result.ok) setError(result.error);
      else setSaved(true);
    });
  }

  return (
    <section aria-labelledby="mood-title" className="card border-area-emocional-border/60">
      <p id="mood-title" className="label-eyebrow text-area-emocional">
        ¿Cómo te sientes hoy?
      </p>
      <p className="mt-1 text-[14px] text-ink-muted">
        Elige la cara que mejor te represente. Solo tú lo ves.
      </p>

      <div className="mt-4 flex justify-between gap-2">
        {([1, 2, 3, 4, 5] as MoodScore[]).map((n) => {
          const { emoji, label } = MOOD_LABELS[n]!;
          const active = score === n;
          return (
            <button
              key={n}
              type="button"
              onClick={() => choose(n)}
              aria-pressed={active}
              aria-label={label}
              className={cn(
                "mood-option",
                active ? "mood-option-active" : "mood-option-idle"
              )}
            >
              <span className="text-[28px] leading-none" aria-hidden>
                {emoji}
              </span>
              <span
                className={cn(
                  "text-[10px] font-bold leading-none",
                  active ? "text-area-emocional" : "text-ink-subtle"
                )}
              >
                {label.split(" ")[0]}
              </span>
            </button>
          );
        })}
      </div>

      {score !== null && (
        <div className="mt-4 flex flex-col gap-3 border-t border-outline-soft/80 pt-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-semibold text-ink-secondary">
              Una nota (opcional)
            </span>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              maxLength={500}
              rows={2}
              className="resize-none rounded-2xl border border-outline-medium bg-canvas px-3 py-2.5 text-sm text-ink-primary outline-none transition-all focus:border-area-emocional focus:shadow-[0_0_0_4px_rgba(184,58,102,0.12)]"
              placeholder="¿Qué ha pasado hoy?"
            />
          </label>
          {error && (
            <p role="alert" className="text-sm font-semibold text-state-danger">
              {error}
            </p>
          )}
          <button
            type="button"
            className="btn-primary"
            onClick={save}
            disabled={isPending || saved}
          >
            {isPending ? "Guardando…" : saved ? "Guardado hoy" : "Guardar mi ánimo"}
          </button>
          {saved && (
            <p
              role="status"
              className="flex items-center justify-center gap-1.5 text-sm font-semibold text-brand-700"
            >
              <IconCheck size={16} aria-hidden /> Registrado. Gracias por compartirlo.
            </p>
          )}
        </div>
      )}
    </section>
  );
}
