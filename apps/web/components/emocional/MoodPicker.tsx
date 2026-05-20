"use client";

import { useState, useTransition } from "react";
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
    <section
      aria-labelledby="mood-title"
      className="card border-area-emocional-border"
    >
      <p id="mood-title" className="label-eyebrow text-ink-primary">
        ¿Cómo te sientes?
      </p>
      <div className="mt-3 flex justify-between gap-1.5">
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
                "tap-target flex-1 rounded-lg text-2xl",
                active ? "bg-area-emocional-tint" : "bg-canvas"
              )}
              style={
                active
                  ? { border: "2px solid #B83A66" }
                  : { border: "2px solid transparent" }
              }
            >
              <span aria-hidden>{emoji}</span>
            </button>
          );
        })}
      </div>

      {score !== null && (
        <div className="mt-3 flex flex-col gap-2">
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-semibold text-ink-secondary">Una nota (opcional)</span>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              maxLength={500}
              rows={2}
              className="resize-none rounded-lg border border-outline-medium bg-elevated px-3 py-2 text-sm text-ink-primary outline-none focus:border-area-emocional"
              placeholder="¿Qué ha pasado hoy?"
            />
          </label>
          {error && (
            <p role="alert" className="text-sm font-semibold text-state-danger">
              {error}
            </p>
          )}
          <div className="flex items-center gap-2">
            <button type="button" className="btn-primary flex-1" onClick={save} disabled={isPending}>
              {isPending ? "Guardando…" : saved ? "Guardado" : "Guardar"}
            </button>
            {saved && (
              <span role="status" className="text-sm font-semibold text-brand-600">
                ✓
              </span>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
