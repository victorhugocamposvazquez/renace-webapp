"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { IconMessageHeart, IconCompass, IconHeartHandshake, IconX } from "@tabler/icons-react";
import { ModalLayer } from "./ModalLayer";

const SEEN_KEY = "renace_welcome_done";

const STEPS = [
  {
    title: "Tus 5 áreas de vida",
    body: "Arriba ves cinco círculos: lo emocional, físico, legal, laboral y tu red de apoyo. Toca cualquiera para entrar.",
    icon: IconHeartHandshake
  },
  {
    title: "Tu día, paso a paso",
    body: "En \"Mi día\" tienes tu plan: registra cómo estás y haz una pequeña acción. Con eso ya avanzas.",
    icon: IconCompass
  },
  {
    title: "Pide apoyo cuando lo necesites",
    body: "En \"Apoyo\" hay personas del equipo listas para escucharte o guiarte con un ejercicio. Lo tienes siempre en la barra de abajo.",
    icon: IconMessageHeart
  }
];

export function WelcomeTour() {
  const params = useSearchParams();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const seen =
      typeof window !== "undefined" && window.localStorage.getItem(SEEN_KEY) === "1";
    if (params.get("welcome") === "1" || !seen) {
      setOpen(true);
      setStep(0);
    }
  }, [params]);

  function close() {
    setOpen(false);
    try {
      window.localStorage.setItem(SEEN_KEY, "1");
    } catch {
      // localStorage puede no estar disponible; no es crítico.
    }
    if (params.get("welcome") === "1") {
      router.replace("/home", { scroll: false });
    }
  }

  const current = STEPS[step]!;
  const Icon = current.icon;
  const isLast = step === STEPS.length - 1;

  return (
    <ModalLayer
      open={open}
      onClose={close}
      ariaLabel="Bienvenida a RENACE"
      align="center"
      overlayClassName="z-[100] bg-ink-primary/55 backdrop-blur-[2px] pb-[max(env(safe-area-inset-bottom),16px)]"
      panelClassName="rounded-3xl border border-outline-soft bg-elevated p-5 shadow-lift"
    >
      <div className="flex items-start justify-between">
        <p className="label-eyebrow text-brand-700">Bienvenido/a</p>
        <button type="button" onClick={close} aria-label="Cerrar" className="tap-target text-ink-subtle">
          <IconX size={20} aria-hidden />
        </button>
      </div>
      <div className="mt-4 grid h-14 w-14 place-items-center rounded-2xl bg-brand-50 text-brand-700">
        <Icon size={28} aria-hidden />
      </div>
      <h2 className="mt-4 text-xl font-bold text-ink-primary">{current.title}</h2>
      <p className="mt-2 text-sm text-ink-muted">{current.body}</p>
      <div className="mt-4 flex gap-1.5" aria-hidden>
        {STEPS.map((_, i) => (
          <span
            key={i}
            className={`h-1.5 flex-1 rounded-full ${i <= step ? "bg-brand-600" : "bg-outline-soft"}`}
          />
        ))}
      </div>
      <div className="mt-5 flex gap-2">
        {!isLast ? (
          <button type="button" onClick={() => setStep((s) => s + 1)} className="btn-primary flex-1">
            Siguiente
          </button>
        ) : (
          <button type="button" onClick={close} className="btn-primary flex-1">
            Empezar
          </button>
        )}
      </div>
    </ModalLayer>
  );
}
