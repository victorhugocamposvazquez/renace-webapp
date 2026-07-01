"use client";

import Link from "next/link";
import { IconRefresh, IconHome, IconLifebuoy } from "@tabler/icons-react";

type Props = {
  title?: string;
  message?: string;
  onRetry?: () => void;
  showHome?: boolean;
  showSupport?: boolean;
};

/**
 * UI de error reutilizable: sin mensajes técnicos ni digest de Next.js.
 */
export function ErrorFallback({
  title = "Algo no ha ido bien",
  message = "Ha ocurrido un problema al cargar esta pantalla. Puedes intentarlo de nuevo o volver al inicio.",
  onRetry,
  showHome = true,
  showSupport = true
}: Props) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 text-center">
      <span
        aria-hidden
        className="grid h-16 w-16 place-items-center rounded-2xl bg-brand-50 text-brand-700"
      >
        <IconLifebuoy size={32} stroke={1.8} />
      </span>
      <h1 className="mt-5 text-xl font-bold text-ink-primary">{title}</h1>
      <p className="mt-2 max-w-[32ch] text-sm leading-relaxed text-ink-muted">{message}</p>
      <div className="mt-6 flex w-full max-w-xs flex-col gap-2.5">
        {onRetry && (
          <button type="button" onClick={onRetry} className="btn-primary inline-flex items-center justify-center gap-2">
            <IconRefresh size={18} aria-hidden />
            Reintentar
          </button>
        )}
        {showHome && (
          <Link href="/home" className="btn-secondary inline-flex items-center justify-center gap-2">
            <IconHome size={18} aria-hidden />
            Ir al inicio
          </Link>
        )}
        {showSupport && (
          <Link
            href="/crisis"
            className="text-sm font-semibold text-brand-700 underline-offset-2 hover:underline"
          >
            Necesito apoyo ahora
          </Link>
        )}
      </div>
    </div>
  );
}
