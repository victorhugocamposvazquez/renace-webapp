"use client";

import { useId, useRef } from "react";
import { IconAlertTriangle, IconCheck, IconX } from "@tabler/icons-react";
import { useModalLayer } from "@/hooks/useModalLayer";
import { Portal } from "./Portal";

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
 * - Focus trap + Escape + bloqueo de scroll vía useModalLayer.
 * - Click en backdrop cancela.
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
  const panelRef = useRef<HTMLDivElement>(null);
  const confirmRef = useRef<HTMLButtonElement>(null);

  useModalLayer({
    open,
    onClose: onCancel,
    dismissible: !busy,
    panelRef
  });

  if (!open) return null;

  const confirmClass =
    tone === "primary"
      ? "btn-primary"
      : tone === "danger"
        ? "btn-primary !bg-state-danger !shadow-none"
        : "btn-primary !bg-ink-primary !shadow-none";

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
    <Portal>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descId : undefined}
        className="fixed inset-0 z-[100] flex items-end justify-center bg-ink-primary/50 px-4 pt-10 backdrop-blur-[2px] animate-[fade-in_180ms_ease-out] sm:items-center"
        style={{
          paddingBottom: "max(env(safe-area-inset-bottom), 16px)"
        }}
        onClick={() => {
          if (!busy) onCancel();
        }}
      >
        <div
          ref={panelRef}
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
              className={confirmClass}
            >
              {busy ? "Procesando…" : confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </Portal>
  );
}
