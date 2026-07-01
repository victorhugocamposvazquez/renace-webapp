"use client";

import { useEffect } from "react";
import { ErrorFallback } from "@/components/ErrorFallback";

/**
 * Captura errores graves que rompen el layout raíz.
 * Renderiza su propio <html>/<body> porque el layout raíz no está disponible.
 */
export default function GlobalError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[global error]", error);
  }, [error]);

  return (
    <html lang="es">
      <body className="min-h-screen bg-canvas font-sans text-ink-primary antialiased">
        <main className="stage mx-auto flex min-h-screen max-w-lg flex-col">
          <ErrorFallback onRetry={() => reset()} showHome showSupport />
        </main>
      </body>
    </html>
  );
}
