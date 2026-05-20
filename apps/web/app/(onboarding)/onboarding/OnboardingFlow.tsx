"use client";

import { useState, useTransition } from "react";
import {
  IconHeartHandshake,
  IconActivity,
  IconScale,
  IconBriefcase,
  IconUsers,
  IconCheck,
  IconArrowRight
} from "@tabler/icons-react";
import { AREA_IDS, AREA_META, type AreaId } from "@renace/core";
import { completeOnboardingAction } from "./actions";

const AREA_ICON: Record<AreaId, React.ComponentType<{ size?: number; "aria-hidden"?: boolean }>> = {
  emocional: IconHeartHandshake,
  fisica: IconActivity,
  juridica: IconScale,
  laboral: IconBriefcase,
  comunidad: IconUsers
};

const AREA_COLOR: Record<AreaId, { core: string; tint: string; border: string }> = {
  emocional: { core: "#B83A66", tint: "#FCE4EC", border: "#F0CCD9" },
  fisica: { core: "#0F6E56", tint: "#DFF1E8", border: "#C7E4D5" },
  juridica: { core: "#1B6FC2", tint: "#DBE9F7", border: "#BDD4ED" },
  laboral: { core: "#B47119", tint: "#F9E8C9", border: "#E8C97D" },
  comunidad: { core: "#5A4FB8", tint: "#E5E3FA", border: "#C9C5EE" }
};

const TOTAL_STEPS = 3;

export function OnboardingFlow({ defaultAlias }: { defaultAlias: string }) {
  const [step, setStep] = useState(1);
  const [alias, setAlias] = useState(defaultAlias);
  const [areaFocus, setAreaFocus] = useState<AreaId[]>(["emocional", "fisica"]);
  const [ariaName, setAriaName] = useState("Aria");
  const [ariaPersist, setAriaPersist] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function toggleArea(a: AreaId) {
    setAreaFocus((prev) => (prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]));
  }

  function next() {
    setError(null);
    if (step === 1 && alias.trim().length === 0) {
      setError("Pon un nombre o alias para empezar");
      return;
    }
    if (step === 2 && areaFocus.length === 0) {
      setError("Elige al menos un área");
      return;
    }
    if (step < TOTAL_STEPS) setStep(step + 1);
  }

  function submit() {
    setError(null);
    startTransition(async () => {
      const fd = new FormData();
      fd.set("alias", alias.trim());
      areaFocus.forEach((a) => fd.append("areaFocus", a));
      fd.set("ariaName", ariaName.trim() || "Aria");
      if (ariaPersist) fd.set("ariaPersist", "on");
      const result = await completeOnboardingAction(fd);
      if (result && "error" in result) setError(result.error);
    });
  }

  return (
    <div className="flex min-h-[640px] flex-col gap-6">
      <div className="flex items-center gap-2">
        {Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1).map((n) => (
          <div
            key={n}
            className={
              "h-1.5 flex-1 rounded-full " +
              (n <= step ? "bg-brand-600" : "bg-outline-soft")
            }
            aria-hidden
          />
        ))}
      </div>
      <p className="label-eyebrow">Paso {step} de {TOTAL_STEPS}</p>

      {step === 1 && (
        <section className="flex flex-1 flex-col gap-4">
          <h1 className="text-3xl font-bold tracking-tight text-ink-primary">¿Cómo quieres que te llamemos?</h1>
          <p className="text-base text-ink-muted">
            Puede ser tu nombre, un mote o lo que prefieras. Lo verás solo tú.
          </p>
          <input
            value={alias}
            onChange={(e) => setAlias(e.target.value)}
            maxLength={60}
            className="tap-target rounded-lg border border-outline-medium bg-elevated px-4 text-base text-ink-primary outline-none focus:border-brand-600"
            aria-label="Tu nombre o alias"
            placeholder="David"
            autoFocus
          />
        </section>
      )}

      {step === 2 && (
        <section className="flex flex-1 flex-col gap-4">
          <h1 className="text-3xl font-bold tracking-tight text-ink-primary">¿Por dónde empezamos?</h1>
          <p className="text-base text-ink-muted">
            Elige las áreas en las que quieres centrarte ahora. Podrás cambiarlo cuando quieras.
          </p>
          <ul role="list" className="flex flex-col gap-2">
            {AREA_IDS.map((id) => {
              const Icon = AREA_ICON[id];
              const meta = AREA_META[id];
              const color = AREA_COLOR[id];
              const selected = areaFocus.includes(id);
              return (
                <li key={id}>
                  <button
                    type="button"
                    onClick={() => toggleArea(id)}
                    aria-pressed={selected}
                    className={
                      "flex w-full items-center gap-3 rounded-xl border bg-elevated p-3 text-left transition-colors " +
                      (selected
                        ? "border-2"
                        : "border-outline-soft")
                    }
                    style={selected ? { borderColor: color.core, backgroundColor: color.tint } : undefined}
                  >
                    <div
                      className="grid h-11 w-11 place-items-center rounded-lg"
                      style={{ backgroundColor: color.tint, color: color.core }}
                      aria-hidden
                    >
                      <Icon size={22} aria-hidden />
                    </div>
                    <div className="flex-1">
                      <div className="text-base font-semibold text-ink-primary">{meta.label}</div>
                      <div className="text-sm text-ink-muted">{meta.subtitle}</div>
                    </div>
                    <span
                      className={
                        "grid h-7 w-7 place-items-center rounded-full " +
                        (selected ? "" : "border border-outline-medium")
                      }
                      style={selected ? { backgroundColor: color.core, color: "#fff" } : undefined}
                      aria-hidden
                    >
                      {selected ? <IconCheck size={16} aria-hidden /> : null}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {step === 3 && (
        <section className="flex flex-1 flex-col gap-4">
          <h1 className="text-3xl font-bold tracking-tight text-ink-primary">Tu acompañante</h1>
          <p className="text-base text-ink-muted">
            Aria te acompañará cuando lo necesites. Puedes ponerle el nombre que quieras. No es un
            profesional sanitario.
          </p>
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-semibold text-ink-secondary">Nombre</span>
            <input
              value={ariaName}
              onChange={(e) => setAriaName(e.target.value)}
              maxLength={30}
              className="tap-target rounded-lg border border-outline-medium bg-elevated px-4 text-base text-ink-primary outline-none focus:border-brand-600"
              aria-label="Nombre de tu acompañante"
            />
          </label>
          <label className="flex items-start gap-3 rounded-xl border border-outline-soft bg-elevated p-3">
            <input
              type="checkbox"
              checked={ariaPersist}
              onChange={(e) => setAriaPersist(e.target.checked)}
              className="mt-1 h-5 w-5 accent-brand-600"
              aria-label="Guardar conversaciones con Aria"
            />
            <span>
              <span className="block text-base font-semibold text-ink-primary">
                Guardar conversaciones
              </span>
              <span className="text-sm text-ink-muted">
                Para que Aria recuerde tu contexto. Puedes borrar todo en cualquier momento.
              </span>
            </span>
          </label>
        </section>
      )}

      {error && (
        <p role="alert" className="text-sm font-semibold text-state-danger">
          {error}
        </p>
      )}

      <div className="mt-auto flex gap-2">
        {step > 1 && (
          <button
            type="button"
            className="btn-secondary flex-1"
            onClick={() => setStep(step - 1)}
            disabled={isPending}
          >
            Atrás
          </button>
        )}
        {step < TOTAL_STEPS ? (
          <button type="button" className="btn-primary flex-1" onClick={next}>
            Continuar
            <IconArrowRight size={18} aria-hidden className="ml-1 inline" />
          </button>
        ) : (
          <button
            type="button"
            className="btn-primary flex-1"
            onClick={submit}
            disabled={isPending}
          >
            {isPending ? "Preparando…" : "Empezar"}
          </button>
        )}
      </div>
    </div>
  );
}
