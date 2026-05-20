"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { IconArrowLeft } from "@tabler/icons-react";

/**
 * Botón "volver" contextual.
 *
 * Comportamiento:
 * - Si el usuario llegó a esta pantalla navegando dentro de la app
 *   (`window.history.length > 1`), hace `router.back()` → vuelve a la pantalla
 *   anterior real (lo que el usuario espera).
 * - Si entró directo a la URL (refresh, deep link, primera carga), navega al
 *   `fallbackHref` (por defecto `/home`).
 *
 * Pasa `fallbackHref` para que tenga sentido cuando no hay historial.
 */
export function BackLink({
  fallbackHref = "/home",
  label = "Volver"
}: {
  fallbackHref?: string;
  label?: string;
}) {
  const router = useRouter();

  function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    if (typeof window === "undefined") return;
    // Solo capturamos clicks "normales" — dejamos pasar middle click, cmd+click, etc.
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;
    if (window.history.length > 1) {
      e.preventDefault();
      router.back();
    }
  }

  return (
    <Link
      href={fallbackHref}
      onClick={handleClick}
      className="tap-target inline-flex items-center gap-1.5 self-start rounded-full border border-outline-soft bg-elevated px-3.5 py-2 text-sm font-semibold text-ink-secondary shadow-soft transition-transform duration-200 hover:text-ink-primary active:scale-[0.97]"
    >
      <IconArrowLeft size={16} aria-hidden stroke={2} /> {label}
    </Link>
  );
}
