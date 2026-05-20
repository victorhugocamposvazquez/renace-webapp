"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

/**
 * Barra de progreso fina en la parte superior cuando el usuario navega entre
 * rutas. Aporta sensación de "app nativa": feedback inmediato al pulsar un
 * Link aunque la pantalla destino tarde un poco en hidratarse.
 *
 * Estados:
 * - idle: invisible.
 * - loading: visible, anima un crecimiento "fake" hasta ~75%.
 * - done: salta a 100% y se desvanece (se dispara cuando cambia pathname).
 */
export function TopLoader() {
  const pathname = usePathname();
  const search = useSearchParams();
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");
  const doneTimeoutRef = useRef<number | null>(null);
  const lastKeyRef = useRef<string>(`${pathname}?${search?.toString() ?? ""}`);

  // Cuando cambia la URL → marca como done y oculta tras la animación.
  useEffect(() => {
    const key = `${pathname}?${search?.toString() ?? ""}`;
    if (key === lastKeyRef.current) return;
    lastKeyRef.current = key;
    setState("done");
    if (doneTimeoutRef.current) window.clearTimeout(doneTimeoutRef.current);
    doneTimeoutRef.current = window.setTimeout(() => setState("idle"), 360);
    return () => {
      if (doneTimeoutRef.current) window.clearTimeout(doneTimeoutRef.current);
    };
  }, [pathname, search]);

  // Detecta clicks en anchors internos para empezar a cargar inmediatamente.
  useEffect(() => {
    function start() {
      setState("loading");
    }
    function onClick(e: MouseEvent) {
      if (e.defaultPrevented) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
      const target = (e.target as HTMLElement | null)?.closest("a");
      if (!target) return;
      const href = target.getAttribute("href");
      if (!href) return;
      // Ignorar anchors externos, mailto, tel, hash, downloads.
      if (
        href.startsWith("http") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        href.startsWith("#") ||
        target.getAttribute("target") === "_blank" ||
        target.hasAttribute("download")
      ) {
        return;
      }
      // Si el href es la ruta actual, no hay navegación.
      const current = window.location.pathname + window.location.search;
      if (href === current) return;
      start();
    }
    document.addEventListener("click", onClick, { capture: true });
    return () => {
      document.removeEventListener("click", onClick, { capture: true });
    };
  }, []);

  return (
    <div
      className="top-loader"
      role="progressbar"
      aria-hidden
      data-state={state === "idle" ? undefined : state}
    />
  );
}
