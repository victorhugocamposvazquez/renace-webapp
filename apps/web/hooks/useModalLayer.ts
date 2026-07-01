"use client";

import { useEffect, useRef } from "react";

type Options = {
  open: boolean;
  onClose: () => void;
  /** Si false, Escape y backdrop no cierran (p. ej. acción en curso). */
  dismissible?: boolean;
  /** Ref del panel interior; se usa para focus trap. */
  panelRef?: React.RefObject<HTMLElement | null>;
};

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Comportamiento compartido de modales/sheets:
 * bloqueo de scroll, Escape, focus trap básico.
 */
export function useModalLayer({
  open,
  onClose,
  dismissible = true,
  panelRef
}: Options) {
  const internalRef = useRef<HTMLElement | null>(null);
  const lastFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;

    lastFocused.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKey(e: KeyboardEvent) {
      if (e.key !== "Escape" || !dismissible) return;
      e.preventDefault();
      onClose();
    }

    function handleTab(e: KeyboardEvent) {
      if (e.key !== "Tab") return;
      const root = panelRef?.current ?? internalRef.current;
      if (!root) return;
      const nodes = Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => !el.hasAttribute("disabled") && el.offsetParent !== null
      );
      if (nodes.length === 0) return;
      const first = nodes[0]!;
      const last = nodes[nodes.length - 1]!;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    window.addEventListener("keydown", handleKey);
    window.addEventListener("keydown", handleTab);

    const timer = window.setTimeout(() => {
      const root = panelRef?.current ?? internalRef.current;
      const first = root?.querySelector<HTMLElement>(FOCUSABLE);
      first?.focus();
    }, 50);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", handleKey);
      window.removeEventListener("keydown", handleTab);
      window.clearTimeout(timer);
      lastFocused.current?.focus?.();
    };
  }, [open, onClose, dismissible, panelRef]);

  return { panelRef: internalRef };
}
