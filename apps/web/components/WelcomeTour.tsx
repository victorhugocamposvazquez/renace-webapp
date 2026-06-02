"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { IconSparkles, IconCompass, IconHeartHandshake, IconX } from "@tabler/icons-react";
import { Portal } from "./Portal";

const STEPS = [
  {
    title: "Tu círculo 360",
    body: "Cada área refleja tu avance real. Toca una burbuja para profundizar en emocional, laboral, física y más.",
    icon: IconHeartHandshake
  },
  {
    title: "Tus cursos",
    body: "Formación práctica con lecciones guiadas. Empieza por Respiración 4-7-8 o Alfabetización digital.",
    icon: IconCompass
  },
  {
    title: "Habla con Aria",
    body: "Tu acompañante conoce tu ánimo y puede registrar cómo te sientes. Pruébala desde la pestaña Aria.",
    icon: IconSparkles
  }
];

export function WelcomeTour() {
  const params = useSearchParams();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (params.get("welcome") === "1") {
      setOpen(true);
      setStep(0);
    }
  }, [params]);

  function close() {
    setOpen(false);
    router.replace("/home", { scroll: false });
  }

  if (!open) return null;

  const current = STEPS[step]!;
  const Icon = current.icon;
  const isLast = step === STEPS.length - 1;

  return (
    <Portal>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Bienvenida a RENACE"
        className="fixed inset-0 z-[100] flex items-end justify-center bg-ink-primary/55 px-4 backdrop-blur-[2px] sm:items-center"
        style={{ paddingBottom: "max(env(safe-area-inset-bottom), 16px)" }}
      >
        <div className="w-full max-w-[460px] rounded-3xl border border-outline-soft bg-elevated p-5 shadow-lift">
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
        </div>
      </div>
    </Portal>
  );
}
