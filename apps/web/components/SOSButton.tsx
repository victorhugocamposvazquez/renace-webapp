"use client";

import { useEffect, useState } from "react";
import { IconLifebuoy, IconPhone, IconX } from "@tabler/icons-react";
import type { TrustedContact } from "@renace/supabase";
import { Portal } from "./Portal";

export function SOSButton({ contacts }: { contacts: TrustedContact[] }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        aria-label="Pedir ayuda ahora"
        onClick={() => setOpen(true)}
        className="tap-target inline-flex items-center gap-1.5 rounded-full border border-state-danger/30 bg-state-danger/10 px-3 py-2 text-xs font-bold uppercase tracking-wider text-state-danger"
      >
        <IconLifebuoy size={16} aria-hidden />
        Ayuda
      </button>
      {open && (
        <Portal>
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Contactos de confianza"
            className="fixed inset-0 z-[100] flex items-end justify-center bg-ink-primary/50 px-4 backdrop-blur-[2px] animate-[fade-in_180ms_ease-out] sm:items-center"
            style={{ paddingBottom: "max(env(safe-area-inset-bottom), 16px)", paddingTop: "40px" }}
            onClick={() => setOpen(false)}
          >
            <div
              className="w-full max-w-[460px] origin-bottom rounded-3xl border border-outline-soft bg-elevated p-5 shadow-lift animate-[sheet-in_220ms_cubic-bezier(0.16,1,0.3,1)]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="label-eyebrow text-state-danger">Si lo necesitas</p>
                  <h2 className="mt-1 text-xl font-bold text-ink-primary">Pide ayuda ahora</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Cerrar"
                  className="tap-target -mr-2 -mt-2 grid place-items-center rounded-full text-ink-subtle"
                >
                  <IconX size={20} aria-hidden />
                </button>
              </div>
              <p className="mt-2 text-sm text-ink-muted">
                No estás solo. Hablar con alguien ahora es una decisión valiente.
              </p>
              <div className="mt-4 flex flex-col gap-2">
                <a
                  href="tel:024"
                  style={{
                    background: "linear-gradient(135deg, #F43F5E 0%, #E11D48 100%)",
                    boxShadow: "0 12px 32px -8px rgba(225, 29, 72, 0.4)"
                  }}
                  className="tap-target inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3.5 text-md font-semibold text-ink-inverse transition-transform duration-200 active:scale-[0.98]"
                >
                  <IconPhone size={18} aria-hidden /> 024 · Crisis emocional
                </a>
                {contacts.length === 0 ? (
                  <p className="rounded-lg border border-outline-soft bg-canvas p-3 text-sm text-ink-muted">
                    Aún no has añadido contactos de confianza. Puedes hacerlo desde tu perfil.
                  </p>
                ) : (
                  contacts.map((c) => (
                    <a
                      key={c.id}
                      href={`tel:${c.phone.replace(/\s+/g, "")}`}
                      className="flex items-center gap-3 rounded-xl border border-outline-soft bg-canvas px-3 py-3"
                    >
                      <span
                        className="grid h-10 w-10 place-items-center rounded-full bg-brand-100 text-brand-600"
                        aria-hidden
                      >
                        <IconPhone size={18} />
                      </span>
                      <span className="flex-1">
                        <span className="block text-base font-semibold text-ink-primary">{c.name}</span>
                        <span className="block text-xs text-ink-muted">
                          {c.phone}
                          {c.relation ? ` · ${c.relation}` : ""}
                        </span>
                      </span>
                    </a>
                  ))
                )}
              </div>
            </div>
          </div>
        </Portal>
      )}
    </>
  );
}
