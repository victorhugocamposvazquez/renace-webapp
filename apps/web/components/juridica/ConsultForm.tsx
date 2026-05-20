"use client";

import { useState, useTransition } from "react";
import {
  IconCreditCard,
  IconHomeHeart,
  IconFileAlert,
  IconCoin,
  IconFileText,
  IconDots
} from "@tabler/icons-react";
import {
  CONSULT_CATEGORIES,
  CONSULT_CATEGORY_LABEL,
  type ConsultCategory
} from "@renace/core";
import { submitConsultRequestAction } from "@/app/(app)/juridica/actions";

const CATEGORY_ICON: Record<ConsultCategory, React.ComponentType<{ size?: number; "aria-hidden"?: boolean }>> = {
  debt: IconCreditCard,
  custody: IconHomeHeart,
  complaint: IconFileAlert,
  aid: IconCoin,
  docs: IconFileText,
  other: IconDots
};

export function ConsultForm() {
  const [category, setCategory] = useState<ConsultCategory>("debt");
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [isPending, startTransition] = useTransition();

  function submit() {
    setError(null);
    if (body.trim().length < 5) {
      setError("Cuéntanos un poco más");
      return;
    }
    startTransition(async () => {
      const fd = new FormData();
      fd.set("category", category);
      fd.set("body", body.trim());
      const result = await submitConsultRequestAction(fd);
      if (!result.ok) setError(result.error);
      else {
        setSent(true);
        setBody("");
      }
    });
  }

  if (sent) {
    return (
      <div className="card border-area-juridica-border" role="status">
        <p className="text-base font-bold text-ink-primary">Recibido</p>
        <p className="mt-1 text-sm text-ink-muted">
          Te contactará un abogado en menos de 48 horas. Lo verás reflejado en tu caso.
        </p>
        <button type="button" className="btn-secondary mt-3" onClick={() => setSent(false)}>
          Enviar otra consulta
        </button>
      </div>
    );
  }

  return (
    <>
      <h2 className="label-eyebrow">Tipos de consulta</h2>
      <div className="grid grid-cols-3 gap-2.5">
        {CONSULT_CATEGORIES.map((id) => {
          const Icon = CATEGORY_ICON[id];
          const active = category === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => setCategory(id)}
              aria-pressed={active}
              className={
                "card flex flex-col items-center gap-2 px-2 py-3 text-center " +
                (active ? "border-2 border-area-juridica bg-area-juridica-tint" : "border-area-juridica-border")
              }
            >
              <span
                aria-hidden
                className="grid h-10 w-10 place-items-center rounded-lg bg-area-juridica-tint text-area-juridica"
              >
                <Icon size={20} aria-hidden />
              </span>
              <span className="text-xs font-semibold text-ink-primary">
                {CONSULT_CATEGORY_LABEL[id]}
              </span>
            </button>
          );
        })}
      </div>

      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        maxLength={2000}
        rows={4}
        placeholder="Cuéntanos brevemente qué necesitas. Sin presión, lo lee solo el equipo legal."
        className="card resize-none border-area-juridica-border p-3 text-base text-ink-primary outline-none focus:border-area-juridica"
        aria-label="Detalle de tu consulta"
      />

      {error && (
        <p role="alert" className="text-sm font-semibold text-state-danger">
          {error}
        </p>
      )}

      <button
        type="button"
        className="btn-primary"
        style={{ backgroundColor: "#1B6FC2" }}
        onClick={submit}
        disabled={isPending}
      >
        {isPending ? "Enviando…" : "Solicitar consulta"}
      </button>
    </>
  );
}
