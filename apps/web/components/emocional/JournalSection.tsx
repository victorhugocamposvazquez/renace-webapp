"use client";

import { useState, useTransition } from "react";
import { IconNotebook, IconTrash } from "@tabler/icons-react";
import type { JournalEntry } from "@renace/supabase";
import { relativeFromNow } from "@renace/core";
import {
  addJournalAction,
  deleteJournalAction
} from "@/app/(app)/emocional/actions";
import { ConfirmModal } from "@/components/ConfirmModal";

const PREVIEW_COUNT = 3;

export function JournalSection({ entries }: { entries: JournalEntry[] }) {
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<JournalEntry | null>(null);
  const [isPending, startTransition] = useTransition();

  function submit() {
    if (!content.trim()) {
      setError("Escribe algo, aunque sea breve");
      return;
    }
    startTransition(async () => {
      const fd = new FormData();
      fd.set("content", content.trim());
      const result = await addJournalAction(fd);
      if (!result.ok) setError(result.error);
      else {
        setContent("");
        setError(null);
      }
    });
  }

  function confirmRemove() {
    if (!pendingDelete) return;
    startTransition(async () => {
      const fd = new FormData();
      fd.set("id", pendingDelete.id);
      await deleteJournalAction(fd);
      setPendingDelete(null);
    });
  }

  return (
    <section
      id="diario"
      aria-labelledby="journal-title"
      className="card border-area-emocional-border"
    >
      <div className="flex items-center gap-2">
        <span
          className="grid h-9 w-9 place-items-center rounded-xl bg-area-emocional-tint text-area-emocional"
          aria-hidden
        >
          <IconNotebook size={18} aria-hidden />
        </span>
        <h2 id="journal-title" className="text-base font-bold text-ink-primary">
          Diario personal
        </h2>
      </div>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        maxLength={5000}
        rows={3}
        placeholder="Escribe en privado. Solo lo lees tú."
        className="mt-3 w-full resize-none rounded-xl border border-outline-medium bg-canvas p-3 text-base text-ink-primary outline-none transition-shadow focus:border-area-emocional"
        aria-label="Nueva entrada de diario"
      />
      {error && (
        <p
          role="alert"
          className="mt-2 rounded-xl border border-state-danger/20 bg-state-danger/5 px-3 py-2 text-sm font-medium text-state-danger"
        >
          {error}
        </p>
      )}
      <button type="button" className="btn-primary mt-3" onClick={submit} disabled={isPending}>
        {isPending ? "Guardando…" : "Guardar entrada"}
      </button>

      {entries.length > 0 && (
        <ul
          role="list"
          className="mt-4 flex flex-col gap-3 border-t border-outline-soft pt-3"
        >
          {entries.slice(0, PREVIEW_COUNT).map((e) => (
            <li key={e.id} className="group flex items-start gap-2 text-sm">
              <div className="flex-1">
                <p className="whitespace-pre-line text-ink-primary">{e.content}</p>
                <p className="mt-1 text-xs text-ink-subtle">
                  {relativeFromNow(new Date(e.created_at))}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPendingDelete(e)}
                aria-label="Borrar entrada"
                className="tap-target -mr-2 grid shrink-0 place-items-center rounded-full text-ink-subtle opacity-0 transition-all duration-200 hover:text-state-danger focus:opacity-100 group-hover:opacity-100"
              >
                <IconTrash size={16} aria-hidden />
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
        title="¿Borrar esta entrada del diario?"
        description={
          pendingDelete ? (
            <>
              <p>
                Vamos a borrar definitivamente esta entrada del{" "}
                {relativeFromNow(new Date(pendingDelete.created_at))}.
              </p>
              <p className="mt-2 max-h-32 overflow-hidden rounded-lg border border-outline-soft bg-canvas px-3 py-2 italic text-ink-secondary">
                «{pendingDelete.content.slice(0, 220)}
                {pendingDelete.content.length > 220 ? "…" : ""}»
              </p>
              <p className="mt-2 text-ink-subtle">No se puede deshacer.</p>
            </>
          ) : null
        }
        confirmLabel="Sí, borrar"
        cancelLabel="Mantener"
      />
    </section>
  );
}
