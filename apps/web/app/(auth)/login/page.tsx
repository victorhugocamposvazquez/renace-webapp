import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "./LoginForm";
import { IconShieldLockFilled, IconSparkles } from "@tabler/icons-react";

export const metadata: Metadata = {
  title: "Entrar · RENACE",
  description: "Tu proceso, paso a paso."
};

export default function LoginPage() {
  return (
    <main className="stage relative flex min-h-screen flex-col bg-hero-gradient px-5 pb-10 pt-12">
      {/* Glow decorativo */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-accent-200/40 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 right-0 h-56 w-56 rounded-full bg-brand-200/40 blur-3xl"
      />

      <section className="relative flex flex-col gap-8">
        <header className="flex flex-col items-center gap-4 text-center">
          <div
            className="relative grid h-20 w-20 place-items-center rounded-[28px] bg-brand-gradient text-3xl font-bold text-ink-inverse shadow-brand-glow"
            aria-hidden
          >
            <span className="tracking-tight">R</span>
            <span className="absolute -right-1 -top-1 inline-flex items-center justify-center rounded-full bg-accent-gradient p-1.5 shadow-accent-glow">
              <IconSparkles size={14} stroke={2.4} aria-hidden />
            </span>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <p className="label-eyebrow text-accent-600">Bienvenido</p>
            <h1 className="text-[34px] font-bold leading-[1.05] tracking-tight text-ink-primary">
              RENACE
            </h1>
            <p className="max-w-[22ch] text-base leading-snug text-ink-muted">
              Tu proceso, paso a paso. A tu ritmo, con acompañamiento de verdad.
            </p>
          </div>
        </header>

        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>

        <footer className="mt-auto flex items-center justify-center gap-2 pt-4">
          <IconShieldLockFilled
            size={14}
            className="text-ink-subtle"
            aria-hidden
          />
          <p className="text-[11px] font-medium text-ink-subtle">
            Confidencial · Cifrado de extremo a extremo · Solo tú y profesionales autorizados
          </p>
        </footer>
      </section>
    </main>
  );
}
