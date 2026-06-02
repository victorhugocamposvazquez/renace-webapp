"use client";

import { useEffect, useState } from "react";
import { IconBroadcast, IconMessage, IconSend2, IconX } from "@tabler/icons-react";
import { Portal } from "@/components/Portal";

type Props = {
  title: string;
  instructorName: string | null;
  accent: string;
  open: boolean;
  onClose: () => void;
};

const DEMO_MESSAGES = [
  { user: "Laura", text: "Hola a todos, gracias por venir 🙏" },
  { user: "Tú", text: "Buenas, encantado/a de estar aquí" },
  { user: "Instructor/a", text: "Empezamos en un minuto. Respira hondo." }
];

export function LiveClassDemoModal({ title, instructorName, accent, open, onClose }: Props) {
  const [seconds, setSeconds] = useState(45);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t = window.setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => {
      document.body.style.overflow = prev;
      window.clearInterval(t);
    };
  }, [open]);

  if (!open) return null;

  return (
    <Portal>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Clase en directo: ${title}`}
        className="fixed inset-0 z-[100] flex flex-col bg-ink-primary"
      >
        <header className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3 text-ink-inverse">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-state-danger px-2 py-0.5 text-[10px] font-bold uppercase">
              <IconBroadcast size={12} aria-hidden /> En vivo · Demo
            </span>
            <span className="text-sm font-semibold truncate">{title}</span>
          </div>
          <button type="button" onClick={onClose} aria-label="Salir" className="tap-target text-white/80">
            <IconX size={22} aria-hidden />
          </button>
        </header>

        <div className="relative flex-1 bg-gradient-to-b from-ink-primary to-[#1a1a2e]">
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center text-ink-inverse">
            <div
              className="grid h-20 w-20 place-items-center rounded-full text-2xl font-bold"
              style={{ background: accent }}
              aria-hidden
            >
              {instructorName?.slice(0, 1) ?? "R"}
            </div>
            <p className="text-lg font-bold">{instructorName ?? "Instructor/a"}</p>
            <p className="text-sm text-white/70">
              Sesión demostrativa · el streaming real se integrará en producción
            </p>
            <p className="mt-2 rounded-full bg-white/10 px-3 py-1 text-xs font-mono">
              {String(Math.floor(seconds / 60)).padStart(2, "0")}:{String(seconds % 60).padStart(2, "0")}
            </p>
          </div>
        </div>

        <div className="max-h-[40%] border-t border-white/10 bg-elevated">
          <div className="flex items-center gap-2 border-b border-outline-soft px-4 py-2">
            <IconMessage size={16} aria-hidden className="text-ink-subtle" />
            <span className="text-xs font-bold text-ink-secondary">Chat del grupo</span>
          </div>
          <ul className="max-h-32 overflow-y-auto px-4 py-2">
            {DEMO_MESSAGES.map((m, i) => (
              <li key={i} className="mb-2 text-sm">
                <span className="font-bold text-ink-primary">{m.user}: </span>
                <span className="text-ink-secondary">{m.text}</span>
              </li>
            ))}
          </ul>
          <div className="flex gap-2 border-t border-outline-soft px-4 py-3">
            <input
              readOnly
              placeholder="Escribe un mensaje… (demo)"
              className="input flex-1 text-sm"
              aria-label="Mensaje de chat"
            />
            <button type="button" className="btn-primary px-3" style={{ background: accent }} aria-label="Enviar">
              <IconSend2 size={16} aria-hidden />
            </button>
          </div>
        </div>
      </div>
    </Portal>
  );
}
