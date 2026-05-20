"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Hace scroll arriba del todo cada vez que cambia la ruta.
 * Compensa el comportamiento de Next.js App Router cuando navegas
 * entre tabs del bottom nav (mantenía la posición anterior).
 *
 * Soft scroll (con animación) si el usuario no tiene reduced-motion.
 */
export function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    window.scrollTo({ top: 0, left: 0, behavior: prefersReduced ? "auto" : "smooth" });
  }, [pathname]);

  return null;
}
