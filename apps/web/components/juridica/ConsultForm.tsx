"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  IconCreditCard,
  IconHomeHeart,
  IconFileAlert,
  IconCoin,
  IconFileText,
  IconDots,
  IconScale,
  IconSend
} from "@tabler/icons-react";
import {
  CONSULT_CATEGORIES,
  CONSULT_CATEGORY_LABEL,
  type ConsultCategory
} from "@renace/core";
import { submitConsultRequestAction } from "@/app/(app)/juridica/actions";
import { ConfirmModal } from "@/components/ConfirmModal";

const CATEGORY_ICON: Record<ConsultCategory, React.ComponentType<{ size?: number; "aria-hidden"?: boolean; stroke?: number }>> = {
  debt: IconCreditCard,
  custody: IconHomeHeart,
  complaint: IconFileAlert,
  aid: IconCoin,
  docs: IconFileText,
  other: IconDots
};

export function ConsultForm() {
  const router = useRouter();
  const [category, setCategory] = useState<ConsultCategory>("debt");
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [confirmOpen, setConfirmOpen] = useState(false);

  function openConfirm() {
    setError(null);
    if (body.trim().length < 5) {
      setError("Cuéntanos un poco más");
      return;
    }
    setConfirmOpen(true);
  }

  function submit() {
    startTransition(async () => {
      const fd = new FormData();
      fd.set("category", category);
      fd.set("body", body.trim());
      const result = await submitConsultRequestAction(fd);
      if (!result.ok) {
        setError(result.error);
        setConfirmOpen(false);
      } else {
        setSent(true);
        setBody("");
        setConfirmOpen(false);
        router.refresh();
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
                "card flex flex-col items-center gap-2 px-2 py-3 text-center transition-all duration-200 " +
                (active
                  ? "border-2 border-area-juridica bg-area-juridica-tint shadow-card"
                  : "border-area-juridica-border")
              }
            >
              <span
                aria-hidden
                className="grid h-10 w-10 place-items-center rounded-xl bg-area-juridica-tint text-area-juridica"
              >
                <Icon size={20} aria-hidden stroke={2} />
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
        className="card resize-none border-area-juridica-border p-3 text-base text-ink-primary outline-none transition-shadow focus:border-area-juridica"
        aria-label="Detalle de tu consulta"
      />

      {error && (
        <p
          role="alert"
          className="rounded-xl border border-state-danger/20 bg-state-danger/5 px-3 py-2 text-sm font-semibold text-state-danger"
        >
          {error}
        </p>
      )}

      <button
        type="button"
        onClick={openConfirm}
        disabled={isPending}
        style={{
          background: "linear-gradient(135deg, #4C8FD6 0%, #3C7DC4 100%)",
          boxShadow: "0 12px 32px -8px rgba(37, 99, 235, 0.35)"
        }}
        className="tap-target inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3.5 text-md font-semibold text-ink-inverse transition-transform duration-200 active:scale-[0.98] disabled:opacity-50"
      >
        <IconSend size={18} aria-hidden stroke={2.2} />
        {isPending ? "Enviando…" : "Solicitar consulta"}
      </button>

      <ConfirmModal
        open={confirmOpen}
        onCancel={() => !isPending && setConfirmOpen(false)}
        onConfirm={submit}
        busy={isPending}
        icon={<IconScale size={22} stroke={2.2} aria-hidden />}
        title="Enviar consulta al equipo legal"
        description={
          <>
            <p>
              Vamos a enviar tu consulta de{" "}
              <strong className="font-semibold text-ink-primary">
                {CONSULT_CATEGORY_LABEL[category]}
              </strong>
              . Un abogado del equipo te contactará en menos de 48 horas.
            </p>
            <p className="mt-2 text-ink-subtle">
              Es confidencial — solo lo verá el equipo legal autorizado.
            </p>
          </>
        }
        confirmLabel="Enviar consulta"
        cancelLabel="Revisar antes"
      />
    </>
  );
}
