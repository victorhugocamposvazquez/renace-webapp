import type { Metadata } from "next";
import { requireUser } from "@/lib/auth";
import { BackLink } from "@/components/BackLink";
import { BreathingExercise } from "@/components/BreathingExercise";

export const metadata: Metadata = { title: "Respira · RENACE" };

export default async function RespiraPage() {
  // Requiere sesión; el ejercicio registra la actividad al terminar.
  await requireUser();

  return (
    <div className="page-stack min-h-[100dvh] px-5 py-5">
      <BackLink fallbackHref="/home" label="Volver" />

      <header className="mt-2 text-center">
        <p className="label-eyebrow text-brand-700">Respiración 4-7-8</p>
        <h1 className="display-title">Respira conmigo</h1>
        <p className="mt-2 display-subtitle">
          Sigue el círculo: inhala 4, mantén 7, exhala 8. Dos minutos para bajar el ritmo.
        </p>
      </header>

      <BreathingExercise />
    </div>
  );
}
