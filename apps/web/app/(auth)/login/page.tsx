import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "Entrar · RENACE",
  description: "Entra a tu proceso."
};

export default function LoginPage() {
  return (
    <main className="stage flex flex-col gap-6 px-5 py-10">
      <header className="flex flex-col items-center gap-2 pt-8 text-center">
        <div
          className="grid h-16 w-16 place-items-center rounded-2xl bg-brand-600 text-3xl font-bold text-ink-inverse"
          aria-hidden
        >
          R
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-ink-primary">RENACE</h1>
        <p className="text-base text-ink-muted">Tu proceso, paso a paso.</p>
      </header>
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
