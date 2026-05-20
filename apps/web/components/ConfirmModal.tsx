"use client";

import { useEffect, useId, useRef } from "react";
import { IconAlertTriangle, IconCheck, IconX } from "@tabler/icons-react";

export type ConfirmModalTone = "default" | "primary" | "danger";

export type ConfirmModalProps = {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  title: string;
  description?: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: ConfirmModalTone;
  busy?: boolean;
  icon?: React.ReactNode;
};

/**
 * Bottom-sheet modal de confirmación reutilizable.
 *
 * - Foco trapeado en el primer botón al abrir.
 * - ESC para cancelar; click en backdrop también cancela.
 * - Bloquea el scroll del body cuando está abierto.
 * - `tone` cambia el color del botón principal (primary = brand, danger = rojo).
 */
export function ConfirmModal({
  open,
  onCancel,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  tone = "primary",
  busy = false,
  icon
}: ConfirmModalProps) {
  const titleId = useId();
  const descId = useId();
  const confirmRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape" && !busy) onCancel();
    }
    window.addEventListener("keydown", handleKey);

    const timer = window.setTimeout(() => {
      confirmRef.current?.focus();
    }, 50);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", handleKey);
      window.clearTimeout(timer);
    };
  }, [open, onCancel, busy]);

  if (!open) return null;

  const confirmTone =
    tone === "danger"
      ? {
          background: "linear-gradient(135deg, #F43F5E 0%, #E11D48 100%)",
          boxShadow: "0 12px 32px -8px rgba(225, 29, 72, 0.4)"
        }
      : tone === "primary"
      ? undefined
      : { background: "#0A0A0A" };

  const confirmClass =
    tone === "primary" ? "btn-primary" : "btn-primary !shadow-none";

  const defaultIcon =
    tone === "danger" ? (
      <IconAlertTriangle size={22} stroke={2.2} aria-hidden />
    ) : (
      <IconCheck size={22} stroke={2.4} aria-hidden />
    );

  const iconColor =
    tone === "danger"
      ? "bg-state-danger/10 text-state-danger"
      : "bg-brand-100 text-brand-700";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={description ? descId : undefined}
      className="fixed inset-0 z-[60] flex items-end justify-center bg-ink-primary/40 px-4 pb-4 pt-10 animate-[fade-in_180ms_ease-out] sm:items-center"
      onClick={() => {
        if (!busy) onCancel();
      }}
    >
      <div
        className="w-full max-w-[460px] origin-bottom rounded-3xl border border-outline-soft bg-elevated p-6 shadow-lift animate-[sheet-in_220ms_cubic-bezier(0.16,1,0.3,1)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-4">
          <span
            aria-hidden
            className={`grid h-11 w-11 shrink-0 place-items-center rounded-full ${iconColor}`}
          >
            {icon ?? defaultIcon}
          </span>
          <div className="flex-1">
            <h2 id={titleId} className="text-lg font-bold tracking-tight text-ink-primary">
              {title}
            </h2>
            {description && (
              <div id={descId} className="mt-1.5 text-sm leading-relaxed text-ink-muted">
                {description}
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={onCancel}
            aria-label="Cerrar"
            disabled={busy}
            className="tap-target -mr-2 -mt-2 grid place-items-center rounded-full text-ink-subtle transition-colors hover:text-ink-primary"
          >
            <IconX size={20} aria-hidden />
          </button>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={busy}
            className="btn-secondary"
          >
            {cancelLabel}
          </button>
          <button
            ref={confirmRef}
            type="button"
            onClick={onConfirm}
            disabled={busy}
            style={confirmTone}
            className={confirmClass}
          >
            {busy ? "Procesando…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
