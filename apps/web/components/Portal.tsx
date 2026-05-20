"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

/**
 * Renderiza `children` en `document.body` para evitar que un ancestro con
 * `transform`, `filter`, `overflow:clip` u otra propiedad que crea contexto
 * de apilamiento o containing block rompa el posicionamiento de `fixed`.
 *
 * Es seguro durante SSR: hasta que monta en cliente devuelve null.
 */
export function Portal({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted || typeof document === "undefined") return null;
  return createPortal(children, document.body);
}
