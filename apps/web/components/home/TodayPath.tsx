"use client";

import { useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  IconCheck,
  IconBroadcast,
  IconSchool,
  IconMoon,
  IconPencil,
  IconWind,
  IconWalk,
  IconX
} from "@tabler/icons-react";
import { MOOD_LABELS, type MoodScore, type DailyAction } from "@renace/core";
import { AREA_THEMES } from "@renace/tokens";
import { useModalLayer } from "@/hooks/useModalLayer";
import { logMoodAction } from "@/app/(app)/emocional/actions";

type StepKind = "checkin" | "action" | "closing";

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
  done: boolean;
};

export type TodayPathProps = {
  moodDone: boolean;
  action: DailyAction;
  actionDone: boolean;
  diaryDone: boolean;
};

const TAG = {
  checkin: { bg: AREA_THEMES.emocional.tint, fg: AREA_THEMES.emocional.text },
  action: { bg: AREA_THEMES.fisica.tint, fg: AREA_THEMES.fisica.text },
  closing: { bg: AREA_THEMES.comunidad.tint, fg: AREA_THEMES.comunidad.text }
} as const;

const ACTION_ICON: Record<
  DailyAction["kind"],
  React.ComponentType<{ size?: number; "aria-hidden"?: boolean; stroke?: number }>
> = {
  breathing: IconWind,
  course: IconSchool,
  physical_live: IconBroadcast,
  physical_video: IconWalk
};

const ACTION_TAG: Record<DailyAction["kind"], string> = {
  breathing: "Calma · 2 min",
  course: "Formación · 10 min",
  physical_live: "En directo",
  physical_video: "Cuerpo"
};

export function TodayPath({ moodDone, action, actionDone, diaryDone }: TodayPathProps) {
  const router = useRouter();
  const sheetRef = useRef<HTMLDivElement>(null);

  const steps = useMemo<StepDef[]>(() => {
    return [
      {
        kind: "checkin",
        icon: IconPencil,
        tag: "Cómo estás",
        tagBg: TAG.checkin.bg,
        tagFg: TAG.checkin.fg,
        title: "Registra cómo estás",
        body: "Un momento para escucharte. ¿Cómo amaneces hoy?",
        cta: "Registrar mi ánimo",
        href: "#mi-animo",
        done: moodDone
      },
      {
        kind: "action",
        icon: ACTION_ICON[action.kind],
        tag: ACTION_TAG[action.kind],
        tagBg: TAG.action.bg,
        tagFg: TAG.action.fg,
        title: action.title,
        body: action.body,
        meta: action.meta,
        when: action.when,
        cta: action.cta,
        href: action.href,
        done: actionDone
      },
      {
        kind: "closing",
        icon: IconMoon,
        tag: "Cierra el día",
        tagBg: TAG.closing.bg,
        tagFg: TAG.closing.fg,
        title: "Cierra el día con tu diario",
        when: "Esta noche",
        cta: "Escribir mi diario",
        href: "/emocional#diario",
        done: diaryDone
      }
    ];
  }, [moodDone, action, actionDone, diaryDone]);

  const doneState = steps.map((s) => s.done);
  const activeIndex = doneState.indexOf(false);
  const doneCount = doneState.filter(Boolean).length;
  const allDone = activeIndex === -1;

  const [moodOpen, setMoodOpen] = useState(false);
  const [moodScore, setMoodScore] = useState<MoodScore | null>(null);
  const [moodNote, setMoodNote] = useState("");
  const [moodPending, startMood] = useTransition();
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function showToast(msg: string) {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2400);
  }

  function openMoodSheet() {
    setMoodScore(null);
    setMoodNote("");
    setMoodOpen(true);
  }

  function closeMoodSheet() {
    if (moodPending) return;
    setMoodOpen(false);
  }

  function saveMood() {
    if (moodScore == null) return;
    const note = moodNote.trim();
    startMood(async () => {
      const fd = new FormData();
      fd.set("score", String(moodScore));
      if (note) fd.set("note", note);
      const res = await logMoodAction(fd);
      if (res.ok) {
        setMoodOpen(false);
        setMoodNote("");
        showToast("Registrado · gracias por escucharte");
        router.refresh();
      }
    });
  }

  function goToStep(step: StepDef) {
    if (step.kind === "checkin") {
      openMoodSheet();
      return;
    }
    router.push(step.href);
  }

  useModalLayer({
    open: moodOpen,
    onClose: closeMoodSheet,
    dismissible: !moodPending,
    panelRef: sheetRef
  });

  return (
    <section aria-label="Tu día de hoy">
      <div className="mb-3 flex items-baseline justify-between gap-2 px-1">
        <h2 className="text-base font-bold text-ink-primary">Tu día de hoy</h2>
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
                        : "border-outline-medium bg-elevated text-ink-muted")
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
                    <span className="text-xs font-bold text-ink-subtle">Hoy</span>
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
                    <button
                      type="button"
                      onClick={() => goToStep(step)}
                      className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand-600 text-sm font-bold text-ink-inverse shadow-brand-glow transition-transform active:scale-[0.97]"
                    >
                      {step.cta}
                    </button>
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
            Cada paso suma. Mañana seguimos — descansa, te lo has ganado.
          </p>
        </div>
      )}

      {toast && (
        <div
          role="status"
          className="pointer-events-none fixed inset-x-0 bottom-28 z-40 flex justify-center px-6"
        >
          <div className="rounded-full bg-ink-primary px-4 py-2.5 text-sm font-semibold text-ink-inverse shadow-lift">
            {toast}
          </div>
        </div>
      )}

      {moodOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-ink-primary/40 p-4 pb-[calc(env(safe-area-inset-bottom)_+_88px)]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="path-mood-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeMoodSheet();
          }}
        >
          <div
            ref={sheetRef}
            className="max-h-[80dvh] w-full max-w-[480px] overflow-y-auto overscroll-contain rounded-[24px] bg-elevated p-5 shadow-lift animate-[sheet-in_280ms_ease-out]"
          >
            <div className="mb-1 flex items-center justify-between">
              <h2 id="path-mood-title" className="text-lg font-bold text-ink-primary">
                ¿Cómo te sientes?
              </h2>
              <button
                type="button"
                onClick={closeMoodSheet}
                aria-label="Cerrar"
                className="tap-target grid place-items-center rounded-full text-ink-muted"
              >
                <IconX size={20} aria-hidden />
              </button>
            </div>
            <p className="mb-4 text-sm text-ink-muted">
              Elige el estado que más se acerca. Puedes añadir una nota si quieres.
            </p>

            <div className="flex flex-col gap-2">
              {([1, 2, 3, 4, 5] as MoodScore[]).map((n) => {
                const selected = moodScore === n;
                return (
                  <button
                    key={n}
                    type="button"
                    disabled={moodPending}
                    onClick={() => setMoodScore(n)}
                    aria-pressed={selected}
                    className={
                      "flex items-center gap-3 rounded-2xl border px-3.5 py-3 text-left transition-all active:scale-[0.99] " +
                      (selected
                        ? "border-area-emocional bg-area-emocional-tint"
                        : "border-outline-soft bg-canvas hover:border-outline-medium")
                    }
                  >
                    <span className="text-[26px]" aria-hidden>
                      {MOOD_LABELS[n]?.emoji}
                    </span>
                    <span
                      className={
                        "text-[15px] font-bold " +
                        (selected ? "text-area-emocional-text" : "text-ink-primary")
                      }
                    >
                      {MOOD_LABELS[n]?.label}
                    </span>
                    {selected && (
                      <IconCheck
                        size={18}
                        stroke={2.4}
                        aria-hidden
                        className="ml-auto text-area-emocional-text"
                      />
                    )}
                  </button>
                );
              })}
            </div>

            <label htmlFor="path-mood-note" className="sr-only">
              Nota sobre cómo te sientes
            </label>
            <textarea
              id="path-mood-note"
              value={moodNote}
              onChange={(e) => setMoodNote(e.target.value)}
              maxLength={280}
              rows={2}
              placeholder="¿Quieres añadir algo? (opcional)"
              className="mt-3 w-full resize-none rounded-2xl border border-outline-soft bg-canvas p-3 text-base text-ink-primary outline-none transition-colors focus:border-area-emocional"
            />

            <button
              type="button"
              onClick={saveMood}
              disabled={moodScore == null || moodPending}
              className="btn-primary mt-3 disabled:opacity-50"
            >
              {moodPending ? "Guardando…" : "Guardar mi ánimo"}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
