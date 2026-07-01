import type { Metadata } from "next";
import Link from "next/link";
import {
  IconArrowLeft,
  IconPhone,
  IconMessageHeart,
  IconHelpCircle,
  IconVideo,
  IconChevronRight,
  IconUsers
} from "@tabler/icons-react";
import { requireUser } from "@/lib/auth";
import { getProfile, listAriaMessages } from "@renace/supabase";
import { AriaChat } from "./AriaChat";

export const metadata: Metadata = { title: "Apoyo · RENACE" };

type SearchParamsRaw = Promise<Record<string, string | string[] | undefined>>;

const QUICK_HELP = [
  {
    icon: IconMessageHeart,
    title: "Necesito hablar",
    desc: "Con una persona del equipo, ahora",
    tone: "brand" as const,
    href: "/aria?intent=talk#chat"
  },
  {
    icon: IconHelpCircle,
    title: "Tengo una duda",
    desc: "Sobre la plataforma o tu proceso",
    tone: "info" as const,
    href: "/aria?intent=question#chat"
  },
  {
    icon: IconVideo,
    title: "Pedir una videollamada",
    desc: "Cuando el equipo tenga disponibilidad",
    tone: "fis" as const,
    href: "/aria?intent=video#chat"
  }
] as const;

function intentPrompt(intent: string | null): string | null {
  switch (intent) {
    case "talk":
      return "Necesito hablar con alguien del equipo ahora.";
    case "question":
      return "Tengo una duda sobre la plataforma o mi proceso.";
    case "video":
      return "Me gustaría pedir una videollamada con el equipo cuando sea posible.";
    case "breathing":
      return "Me gustaría empezar una respiración 4-7-8, ¿me guías?";
    default:
      return null;
  }
}

export default async function ApoyoPage({
  searchParams
}: {
  searchParams: SearchParamsRaw;
}) {
  const { client, userId } = await requireUser();
  const [profile, history] = await Promise.all([
    getProfile(client, userId),
    listAriaMessages(client, userId, 30)
  ]);
  if (!profile) return null;

  const sp = await searchParams;
  const intent = typeof sp.intent === "string" ? sp.intent : null;

  return (
    <div className="page-stack">
      <header className="px-5 pt-[max(env(safe-area-inset-top),8px)]">
        <Link
          href="/home"
          aria-label="Volver al inicio"
          className="tap-target -ml-1 inline-flex items-center gap-1 text-sm font-semibold text-ink-secondary"
        >
          <IconArrowLeft size={20} aria-hidden /> Inicio
        </Link>
        <p className="label-eyebrow mt-3 text-brand-700">Estamos contigo</p>
        <h1 className="mt-1 text-[30px] font-bold tracking-tight text-ink-primary">Apoyo</h1>
        <p className="mt-2 text-sm leading-relaxed text-ink-muted">
          Personas reales del equipo RENACE, cuando lo necesites. No estás solo en ningún
          paso.
        </p>
      </header>

      <section className="page-inset">
        <div className="rounded-3xl border border-state-danger/20 bg-state-danger/5 p-4">
          <div className="flex items-start gap-3">
            <span
              aria-hidden
              className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-state-danger/10 text-state-danger"
            >
              <IconPhone size={22} stroke={1.8} aria-hidden />
            </span>
            <div className="flex-1">
              <p className="text-sm font-bold text-ink-primary">
                ¿Lo necesitas ahora mismo?
              </p>
              <p className="mt-0.5 text-xs leading-relaxed text-ink-muted">
                La línea <strong>024</strong> atiende las 24 horas en España (gratuita). En
                la app también puedes hablar con el equipo o activar el modo apoyo.
              </p>
            </div>
          </div>
          <div className="mt-3 flex flex-col gap-2">
            <a
              href="tel:024"
              className="flex h-12 items-center justify-center rounded-2xl bg-state-danger text-sm font-bold text-ink-inverse transition-transform active:scale-[0.98]"
            >
              Llamar al 024
            </a>
            <Link
              href="/crisis"
              className="flex h-12 items-center justify-center rounded-2xl border border-state-danger/30 bg-elevated text-sm font-bold text-state-danger transition-transform active:scale-[0.98]"
            >
              Modo apoyo en la app
            </Link>
          </div>
        </div>
      </section>

      <section className="page-inset">
        <p className="label-eyebrow mb-2 text-brand-700">Tu equipo de apoyo</p>
        <div className="card">
          <div className="flex items-center gap-3">
            <span
              aria-hidden
              className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brand-50 text-brand-700"
            >
              <IconUsers size={22} stroke={1.8} aria-hidden />
            </span>
            <div className="flex-1">
              <p className="text-base font-bold text-ink-primary">Equipo RENACE</p>
              <p className="text-xs text-ink-muted">
                Profesionales del programa te acompañan. Si te asignan un referente concreto,
                lo verás aquí.
              </p>
            </div>
          </div>
          <div className="mt-4 flex gap-2.5">
            <Link
              href="#chat"
              className="flex h-12 flex-1 items-center justify-center rounded-2xl bg-brand-600 text-sm font-bold text-ink-inverse transition-transform active:scale-[0.98]"
            >
              Escribir al equipo
            </Link>
            <Link
              href="/crisis"
              className="flex h-12 flex-1 items-center justify-center rounded-2xl bg-brand-50 text-sm font-bold text-brand-700 transition-transform active:scale-[0.98]"
            >
              Urgencia
            </Link>
          </div>
        </div>
      </section>

      <section className="page-inset" id="chat" style={{ scrollMarginTop: "1rem" }}>
        <p className="label-eyebrow mb-2 text-brand-700">Habla con tu equipo</p>
        <AriaChat
          alias={profile.alias}
          initialMessages={history.map((m) => ({
            id: m.id,
            role: m.role,
            content: m.content
          }))}
          initialPrompt={intentPrompt(intent)}
          embedded
        />
      </section>

      <section className="page-inset">
        <p className="label-eyebrow mb-2 text-brand-700">¿Con qué te ayudamos?</p>
        <ul role="list" className="flex flex-col gap-2.5">
          {QUICK_HELP.map((item) => {
            const Icon = item.icon;
            const toneClass =
              item.tone === "brand"
                ? "bg-brand-50 text-brand-700"
                : item.tone === "info"
                  ? "bg-area-juridica-tint text-area-juridica-text"
                  : "bg-area-fisica-tint text-area-fisica-text";
            return (
              <li key={item.title}>
                <Link
                  href={item.href}
                  className="flex items-center gap-3.5 rounded-2xl border border-outline-soft bg-elevated px-4 py-3.5 shadow-soft transition-transform active:scale-[0.99]"
                >
                  <span
                    aria-hidden
                    className={"grid h-11 w-11 shrink-0 place-items-center rounded-xl " + toneClass}
                  >
                    <Icon size={20} stroke={1.8} aria-hidden />
                  </span>
                  <span className="flex-1">
                    <span className="block text-sm font-bold text-ink-primary">
                      {item.title}
                    </span>
                    <span className="block text-xs text-ink-muted">{item.desc}</span>
                  </span>
                  <IconChevronRight size={18} aria-hidden className="text-ink-subtle" />
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
