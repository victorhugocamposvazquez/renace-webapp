"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { IconHeartBroken, IconX } from "@tabler/icons-react";
import type { Trigger } from "@renace/supabase";
import { logCravingAction } from "@/app/(app)/emocional/actions";

export function CravingNowButton({ triggers }: { triggers: Trigger[] }) {
  const [open, setOpen] = useState(false);
  const [intensity, setIntensity] = useState(3);
  const [triggerId, setTriggerId] = useState<string>("");
  const [note, setNote] = useState("");
  const [done, setDone] = useState(false);
  const [isPending, startTransition] = useTransition();

  function submit() {
    startTransition(async () => {
      const fd = new FormData();
      fd.set("intensity", String(intensity));
      if (note.trim()) fd.set("note", note.trim());
      if (triggerId) fd.set("triggerId", triggerId);
      const res = await logCravingAction(fd);
      if (res.ok) {
        setDone(true);
        if (intensity >= 4) {
          window.location.href = "/crisis";
        }
      }
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="btn-secondary w-full border-area-emocional-border bg-area-emocional-tint/50 text-area-emocional-text"
      >
        <IconHeartBroken size={18} aria-hidden />
        Me cuesta ahora
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-ink-primary/40 p-4 pb-[max(env(safe-area-inset-bottom),16px)]"
          role="dialog"
          aria-labelledby="craving-title"
        >
          <div className="w-full max-w-[480px] rounded-[24px] bg-elevated p-5 shadow-lift">
            <div className="mb-3 flex items-center justify-between">
              <h2 id="craving-title" className="text-lg font-bold text-ink-primary">
                Momento difícil
              </h2>
              <button type="button" onClick={() => setOpen(false)} aria-label="Cerrar">
                <IconX size={20} />
              </button>
            </div>
            {done ? (
              <div className="flex flex-col gap-3">
                <p className="text-sm text-ink-secondary">
                  Registrado. Estás haciendo lo correcto al parar y nombrarlo.
                </p>
                <Link href="/crisis" className="btn-primary">
                  Ir a modo apoyo
                </Link>
                <Link href="/aria?intent=breathing" className="btn-secondary text-sm">
                  Respirar con Aria
                </Link>
              </div>
            ) : (
              <>
                <p className="text-sm text-ink-muted">¿Qué intensidad sientes? (1 suave · 5 muy fuerte)</p>
                <div className="mt-3 flex gap-2">
                  {([1, 2, 3, 4, 5] as const).map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setIntensity(n)}
                      aria-pressed={intensity === n}
                      className={
                        "tap-target flex-1 rounded-xl border py-2 text-sm font-bold " +
                        (intensity === n
                          ? "border-area-emocional bg-area-emocional text-ink-inverse"
                          : "border-outline-soft bg-canvas")
                      }
                    >
                      {n}
                    </button>
                  ))}
                </div>
                {triggers.length > 0 && (
                  <label className="mt-4 flex flex-col gap-1 text-sm">
                    <span className="font-semibold text-ink-secondary">¿Qué lo provocó? (opcional)</span>
                    <select
                      value={triggerId}
                      onChange={(e) => setTriggerId(e.target.value)}
                      className="input"
                    >
                      <option value="">Sin especificar</option>
                      {triggers.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.label}
                        </option>
                      ))}
                    </select>
                  </label>
                )}
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  maxLength={500}
                  rows={2}
                  placeholder="Una palabra sobre qué pasa…"
                  className="input mt-3 resize-none"
                />
                <button
                  type="button"
                  className="btn-primary mt-4"
                  onClick={submit}
                  disabled={isPending}
                >
                  {isPending ? "Guardando…" : "Registrar y ver apoyo"}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
