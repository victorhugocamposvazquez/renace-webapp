"use client";

import { useState, useTransition } from "react";
import { createPostAction } from "@/app/(app)/comunidad/actions";

export function Composer() {
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function submit() {
    setError(null);
    if (!body.trim()) {
      setError("Escribe algo, aunque sea una línea");
      return;
    }
    startTransition(async () => {
      const fd = new FormData();
      fd.set("body", body.trim());
      const result = await createPostAction(fd);
      if (!result.ok) setError(result.error);
      else setBody("");
    });
  }

  return (
    <div className="card border-area-comunidad-border">
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        maxLength={800}
        rows={3}
        placeholder="Comparte un avance, una pregunta o un mal día. Sin juicios."
        className="w-full resize-none rounded-lg border border-outline-medium bg-canvas p-3 text-base text-ink-primary outline-none focus:border-area-comunidad"
        aria-label="Nueva publicación"
      />
      {error && (
        <p role="alert" className="mt-2 text-sm font-semibold text-state-danger">
          {error}
        </p>
      )}
      <button
        type="button"
        className="btn-primary mt-3"
        style={{ backgroundColor: "#5A4FB8" }}
        onClick={submit}
        disabled={isPending}
      >
        {isPending ? "Publicando…" : "Publicar"}
      </button>
    </div>
  );
}
