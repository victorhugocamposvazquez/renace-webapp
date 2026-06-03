"use client";

import { useState, useTransition } from "react";
import { IconTrash } from "@tabler/icons-react";
import type { ConsultRequest } from "@renace/supabase";
import { relativeFromNow } from "@renace/core";
import { deleteConsultRequestAction } from "@/app/(app)/juridica/actions";
import { ConfirmModal } from "@/components/ConfirmModal";

const STATUS_LABEL: Record<string, string> = {
  submitted: "Enviada",
  reviewing: "En revisión",
  scheduled: "Cita pendiente",
  closed: "Cerrada"
};

export function ConsultList({ consults }: { consults: ConsultRequest[] }) {
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  if (consults.length === 0) return null;

  const toDelete = consults.find((c) => c.id === pendingId);

  function confirmDelete() {
    if (!toDelete) return;
    startTransition(async () => {
      const fd = new FormData();
      fd.set("id", toDelete.id);
      const result = await deleteConsultRequestAction(fd);
      if (!result.ok) {
        setError(result.error);
      } else {
        setError(null);
      }
      setPendingId(null);
    });
  }

  return (
    <>
      <h2 className="label-eyebrow mt-2">Tus consultas</h2>
      {error && (
        <p
          role="alert"
          className="rounded-xl border border-state-danger/20 bg-state-danger/5 px-3 py-2 text-sm font-medium text-state-danger"
        >
          {error}
        </p>
      )}
      <ul role="list" className="flex flex-col gap-2">
        {consults.map((c) => {
          const deletable = c.status === "submitted";
          return (
            <li
              key={c.id}
              className="card flex items-start gap-3 border-area-juridica-border"
            >
              <div className="flex-1">
                <p className="text-sm font-semibold text-ink-primary">
                  {c.body.slice(0, 80)}
                  {c.body.length > 80 ? "…" : ""}
                </p>
                <p className="mt-1 text-xs text-ink-subtle">
                  {relativeFromNow(new Date(c.created_at))}
                </p>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-1.5">
                <span className="pill bg-area-juridica-tint text-area-juridica-text">
                  {STATUS_LABEL[c.status] ?? c.status}
                </span>
                {deletable && (
                  <button
                    type="button"
                    onClick={() => setPendingId(c.id)}
                    aria-label="Borrar consulta"
                    className="tap-target inline-flex min-h-[44px] items-center gap-1 rounded-full px-3 text-[12px] font-semibold text-ink-subtle transition-colors hover:text-state-danger"
                  >
                    <IconTrash size={15} stroke={2} aria-hidden /> Borrar
                  </button>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      <ConfirmModal
        open={!!toDelete}
        onCancel={() => !isPending && setPendingId(null)}
        onConfirm={confirmDelete}
        busy={isPending}
        tone="danger"
        icon={<IconTrash size={22} stroke={2.2} aria-hidden />}
        title="¿Borrar esta consulta?"
        description={
          toDelete ? (
            <>
              <p>
                Vamos a borrar definitivamente la consulta:
              </p>
              <p className="mt-2 rounded-lg border border-outline-soft bg-canvas px-3 py-2 text-ink-secondary">
                «{toDelete.body.slice(0, 120)}
                {toDelete.body.length > 120 ? "…" : ""}»
              </p>
              <p className="mt-2 text-ink-subtle">
                Esta acción no se puede deshacer. Solo puedes borrar consultas que
                todavía no han sido revisadas por el equipo legal.
              </p>
            </>
          ) : null
        }
        confirmLabel="Sí, borrar"
        cancelLabel="Mantener"
      />
    </>
  );
}
