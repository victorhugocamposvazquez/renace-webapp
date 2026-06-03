"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { IconArrowLeft, IconCheck, IconPlayerPlayFilled } from "@tabler/icons-react";
import { logBreathingAction } from "@/app/(app)/home/actions";

type Phase = { key: "in" | "hold" | "out"; label: string; secs: number; scale: number };

const PHASES: Phase[] = [
  { key: "in", label: "Inhala por la nariz", secs: 4, scale: 1 },
  { key: "hold", label: "Mantén el aire", secs: 7, scale: 1 },
  { key: "out", label: "Exhala por la boca", secs: 8, scale: 0.55 }
];

const TARGET_CYCLES = 6; // ~114s de práctica 4-7-8

type Tick = { phaseIndex: number; secondsLeft: number; cyclesDone: number };

const INITIAL: Tick = { phaseIndex: 0, secondsLeft: PHASES[0]!.secs, cyclesDone: 0 };

export function BreathingExercise() {
  const router = useRouter();
  const [running, setRunning] = useState(true);
  const [finished, setFinished] = useState(false);
  const [tick, setTick] = useState<Tick>(INITIAL);
  const loggedRef = useRef(false);

  const phase = PHASES[tick.phaseIndex]!;

  const finish = useCallback((completedCycles: number) => {
    setFinished(true);
    setRunning(false);
    if (loggedRef.current || completedCycles < 1) return;
    loggedRef.current = true;
    const fd = new FormData();
    fd.set("protocol", "4-7-8");
    fd.set("durationSeconds", String(completedCycles * 19));
    void logBreathingAction(fd);
  }, []);

  useEffect(() => {
    if (!running || finished) return;
    const t = window.setInterval(() => {
      setTick((prev) => {
        if (prev.secondsLeft > 1) {
          return { ...prev, secondsLeft: prev.secondsLeft - 1 };
        }
        const isLastPhase = prev.phaseIndex === PHASES.length - 1;
        if (!isLastPhase) {
          const nextIndex = prev.phaseIndex + 1;
          return {
            ...prev,
            phaseIndex: nextIndex,
            secondsLeft: PHASES[nextIndex]!.secs
          };
        }
        // Completa un ciclo (acabamos de exhalar)
        const cyclesDone = prev.cyclesDone + 1;
        if (cyclesDone >= TARGET_CYCLES) {
          finish(cyclesDone);
          return { ...prev, cyclesDone };
        }
        return { phaseIndex: 0, secondsLeft: PHASES[0]!.secs, cyclesDone };
      });
    }, 1000);
    return () => window.clearInterval(t);
  }, [running, finished, finish]);

  if (finished) {
    return (
      <div
        role="status"
        className="flex flex-1 flex-col items-center justify-center gap-4 text-center"
      >
        <span
          aria-hidden
          className="grid h-16 w-16 place-items-center rounded-full bg-brand-gradient text-ink-inverse shadow-brand-glow"
        >
          <IconCheck size={32} stroke={2.4} />
        </span>
        <div>
          <h2 className="text-xl font-bold text-ink-primary">Bien hecho</h2>
          <p className="mt-1 max-w-[28ch] text-sm text-ink-muted">
            Acabas de regalarte unos minutos de calma. Queda registrado en tu día.
          </p>
        </div>
        <div className="mt-2 flex w-full max-w-[320px] flex-col gap-2">
          <button type="button" onClick={() => router.push("/home")} className="btn-primary">
            Volver a mi día
          </button>
          <button
            type="button"
            onClick={() => {
              loggedRef.current = false;
              setTick(INITIAL);
              setFinished(false);
              setRunning(true);
            }}
            className="btn-ghost"
          >
            Repetir
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-8">
      <p className="text-center text-sm font-medium text-ink-muted" aria-live="polite">
        Ciclo {Math.min(tick.cyclesDone + 1, TARGET_CYCLES)} de {TARGET_CYCLES}
      </p>

      <div className="relative grid h-64 w-64 place-items-center">
        <span
          aria-hidden
          className="absolute inset-0 rounded-full bg-brand-gradient opacity-20 motion-safe:transition-transform motion-safe:ease-in-out"
          style={{
            transform: `scale(${running ? phase.scale : 0.55})`,
            transitionDuration: `${phase.secs}s`
          }}
        />
        <span
          aria-hidden
          className="absolute h-40 w-40 rounded-full bg-brand-gradient opacity-90 motion-safe:transition-transform motion-safe:ease-in-out"
          style={{
            transform: `scale(${running ? phase.scale : 0.55})`,
            transitionDuration: `${phase.secs}s`
          }}
        />
        <div className="relative flex flex-col items-center text-ink-inverse">
          <span className="text-5xl font-bold tabular-nums">{tick.secondsLeft}</span>
          <span className="mt-1 text-sm font-semibold">{phase.label}</span>
        </div>
      </div>

      <p className="sr-only" aria-live="assertive">
        {phase.label}, {tick.secondsLeft} segundos
      </p>

      <div className="flex w-full max-w-[320px] flex-col gap-2">
        {running ? (
          <button type="button" onClick={() => setRunning(false)} className="btn-secondary">
            Pausar
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setRunning(true)}
            className="btn-primary inline-flex items-center justify-center gap-2"
          >
            <IconPlayerPlayFilled size={16} aria-hidden />
            Continuar
          </button>
        )}
        <button
          type="button"
          onClick={() => finish(tick.cyclesDone)}
          className="btn-ghost inline-flex items-center justify-center gap-2"
        >
          <IconArrowLeft size={16} aria-hidden />
          {tick.cyclesDone >= 1 ? "Terminar y guardar" : "Salir"}
        </button>
      </div>
    </div>
  );
}
