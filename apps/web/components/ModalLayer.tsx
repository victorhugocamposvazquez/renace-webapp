"use client";

import type { ReactNode, RefObject } from "react";
import { useRef } from "react";
import { useModalLayer } from "@/hooks/useModalLayer";
import { Portal } from "./Portal";

type ModalLayerProps = {
  open: boolean;
  onClose: () => void;
  /** Etiqueta accesible del diálogo. */
  ariaLabel: string;
  /** id del título visible (aria-labelledby). */
  labelledBy?: string;
  children: ReactNode;
  /** Clases del overlay (backdrop). */
  overlayClassName?: string;
  /** Clases del panel interior. */
  panelClassName?: string;
  dismissible?: boolean;
  /** Alineación vertical: bottom sheet vs centrado. */
  align?: "bottom" | "center";
  panelRef?: RefObject<HTMLElement | null>;
};

/**
 * Contenedor reutilizable para modales y bottom sheets con a11y unificada.
 */
export function ModalLayer({
  open,
  onClose,
  ariaLabel,
  labelledBy,
  children,
  overlayClassName = "",
  panelClassName = "",
  dismissible = true,
  align = "bottom",
  panelRef: externalPanelRef
}: ModalLayerProps) {
  const internalRef = useRef<HTMLDivElement>(null);
  const panelRef = externalPanelRef ?? internalRef;

  useModalLayer({ open, onClose, dismissible, panelRef });

  if (!open) return null;

  const alignClass =
    align === "center"
      ? "items-center pt-10 sm:items-center"
      : "items-end pb-[calc(env(safe-area-inset-bottom)_+_16px)]";

  return (
    <Portal>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={labelledBy ? undefined : ariaLabel}
        aria-labelledby={labelledBy}
        className={
          "fixed inset-0 z-[100] flex justify-center bg-ink-primary/50 px-4 backdrop-blur-[2px] " +
          alignClass +
          " " +
          overlayClassName
        }
        onClick={(e) => {
          if (dismissible && e.target === e.currentTarget) onClose();
        }}
      >
        <div
          ref={panelRef as RefObject<HTMLDivElement>}
          className={"w-full max-w-[480px] " + panelClassName}
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </div>
      </div>
    </Portal>
  );
}
