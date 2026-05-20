"use client";

import { useState, useTransition } from "react";
import { IconShieldCheck, IconTrash } from "@tabler/icons-react";
import type { Trigger } from "@renace/supabase";
import { TRIGGER_SEVERITY_LABEL, type TriggerSeverity } from "@renace/core";
import { addTriggerAction, deleteTriggerAction } from "@/app/(app)/emocional/actions";

const SEVERITY_STYLES: Record<TriggerSeverity, string> = {
  1: "bg-area-emocional-tint text-ink-muted",
  2: "bg-area-emocional-tint text-area-emocional-text",
  3: "bg-state-danger/10 text-state-danger"
};

export function TriggersSection({ triggers }: { triggers: Trigger[] }) {
  const [label, setLabel] = useState("");
  const [severity, setSeverity] = useState<TriggerSeverity>(2);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function submit() {
    if (!label.trim()) {
      setError("Pon un disparador");
      return;
    }
    startTransition(async () => {
      const fd = new FormData();
      fd.set("label", label.trim());
      fd.set("severity", String(severity));
      const result = await addTriggerAction(fd);
      if (!result.ok) setError(result.error);
      else {
        setLabel("");
        setError(null);
      }
    });
  }

  function remove(id: string) {
    startTransition(async () => {
      const fd = new FormData();
      fd.set("id", id);
      await deleteTriggerAction(fd);
    });
  }

  return (
    <section id="triggers" aria-labelledby="triggers-title" className="card border-area-emocional-border">
      <div className="flex items-center gap-2">
        <span className="grid h-9 w-9 place-items-center rounded-lg bg-area-emocional-tint text-area-emocional" aria-hidden>
          <IconShieldCheck size={18} aria-hidden />
        </span>
        <h2 id="triggers-title" className="text-base font-bold text-ink-primary">Prevención de recaídas</h2>
      </div>
      <p className="mt-1 text-sm text-ink-muted">Nombra lo que te dispara. Saberlo es la mitad del camino.</p>

      <div className="mt-3 flex flex-col gap-2">
        <input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          maxLength={80}
          placeholder="Una situación, persona o lugar…"
          className="tap-target rounded-lg border border-outline-medium bg-canvas px-3 text-base text-ink-primary outline-none focus:border-area-emocional"
          aria-label="Nuevo disparador"
        />
        <div className="flex gap-1.5">
          {([1, 2, 3] as TriggerSeverity[]).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSeverity(s)}
              aria-pressed={severity === s}
              className={
                "tap-target flex-1 rounded-full border text-xs font-semibold " +
                (severity === s
                  ? "border-area-emocional bg-area-emocional text-ink-inverse"
                  : "border-outline-medium bg-elevated text-ink-secondary")
              }
            >
              {TRIGGER_SEVERITY_LABEL[s]}
            </button>
          ))}
        </div>
        {error && (
          <p role="alert" className="text-sm font-semibold text-state-danger">
            {error}
          </p>
        )}
        <button type="button" className="btn-primary" onClick={submit} disabled={isPending}>
          {isPending ? "Guardando…" : "Añadir"}
        </button>
      </div>

      {triggers.length > 0 && (
        <ul role="list" className="mt-4 flex flex-col gap-2">
          {triggers.map((t) => (
            <li
              key={t.id}
              className="flex items-center gap-2 rounded-lg border border-outline-soft bg-canvas px-3 py-2"
            >
              <span
                className={"pill " + SEVERITY_STYLES[t.severity as TriggerSeverity]}
              >
                {TRIGGER_SEVERITY_LABEL[t.severity as TriggerSeverity]}
              </span>
              <span className="flex-1 text-sm text-ink-primary">{t.label}</span>
              <button
                type="button"
                onClick={() => remove(t.id)}
                aria-label={`Borrar ${t.label}`}
                className="tap-target -mr-2 grid place-items-center text-ink-subtle"
              >
                <IconTrash size={18} aria-hidden />
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
