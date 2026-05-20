"use client";

import { usePathname } from "next/navigation";

/**
 * Aplica una animación sutil de entrada (.page-enter) cada vez que cambia la
 * ruta. La clave `key={pathname}` fuerza a React a remontar el contenedor con
 * la nueva animación.
 *
 * Si el usuario tiene `prefers-reduced-motion: reduce`, la animación se reduce
 * a una transición casi instantánea por reglas de globals.css.
 */
export function PageTransition({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const pathname = usePathname();
  return (
    <div key={pathname} className={`page-enter ${className ?? ""}`}>
      {children}
    </div>
  );
}
