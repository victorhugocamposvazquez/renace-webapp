"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  IconHeartHandshake,
  IconActivity,
  IconScale,
  IconBriefcase,
  IconUsers,
  IconCheck,
  IconArrowRight,
  IconArrowLeft,
  IconShieldCheck,
  IconCalendarStar,
  IconSparkles,
  IconUserCheck
} from "@tabler/icons-react";
import {
  AREA_IDS,
  AREA_META,
  ONBOARDING_REASONS,
  REASON_META,
  DAILY_PURPOSE,
  type AreaId,
  type OnboardingReason
} from "@renace/core";
import { completeOnboardingAction } from "./actions";

const AREA_ICON: Record<
  AreaId,
  React.ComponentType<{ size?: number; "aria-hidden"?: boolean }>
> = {
  emocional: IconHeartHandshake,
  fisica: IconActivity,
  juridica: IconScale,
  laboral: IconBriefcase,
  comunidad: IconUsers
};

const AREA_COLOR: Record<AreaId, { core: string; tint: string; border: string }> = {
  emocional: { core: "#E14B79", tint: "#FCE9F0", border: "#F6CBDD" },
  fisica: { core: "#1B9E55", tint: "#E6F4EC", border: "#C6E8D2" },
  juridica: { core: "#3C7DC4", tint: "#E7F0F9", border: "#C8DDF1" },
  laboral: { core: "#D99A2B", tint: "#FBF1DC", border: "#F0DCB0" },
  comunidad: { core: "#8167C6", tint: "#EFEAFA", border: "#DCD2F2" }
};

const TOTAL_STEPS = 5;

export function OnboardingFlow({ defaultAlias }: { defaultAlias: string }) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [alias, setAlias] = useState(defaultAlias);
  const [reasons, setReasons] = useState<OnboardingReason[]>([]);
  const [areaFocus, setAreaFocus] = useState<AreaId[]>(["emocional", "fisica"]);
  const [ariaName] = useState("Aria");
  const [ariaPersist, setAriaPersist] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [isPending, startTransition] = useTransition();

  const firstNameLive = alias.trim().split(" ")[0] ?? "";

  // Cuando el onboarding completa con éxito, mostramos la pantalla "done"
  // durante ~2.4s y luego empujamos a /home. El usuario también puede
  // pulsar "Entrar" para acelerar.
  useEffect(() => {
    if (!done) return;
    const t = window.setTimeout(() => {
      router.push("/home?welcome=1");
    }, 2400);
    return () => window.clearTimeout(t);
  }, [done, router]);

  const firstName = firstNameLive;

  function toggleArea(a: AreaId) {
    setAreaFocus((prev) =>
      prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]
    );
  }
  function toggleReason(r: OnboardingReason) {
    setReasons((prev) =>
      prev.includes(r) ? prev.filter((x) => x !== r) : [...prev, r]
    );
  }

  function next() {
    setError(null);
    if (step === 1 && alias.trim().length === 0) {
      setError("Pon un nombre o alias para empezar.");
      return;
    }
    if (step === 3 && reasons.length === 0) {
      setError("Marca al menos uno. No hay respuesta mala.");
      return;
    }
    if (step === 4 && areaFocus.length === 0) {
      setError("Elige al menos un área.");
      return;
    }
    if (step < TOTAL_STEPS) setStep(step + 1);
  }

  function submit() {
    setError(null);
    startTransition(async () => {
      const fd = new FormData();
      fd.set("alias", alias.trim());
      reasons.forEach((r) => fd.append("reasons", r));
      areaFocus.forEach((a) => fd.append("areaFocus", a));
      fd.set("ariaName", ariaName.trim() || "Aria");
      if (ariaPersist) fd.set("ariaPersist", "on");
      const result = await completeOnboardingAction(fd);
      if (result.ok) {
        setDone(true);
      } else {
        setError(result.error);
      }
    });
  }

  // Pantalla final: animación épica antes de mandar al usuario a /home.
  if (done) {
    return (
      <div className="flex min-h-[640px] flex-1 flex-col items-center justify-center gap-6 text-center">
        <div className="relative">
          <span
            aria-hidden
            className="absolute inset-0 animate-ping rounded-full bg-brand-200/80"
          />
          <span
            aria-hidden
            className="relative grid h-24 w-24 place-items-center rounded-full bg-brand-gradient shadow-brand-glow"
          >
            <IconCheck size={48} stroke={3} className="text-ink-inverse" aria-hidden />
          </span>
        </div>

        <div className="flex flex-col items-center gap-2 px-4">
          <p className="label-eyebrow text-accent-600">Listo</p>
          <h1 className="text-3xl font-bold tracking-tight text-ink-primary">
            Tu camino empieza, {firstName || "tú"}.
          </h1>
          <p className="max-w-[28ch] text-base leading-snug text-ink-muted">
            Cada día te propondremos un paso pequeño. Empecemos por el de hoy.
          </p>
        </div>

        <button
          type="button"
          className="btn-primary mt-2 w-full max-w-[320px]"
          onClick={() => router.push("/home?welcome=1")}
        >
          Ver mi día de hoy
          <IconArrowRight size={18} aria-hidden />
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-h-[640px] flex-col gap-6">
      {/* Barra de progreso */}
      <div className="flex items-center gap-2">
        {Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1).map((n) => (
          <div
            key={n}
            className={
              "h-1.5 flex-1 rounded-full transition-colors duration-500 " +
              (n <= step ? "bg-brand-gradient" : "bg-outline-soft")
            }
            aria-hidden
          />
        ))}
      </div>
      <p className="label-eyebrow">
        Paso {step} de {TOTAL_STEPS}
      </p>

      {/* STEP 1 · Nombre */}
      {step === 1 && (
        <section className="flex flex-1 flex-col gap-4 animate-[fade-in_220ms_ease-out]">
          <div className="rounded-2xl bg-brand-50 px-4 py-3">
            <p className="text-sm font-semibold text-brand-800">
              {DAILY_PURPOSE}
            </p>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-ink-primary">
            ¿Cómo quieres que te llamemos?
          </h1>
          <p className="text-base text-ink-muted">
            Puede ser tu nombre, un mote o lo que prefieras. Lo verás solo tú.
          </p>
          <input
            value={alias}
            onChange={(e) => setAlias(e.target.value)}
            maxLength={60}
            className="input"
            aria-label="Tu nombre o alias"
            placeholder="David"
            autoFocus
          />
        </section>
      )}

      {/* STEP 2 · Día 1 / Pacto */}
      {step === 2 && (
        <section className="flex flex-1 flex-col gap-5 animate-[fade-in_220ms_ease-out]">
          <div className="relative -mx-5 overflow-hidden bg-brand-gradient px-5 pb-10 pt-8 text-ink-inverse">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-16 -top-12 h-56 w-56 rounded-full opacity-20"
              style={{
                background:
                  "radial-gradient(circle, #fff 0%, transparent 70%)"
              }}
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -left-12 bottom-0 h-48 w-48 rounded-full opacity-10"
              style={{
                background:
                  "radial-gradient(circle, #fff 0%, transparent 70%)"
              }}
            />
            <span className="relative inline-flex items-center gap-1.5 rounded-full bg-white/20 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider">
              <IconCalendarStar size={12} aria-hidden />
              Día 1
            </span>
            <h1 className="relative mt-4 text-[34px] font-bold leading-[1.05] tracking-tight">
              Hola, {firstName || "tú"}.
              <br />
              Hoy empieza algo nuevo.
            </h1>
            <p className="relative mt-3 max-w-[28ch] text-base leading-snug text-white/85">
              No tienes que tenerlo todo claro. Aquí cuenta cada paso, por pequeño que sea.
            </p>
          </div>

          <ul role="list" className="flex flex-col gap-2.5">
            <PactItem
              icon={IconShieldCheck}
              title="No estás solo"
              body="Te acompañan profesionales, personas que pasaron por esto y una IA disponible 24/7."
            />
            <PactItem
              icon={IconSparkles}
              title="A tu ritmo"
              body="Sin metas imposibles. Pequeños hitos diarios. Lo importante es no parar."
            />
            <PactItem
              icon={IconUserCheck}
              title="Tú decides"
              body="Confidencial. Tus datos son tuyos. Puedes borrar todo cuando quieras."
            />
          </ul>
        </section>
      )}

      {/* STEP 3 · ¿Por qué estás aquí? */}
      {step === 3 && (
        <section className="flex flex-1 flex-col gap-4 animate-[fade-in_220ms_ease-out]">
          <h1 className="text-3xl font-bold tracking-tight text-ink-primary">
            ¿Qué te trae aquí{firstName ? `, ${firstName}` : ""}?
          </h1>
          <p className="text-base text-ink-muted">
            Marca todo lo que te resuene. Esto se guardará como tu primera anotación.
            Podrás volver a ella cuando dudes.
          </p>
          <ul
            role="list"
            className="grid grid-cols-2 gap-2"
            aria-label="Motivos para empezar"
          >
            {ONBOARDING_REASONS.map((id) => {
              const meta = REASON_META[id];
              const selected = reasons.includes(id);
              return (
                <li key={id}>
                  <button
                    type="button"
                    onClick={() => toggleReason(id)}
                    aria-pressed={selected}
                    className={
                      "flex h-full w-full flex-col items-start gap-1.5 rounded-2xl border p-3 text-left transition-all duration-200 active:scale-[0.98] " +
                      (selected
                        ? "border-brand-600 bg-brand-50 shadow-soft"
                        : "border-outline-soft bg-elevated")
                    }
                  >
                    <span
                      className="grid h-10 w-10 place-items-center rounded-xl text-xl"
                      aria-hidden
                      style={
                        selected
                          ? {
                              background:
                                "linear-gradient(135deg, #13924C 0%, #6F4FE8 100%)",
                              color: "#fff"
                            }
                          : { background: "#F4F4F2" }
                      }
                    >
                      {meta.emoji}
                    </span>
                    <span className="text-[13px] font-bold leading-tight text-ink-primary">
                      {meta.label}
                    </span>
                    {selected && (
                      <span className="mt-auto inline-flex items-center gap-1 text-[10px] font-bold text-brand-700">
                        <IconCheck size={11} aria-hidden /> Marcado
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
          {reasons.length > 0 && (
            <p className="text-xs text-ink-subtle">
              {reasons.length} {reasons.length === 1 ? "motivo" : "motivos"} marcados ·
              guardaremos esto como tu primer apunte
            </p>
          )}
        </section>
      )}

      {/* STEP 4 · Áreas */}
      {step === 4 && (
        <section className="flex flex-1 flex-col gap-4 animate-[fade-in_220ms_ease-out]">
          <h1 className="text-3xl font-bold tracking-tight text-ink-primary">
            ¿Por dónde empezamos?
          </h1>
          <p className="text-base text-ink-muted">
            Elige las áreas en las que quieres centrarte ahora. Podrás cambiarlo
            cuando quieras.
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
                      (selected ? "border-2" : "border-outline-soft")
                    }
                    style={
                      selected
                        ? { borderColor: color.core, backgroundColor: color.tint }
                        : undefined
                    }
                  >
                    <div
                      className="grid h-11 w-11 place-items-center rounded-lg"
                      style={{ backgroundColor: color.tint, color: color.core }}
                      aria-hidden
                    >
                      <Icon size={22} aria-hidden />
                    </div>
                    <div className="flex-1">
                      <div className="text-base font-semibold text-ink-primary">
                        {meta.label}
                      </div>
                      <div className="text-sm text-ink-muted">{meta.subtitle}</div>
                    </div>
                    <span
                      className={
                        "grid h-7 w-7 place-items-center rounded-full " +
                        (selected ? "" : "border border-outline-medium")
                      }
                      style={
                        selected
                          ? { backgroundColor: color.core, color: "#fff" }
                          : undefined
                      }
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

      {/* STEP 5 · Apoyo + cierre */}
      {step === 5 && (
        <section className="flex flex-1 flex-col gap-4 animate-[fade-in_220ms_ease-out]">
          <h1 className="text-3xl font-bold tracking-tight text-ink-primary">
            Tu espacio de apoyo
          </h1>
          <p className="text-base text-ink-muted">
            En «Apoyo» hay personas del equipo RENACE listas para escucharte y
            guiarte cuando lo necesites. No estás solo en ningún paso. No sustituye a
            atención sanitaria.
          </p>
          <label className="flex items-start gap-3 rounded-xl border border-outline-soft bg-elevated p-3">
            <input
              type="checkbox"
              checked={ariaPersist}
              onChange={(e) => setAriaPersist(e.target.checked)}
              className="mt-1 h-5 w-5 accent-brand-600"
              aria-label="Guardar tus conversaciones de apoyo"
            />
            <span>
              <span className="block text-base font-semibold text-ink-primary">
                Guardar tus conversaciones
              </span>
              <span className="text-sm text-ink-muted">
                Para que tu equipo recuerde tu contexto. Puedes borrar todo en
                cualquier momento.
              </span>
            </span>
          </label>

          <div className="card-glass mt-2 flex items-center gap-3">
            <span
              aria-hidden
              className="grid h-10 w-10 place-items-center rounded-full bg-brand-100 text-brand-700"
            >
              <IconCheck size={20} stroke={2.4} />
            </span>
            <div className="flex-1">
              <p className="text-sm font-bold text-ink-primary">
                Casi listos, {firstName || "tú"}.
              </p>
              <p className="text-xs text-ink-muted">
                Al continuar, abrimos tu plan personalizado.
              </p>
            </div>
          </div>
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
            <IconArrowLeft size={16} aria-hidden /> Atrás
          </button>
        )}
        {step < TOTAL_STEPS ? (
          <button type="button" className="btn-primary flex-1" onClick={next}>
            {step === 2 ? "Estoy listo, empecemos" : "Continuar"}
            <IconArrowRight size={18} aria-hidden />
          </button>
        ) : (
          <button
            type="button"
            className="btn-primary flex-1"
            onClick={submit}
            disabled={isPending}
          >
            {isPending ? "Preparando tu plan…" : "Empezar mi día 1"}
            <IconArrowRight size={18} aria-hidden />
          </button>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Helpers de UI                                                       */
/* ------------------------------------------------------------------ */

function PactItem({
  icon: Icon,
  title,
  body
}: {
  icon: React.ComponentType<{ size?: number; "aria-hidden"?: boolean; stroke?: number }>;
  title: string;
  body: string;
}) {
  return (
    <li className="flex items-start gap-3 rounded-2xl border border-outline-soft bg-elevated p-3 shadow-soft">
      <span
        aria-hidden
        className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-700"
      >
        <Icon size={20} aria-hidden stroke={2} />
      </span>
      <div className="flex-1">
        <p className="text-sm font-bold text-ink-primary">{title}</p>
        <p className="text-xs leading-snug text-ink-muted">{body}</p>
      </div>
    </li>
  );
}
