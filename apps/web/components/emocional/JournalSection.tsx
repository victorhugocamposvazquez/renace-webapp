"use client";

import { useState, useTransition } from "react";
import { IconNotebook } from "@tabler/icons-react";
import type { JournalEntry } from "@renace/supabase";
import { relativeFromNow } from "@renace/core";
import { addJournalAction } from "@/app/(app)/emocional/actions";

export function JournalSection({ entries }: { entries: JournalEntry[] }) {
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);
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

  return (
    <section id="diario" aria-labelledby="journal-title" className="card border-area-emocional-border">
      <div className="flex items-center gap-2">
        <span className="grid h-9 w-9 place-items-center rounded-lg bg-area-emocional-tint text-area-emocional" aria-hidden>
          <IconNotebook size={18} aria-hidden />
        </span>
        <h2 id="journal-title" className="text-base font-bold text-ink-primary">Diario personal</h2>
      </div>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        maxLength={5000}
        rows={3}
        placeholder="Escribe en privado. Solo lo lees tú."
        className="mt-3 w-full resize-none rounded-lg border border-outline-medium bg-canvas p-3 text-base text-ink-primary outline-none focus:border-area-emocional"
        aria-label="Nueva entrada de diario"
      />
      {error && (
        <p role="alert" className="mt-2 text-sm font-semibold text-state-danger">
          {error}
        </p>
      )}
      <button type="button" className="btn-primary mt-3" onClick={submit} disabled={isPending}>
        {isPending ? "Guardando…" : "Guardar entrada"}
      </button>

      {entries.length > 0 && (
        <ul role="list" className="mt-4 flex flex-col gap-3 border-t border-outline-soft pt-3">
          {entries.slice(0, 3).map((e) => (
            <li key={e.id} className="text-sm">
              <p className="whitespace-pre-line text-ink-primary">{e.content}</p>
              <p className="mt-1 text-xs text-ink-subtle">{relativeFromNow(new Date(e.created_at))}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
