"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/**
 * Hace scroll arriba del todo cada vez que cambia la ruta.
 *
 * Comportamiento "app nativa": salto instantáneo, sin animación de smooth scroll
 * (las apps móviles también saltan al top sin animar al cambiar de tab).
 * Esto da sensación de respuesta inmediata.
 */
export function ScrollToTop() {
  const pathname = usePathname();
  const isFirstRun = useRef(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    // Ignora el primer render para no romper el scroll restoration al recargar.
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  return null;
}
