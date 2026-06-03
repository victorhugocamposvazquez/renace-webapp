"use client";

import { useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  IconCheck,
  IconWalk,
  IconBroadcast,
  IconSchool,
  IconMoon,
  IconPencil,
  IconX
} from "@tabler/icons-react";
import { MOOD_LABELS, type MoodScore } from "@renace/core";
import { logMoodAction } from "@/app/(app)/emocional/actions";

type StepKind = "mood" | "habit" | "live" | "course" | "diary";

type StepDef = {
  kind: StepKind;
  icon: React.ComponentType<{ size?: number; "aria-hidden"?: boolean; stroke?: number }>;
  tag: string;
  tagBg: string;
  tagFg: string;
  title: string;
  body?: string;
  meta?: string;
  when?: string;
  cta: string;
  href: string;
  toast: string;
  /** true si el dato viene del servidor (ánimo / micro-acción ya registrados hoy). */
  serverDone: boolean;
};

export type TodayPathProps = {
  alias: string;
  moodDone: boolean;
  physical:
    | { kind: "live" | "video"; title: string; when?: string; meta: string; href: string }
    | null;
  liveClass: { title: string; when: string; href: string } | null;
  course: { title: string; meta: string; href: string } | null;
};

export function TodayPath({
  alias,
  moodDone,
  physical,
  liveClass,
  course
}: TodayPathProps) {
  const router = useRouter();

  const steps = useMemo<StepDef[]>(() => {
    const list: StepDef[] = [
      {
        kind: "mood",
        icon: IconPencil,
        tag: "Registro",
        tagBg: "#EFEAFA",
        tagFg: "#8167C6",
        title: "Registra cómo estás",
        body: "Un momento para escucharte. ¿Cómo amaneces hoy?",
        cta: "Registrar mi ánimo",
        href: "#mi-animo",
        toast: "Registrado · gracias por escucharte",
        serverDone: moodDone
      },
      {
        kind: "habit",
        icon: IconWalk,
        tag: "Hábito físico",
        tagBg: "#E6F4EC",
        tagFg: "#0E7A3F",
        title: physical ? physical.title : "Muévete 15 minutos hoy",
        when: physical?.when,
        meta: physical ? physical.meta : undefined,
        body: physical
          ? undefined
          : "Un paseo o una rutina suave. El cuerpo arrastra a la mente.",
        cta:
          physical?.kind === "live"
            ? "Guardar mi plaza"
            : physical?.kind === "video"
              ? "Ver el vídeo"
              : "Ir a Física",
        href: physical ? physical.href : "/fisica",
        toast: "¡Bien hecho! Un paso más para tu cuerpo",
        serverDone: false
      }
    ];

    if (liveClass) {
      list.push({
        kind: "live",
        icon: IconBroadcast,
        tag: "En directo",
        tagBg: "#FDEAEC",
        tagFg: "#E8485F",
        title: liveClass.title,
        when: liveClass.when,
        meta: "Con el equipo · te guardamos la plaza",
        cta: "Guardar mi plaza",
        href: liveClass.href,
        toast: "Plaza guardada · te avisaremos antes de empezar",
        serverDone: false
      });
    } else {
      list.push({
        kind: "live",
        icon: IconBroadcast,
        tag: "Calma",
        tagBg: "#FDEAEC",
        tagFg: "#E8485F",
        title: "Respiración guiada, 2 minutos",
        meta: "Baja el ritmo con la guía 4-7-8",
        cta: "Empezar",
        href: "/respira",
        toast: "Date este momento · respira con calma",
        serverDone: false
      });
    }

    list.push({
      kind: "course",
      icon: IconSchool,
      tag: "Formación · 10 min",
      tagBg: "#FCE9F0",
      tagFg: "#E14B79",
      title: course ? course.title : "Avanza con un curso",
      meta: course ? course.meta : "Lecciones cortas y guiadas",
      cta: "Continuar",
      href: course ? course.href : "/cursos",
      toast: "Sigues sumando · 10 minutos cuentan",
      serverDone: false
    });

    list.push({
      kind: "diary",
      icon: IconMoon,
      tag: "Cierra el día",
      tagBg: "#EFEAFA",
      tagFg: "#8167C6",
      title: "Cierra el día con tu diario",
      when: "Esta noche",
      cta: "Escribir mi diario",
      href: "/emocional#diario",
      toast: `Buenas noches, ${alias}. Mañana seguimos`,
      serverDone: false
    });

    return list;
  }, [alias, moodDone, physical, liveClass, course]);

  const [doneState, setDoneState] = useState<boolean[]>(() =>
    steps.map((s) => s.serverDone)
  );

  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [toast, setToast] = useState<{ msg: string; undoIndex: number | null } | null>(
    null
  );
  const [moodOpen, setMoodOpen] = useState(false);
  const [moodPending, startMood] = useTransition();

  function showToast(msg: string, undoIndex: number | null) {
    setToast({ msg, undoIndex });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(
      () => setToast(null),
      undoIndex != null ? 4000 : 2400
    );
  }

  const activeIndex = doneState.indexOf(false);
  const doneCount = doneState.filter(Boolean).length;
  const lastDone = activeIndex === -1 ? steps.length - 1 : activeIndex - 1;
  const allDone = activeIndex === -1;

  function complete(i: number, navigate?: boolean) {
    setDoneState((prev) => {
      if (prev[i]) return prev;
      const next = [...prev];
      next[i] = true;
      return next;
    });
    showToast(steps[i]!.toast, i);
    if (navigate) router.push(steps[i]!.href);
  }

  function undo(i: number) {
    setDoneState((prev) => {
      if (!prev[i]) return prev;
      const next = [...prev];
      next[i] = false;
      return next;
    });
    setToast(null);
  }

  function saveMood(n: MoodScore) {
    startMood(async () => {
      const fd = new FormData();
      fd.set("score", String(n));
      const res = await logMoodAction(fd);
      if (res.ok) {
        setMoodOpen(false);
        const idx = steps.findIndex((s) => s.kind === "mood");
        if (idx >= 0) complete(idx);
      }
    });
  }

  return (
    <section aria-label="Tu camino de hoy">
      <div className="mb-3 flex items-baseline justify-between gap-2 px-1">
        <h2 className="text-base font-bold text-ink-primary">Tu camino de hoy</h2>
        <span className="text-xs font-bold text-brand-700" aria-live="polite">
          {doneCount} de {steps.length}
        </span>
      </div>

      <ol role="list" className="relative">
        {steps.map((step, i) => {
          const isDone = doneState[i];
          const isActive = i === activeIndex;
          const Icon = step.icon;
          const notLast = i < steps.length - 1;

          return (
            <li
              key={step.kind}
              className="relative grid grid-cols-[40px_1fr] gap-3.5 pb-4"
            >
              <div className="relative flex justify-center pt-1">
                <span
                  className={
                    "z-[2] grid h-9 w-9 shrink-0 place-items-center rounded-full border-2 shadow-soft " +
                    (isDone
                      ? "border-brand-600 bg-brand-600 text-ink-inverse"
                      : isActive
                        ? "border-brand-600 bg-elevated text-brand-700 ring-4 ring-brand-100"
                        : "border-outline-medium bg-elevated text-ink-subtle opacity-70")
                  }
                >
                  {isDone ? (
                    <IconCheck size={18} stroke={3} aria-hidden />
                  ) : (
                    <Icon size={18} stroke={2} aria-hidden />
                  )}
                </span>
                {notLast && (
                  <span
                    aria-hidden
                    className={
                      "absolute left-1/2 top-[42px] bottom-[-12px] w-0.5 -translate-x-1/2 " +
                      (isDone ? "bg-brand-600" : "bg-outline-medium")
                    }
                  />
                )}
              </div>

              <div
                className={
                  isActive
                    ? "rounded-2xl border border-brand-100 bg-elevated p-4 shadow-lift"
                    : "rounded-2xl border border-outline-soft bg-transparent px-3.5 py-3"
                }
              >
                {isDone ? (
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-bold text-ink-muted line-through">
                      {step.title}
                    </span>
                    <span className="flex items-center gap-2">
                      {i === lastDone && (
                        <button
                          type="button"
                          onClick={() => undo(i)}
                          className="rounded-full px-2 py-1 text-xs font-bold text-brand-700"
                        >
                          Deshacer
                        </button>
                      )}
                      <span className="text-xs font-bold text-ink-subtle">
                        {step.serverDone ? "Hoy" : "Hecho"}
                      </span>
                    </span>
                  </div>
                ) : isActive ? (
                  <>
                    <span
                      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider"
                      style={{ background: step.tagBg, color: step.tagFg }}
                    >
                      <span
                        aria-hidden
                        className="h-1.5 w-1.5 animate-pulse rounded-full"
                        style={{ background: step.tagFg }}
                      />
                      Ahora · {step.tag}
                    </span>
                    <h3 className="mt-2.5 text-[15px] font-bold leading-snug text-ink-primary">
                      {step.title}
                    </h3>
                    {step.body && (
                      <p className="mt-2 text-[13px] font-medium leading-relaxed text-ink-secondary">
                        {step.body}
                      </p>
                    )}
                    {step.meta && (
                      <p className="mt-1 text-xs font-semibold text-ink-muted">
                        {step.meta}
                        {step.when ? ` · ${step.when}` : ""}
                      </p>
                    )}
                    <div className="mt-4 flex gap-2.5">
                      <button
                        type="button"
                        onClick={() =>
                          step.kind === "mood" ? setMoodOpen(true) : complete(i, true)
                        }
                        className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-brand-600 text-sm font-bold text-ink-inverse shadow-brand-glow transition-transform active:scale-[0.97]"
                      >
                        {step.cta}
                      </button>
                      <button
                        type="button"
                        onClick={() => complete(i)}
                        aria-label="Marcar como hecho"
                        className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-700 transition-transform active:scale-[0.97]"
                      >
                        <IconCheck size={20} stroke={2.4} aria-hidden />
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className="rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider"
                        style={{ background: step.tagBg, color: step.tagFg }}
                      >
                        {step.tag}
                      </span>
                      {step.when && (
                        <span className="text-xs font-bold text-ink-subtle">
                          {step.when}
                        </span>
                      )}
                    </div>
                    <p className="mt-1.5 text-sm font-bold text-ink-secondary">
                      {step.title}
                    </p>
                  </>
                )}
              </div>
            </li>
          );
        })}
      </ol>

      {allDone && (
        <div
          role="status"
          className="mt-1 flex flex-col items-center gap-1.5 rounded-2xl border border-brand-200 bg-brand-50 p-5 text-center"
        >
          <span
            aria-hidden
            className="grid h-11 w-11 place-items-center rounded-full bg-elevated text-brand-600 shadow-soft"
          >
            <IconCheck size={24} stroke={2.4} />
          </span>
          <p className="text-base font-bold text-ink-primary">Has completado tu día</p>
          <p className="text-xs font-medium text-ink-muted">
            Cada paso suma. Mañana seguimos el camino — descansa, te lo has ganado.
          </p>
        </div>
      )}

      {toast && (
        <div
          role="status"
          className="pointer-events-none fixed inset-x-0 bottom-28 z-40 flex justify-center px-6"
        >
          <div className="pointer-events-auto flex items-center gap-3 rounded-full bg-ink-primary px-4 py-2.5 text-sm font-semibold text-ink-inverse shadow-lift">
            <span>{toast.msg}</span>
            {toast.undoIndex != null && (
              <button
                type="button"
                onClick={() => undo(toast.undoIndex!)}
                className="font-bold text-brand-200 underline-offset-2 hover:underline"
              >
                Deshacer
              </button>
            )}
          </div>
        </div>
      )}

      {moodOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-ink-primary/40 p-4 pb-[max(env(safe-area-inset-bottom),16px)]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="path-mood-title"
        >
          <div className="w-full max-w-[480px] rounded-[24px] bg-elevated p-5 shadow-lift animate-[sheet-in_280ms_ease-out]">
            <div className="mb-4 flex items-center justify-between">
              <h2 id="path-mood-title" className="text-lg font-bold text-ink-primary">
                ¿Cómo te sientes?
              </h2>
              <button
                type="button"
                onClick={() => setMoodOpen(false)}
                aria-label="Cerrar"
                className="tap-target grid place-items-center rounded-full text-ink-muted"
              >
                <IconX size={20} aria-hidden />
              </button>
            </div>
            <div className="flex justify-between gap-2">
              {([1, 2, 3, 4, 5] as MoodScore[]).map((n) => (
                <button
                  key={n}
                  type="button"
                  disabled={moodPending}
                  onClick={() => saveMood(n)}
                  aria-label={MOOD_LABELS[n]?.label}
                  className="mood-option mood-option-idle flex-1"
                >
                  <span className="text-[28px]">{MOOD_LABELS[n]?.emoji}</span>
                </button>
              ))}
            </div>
            <p className="mt-3 text-center text-xs font-medium text-ink-muted">
              Se guarda al tocar una cara. No te lleva a ningún sitio.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
