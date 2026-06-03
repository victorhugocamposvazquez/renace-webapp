"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { useChat } from "ai/react";
import {
  IconArrowLeft,
  IconSend2,
  IconMessageHeart,
  IconTrash
} from "@tabler/icons-react";
import { ConfirmModal } from "@/components/ConfirmModal";
import { clearAriaHistoryAction } from "@/app/(app)/aria/actions";

type Msg = { id: string; role: "user" | "assistant" | "system"; content: string };

const TEAM_NAME = "Equipo RENACE";

export function AriaChat({
  alias,
  initialMessages,
  initialPrompt,
  embedded = false
}: {
  alias: string;
  initialMessages: Msg[];
  initialPrompt: string | null;
  embedded?: boolean;
}) {
  const aliasFirst = alias.split(" ")[0] ?? alias;

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    setMessages,
    append
  } = useChat({
    api: "/api/chat",
    initialMessages: initialMessages.map((m) => ({
      id: m.id,
      role: m.role,
      content: m.content
    }))
  });

  const sentInitialRef = useRef(false);
  useEffect(() => {
    if (sentInitialRef.current) return;
    if (initialPrompt && initialMessages.length === 0) {
      sentInitialRef.current = true;
      void append({ role: "user", content: initialPrompt });
    }
  }, [initialPrompt, initialMessages.length, append]);

  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const visibleMessages = messages.filter((m) => m.role !== "system");

  const [confirmClear, setConfirmClear] = useState(false);
  const [isClearing, startClear] = useTransition();

  function handleClear() {
    startClear(async () => {
      await clearAriaHistoryAction();
      setMessages([]);
      setConfirmClear(false);
    });
  }

  return (
    <div
      className={
        embedded
          ? "flex h-[460px] flex-col overflow-hidden rounded-3xl border border-outline-soft bg-canvas shadow-card"
          : "flex h-[100dvh] flex-1 flex-col bg-canvas"
      }
    >
      <header className="flex items-center gap-3 border-b border-outline-soft bg-elevated px-4 py-3">
        {!embedded && (
          <Link
            href="/home"
            aria-label="Volver"
            className="tap-target grid place-items-center rounded-full text-ink-secondary"
          >
            <IconArrowLeft size={22} aria-hidden />
          </Link>
        )}
        <div
          aria-hidden
          className="relative grid h-10 w-10 place-items-center rounded-full bg-brand-100 text-brand-600"
        >
          <IconMessageHeart size={20} aria-hidden />
          <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-elevated bg-brand-600" />
        </div>
        <div className="flex-1">
          <p className="text-md font-bold text-ink-primary">{TEAM_NAME}</p>
          <p className="text-xs text-ink-subtle">
            Suele responder en minutos · no es atención sanitaria
          </p>
        </div>
        {messages.length > 0 && (
          <button
            type="button"
            onClick={() => setConfirmClear(true)}
            aria-label="Empezar conversación nueva"
            className="tap-target inline-flex items-center gap-1.5 rounded-full border border-outline-soft bg-elevated px-3 text-xs font-semibold text-ink-secondary shadow-soft transition-colors hover:text-state-danger"
          >
            <IconTrash size={14} aria-hidden stroke={2} /> Nueva
          </button>
        )}
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4">
        {visibleMessages.length === 0 ? (
          <Welcome
            aliasFirst={aliasFirst}
            onSend={(prompt) => void append({ role: "user", content: prompt })}
          />
        ) : (
          <ol role="log" aria-live="polite" className="flex flex-col gap-3">
            {visibleMessages.map((m) => (
              <li
                key={m.id}
                className={
                  m.role === "user"
                    ? "ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-brand-600 px-3 py-2 text-base leading-relaxed text-ink-inverse"
                    : "mr-auto max-w-[90%] rounded-2xl rounded-bl-sm bg-elevated px-3 py-2 text-base leading-relaxed text-ink-primary"
                }
              >
                {typeof m.content === "string" ? m.content : JSON.stringify(m.content)}
              </li>
            ))}
            {isLoading && (
              <li className="mr-auto rounded-2xl bg-elevated px-3 py-2 text-base text-ink-muted">
                <span className="inline-flex gap-1" aria-label="El equipo está escribiendo">
                  <span className="dot">•</span>
                  <span className="dot">•</span>
                  <span className="dot">•</span>
                </span>
              </li>
            )}
          </ol>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className={
          "flex gap-2 border-t border-outline-soft bg-elevated px-4 pt-3 " +
          (embedded ? "pb-3" : "pb-[max(env(safe-area-inset-bottom),12px)]")
        }
      >
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="Escribe a tu equipo…"
          className="tap-target flex-1 rounded-full border border-outline-medium bg-canvas px-4 text-base text-ink-primary outline-none focus:border-brand-600"
          aria-label="Tu mensaje"
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          aria-label="Enviar"
          className="tap-target grid place-items-center rounded-full bg-brand-600 px-4 text-ink-inverse disabled:opacity-50"
        >
          <IconSend2 size={20} aria-hidden />
        </button>
      </form>

      <ConfirmModal
        open={confirmClear}
        onCancel={() => !isClearing && setConfirmClear(false)}
        onConfirm={handleClear}
        busy={isClearing}
        tone="danger"
        icon={<IconTrash size={22} stroke={2.2} aria-hidden />}
        title="¿Empezar una conversación nueva?"
        description={
          <>
            <p>
              Vamos a borrar el historial de esta conversación. Tus datos del diario,
              ánimo y áreas <strong>no se ven afectados</strong>.
            </p>
            <p className="mt-2 text-ink-subtle">
              Sirve para empezar de cero si quieres cambiar de tema o ya no necesitas
              recordar lo hablado.
            </p>
          </>
        }
        confirmLabel="Sí, empezar nueva"
        cancelLabel="Mantener conversación"
      />
    </div>
  );
}

function Welcome({
  aliasFirst,
  onSend
}: {
  aliasFirst: string;
  onSend: (prompt: string) => void;
}) {
  return (
    <div
      role="region"
      aria-label="Bienvenida de tu equipo de apoyo"
      aria-live="polite"
      className="flex h-full flex-col items-center justify-center gap-4 text-center"
    >
      <div
        aria-hidden
        className="grid h-16 w-16 place-items-center rounded-2xl bg-brand-100 text-brand-600"
      >
        <IconMessageHeart size={32} aria-hidden />
      </div>
      <div>
        <h2 className="text-xl font-bold text-ink-primary">Hola {aliasFirst}</h2>
        <p className="mt-1 text-base text-ink-muted">
          Estamos aquí, sin juicios. Cuéntanos cómo estás o elige por dónde empezar.
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-2 px-4">
        {SUGGESTIONS.map((s) => (
          <SuggestionPill key={s.id} label={s.label} prompt={s.prompt} onSend={onSend} />
        ))}
      </div>
    </div>
  );
}

const SUGGESTIONS = [
  { id: "respira", label: "Hagamos respiración", prompt: "Me gustaría hacer una respiración guiada de dos minutos." },
  { id: "ansiedad", label: "Tengo ansiedad", prompt: "Estoy sintiendo ansiedad alta ahora mismo." },
  { id: "balance", label: "Balance del día", prompt: "Ayúdame a hacer un balance breve de mi día." },
  { id: "diario", label: "Anotar en el diario", prompt: "Quiero apuntar algo en mi diario, ¿me ayudas a ordenarlo?" }
];

function SuggestionPill({
  label,
  prompt,
  onSend
}: {
  label: string;
  prompt: string;
  onSend: (prompt: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSend(prompt)}
      className="tap-target inline-flex min-h-[44px] items-center rounded-full border border-outline-medium bg-elevated px-4 text-sm font-semibold text-ink-secondary transition-transform active:scale-95"
    >
      {label}
    </button>
  );
}
