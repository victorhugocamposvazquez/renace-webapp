"use client";

import { useState, useTransition } from "react";
import { IconShieldCheck, IconTrash, IconAlertTriangle } from "@tabler/icons-react";
import type { Trigger } from "@renace/supabase";
import { TRIGGER_SEVERITY_LABEL, type TriggerSeverity } from "@renace/core";
import { addTriggerAction, deleteTriggerAction, activateTriggerAction } from "@/app/(app)/emocional/actions";
import { ConfirmModal } from "@/components/ConfirmModal";

const SEVERITY_STYLES: Record<TriggerSeverity, string> = {
  1: "bg-area-emocional-tint text-ink-muted",
  2: "bg-area-emocional-tint text-area-emocional-text",
  3: "bg-state-danger/10 text-state-danger"
};

export function TriggersSection({ triggers }: { triggers: Trigger[] }) {
  const [label, setLabel] = useState("");
  const [severity, setSeverity] = useState<TriggerSeverity>(2);
  const [error, setError] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Trigger | null>(null);
  const [isPending, startTransition] = useTransition();

  function submit() {
    if (!label.trim()) {
      setError("Escribe qué te cuesta");
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

  function confirmRemove() {
    if (!pendingDelete) return;
    startTransition(async () => {
      const fd = new FormData();
      fd.set("id", pendingDelete.id);
      await deleteTriggerAction(fd);
      setPendingDelete(null);
    });
  }

  return (
    <section id="triggers" aria-labelledby="triggers-title" className="card border-area-emocional-border">
      <div className="flex items-center gap-2">
        <span className="grid h-9 w-9 place-items-center rounded-lg bg-area-emocional-tint text-area-emocional" aria-hidden>
          <IconShieldCheck size={18} aria-hidden />
        </span>
        <h2 id="triggers-title" className="text-base font-bold text-ink-primary">Lo que te cuesta</h2>
      </div>
      <p className="mt-1 text-sm text-ink-muted">Nombra las situaciones difíciles. Saberlo es la mitad del camino.</p>

      <div className="mt-3 flex flex-col gap-2">
        <input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          maxLength={80}
          placeholder="Una situación, persona o lugar…"
          className="tap-target rounded-lg border border-outline-medium bg-canvas px-3 text-base text-ink-primary outline-none focus:border-area-emocional"
          aria-label="Nueva situación difícil"
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
                onClick={() => {
                  startTransition(async () => {
                    const fd = new FormData();
                    fd.set("triggerId", t.id);
                    await activateTriggerAction(fd);
                  });
                }}
                disabled={isPending}
                aria-label={`Registrar activación de ${t.label}`}
                className="tap-target grid h-9 w-9 place-items-center rounded-full border border-area-emocional-border text-area-emocional transition active:scale-95"
              >
                <IconAlertTriangle size={16} aria-hidden />
              </button>
              <button
                type="button"
                onClick={() => setPendingDelete(t)}
                aria-label={`Borrar ${t.label}`}
                className="tap-target -mr-2 grid place-items-center rounded-full text-ink-subtle transition-colors hover:text-state-danger"
              >
                <IconTrash size={18} aria-hidden />
              </button>
            </li>
          ))}
        </ul>
      )}

      <ConfirmModal
        open={!!pendingDelete}
        onCancel={() => !isPending && setPendingDelete(null)}
        onConfirm={confirmRemove}
        busy={isPending}
        tone="danger"
        icon={<IconTrash size={22} stroke={2.2} aria-hidden />}
        title="¿Borrar esto?"
        description={
          pendingDelete ? (
            <p>
              Vamos a borrar <strong className="font-semibold text-ink-primary">«{pendingDelete.label}»</strong>{" "}
              de tu lista. Si vuelve a aparecer en tu vida, lo puedes añadir otra vez.
            </p>
          ) : null
        }
        confirmLabel="Sí, borrar"
        cancelLabel="Mantener"
      />
    </section>
  );
}
