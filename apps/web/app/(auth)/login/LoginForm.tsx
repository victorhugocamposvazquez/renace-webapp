"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";

type Mode = "magic" | "password" | "signup";

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const redirectTo = params.get("redirectTo") ?? "/home";

  const [mode, setMode] = useState<Mode>("magic");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const supabase = getSupabaseBrowserClient();
      try {
        if (mode === "magic") {
          const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
              emailRedirectTo: `${window.location.origin}/auth/callback?redirectTo=${encodeURIComponent(
                redirectTo
              )}`
            }
          });
          if (error) throw error;
          setSent(true);
        } else if (mode === "password") {
          const { error } = await supabase.auth.signInWithPassword({ email, password });
          if (error) throw error;
          router.replace(redirectTo);
          router.refresh();
        } else {
          const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              emailRedirectTo: `${window.location.origin}/auth/callback?redirectTo=${encodeURIComponent(
                redirectTo
              )}`
            }
          });
          if (error) throw error;
          setSent(true);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Algo ha fallado");
      }
    });
  }

  if (sent) {
    return (
      <div className="card text-center" role="status">
        <h2 className="text-xl font-semibold text-ink-primary">Revisa tu correo</h2>
        <p className="mt-2 text-base text-ink-muted">
          Te hemos enviado un enlace a <strong>{email}</strong>. Ábrelo desde el mismo móvil para
          entrar.
        </p>
      </div>
    );
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <div role="tablist" aria-label="Tipo de acceso" className="flex gap-2">
        <ModeTab id="magic" current={mode} onSelect={setMode}>Magic link</ModeTab>
        <ModeTab id="password" current={mode} onSelect={setMode}>Contraseña</ModeTab>
        <ModeTab id="signup" current={mode} onSelect={setMode}>Crear cuenta</ModeTab>
      </div>

      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-semibold text-ink-secondary">Email</span>
        <input
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          className="tap-target rounded-lg border border-outline-medium bg-elevated px-4 text-base text-ink-primary outline-none focus:border-brand-600"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-label="Correo electrónico"
        />
      </label>

      {(mode === "password" || mode === "signup") && (
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-semibold text-ink-secondary">Contraseña</span>
          <input
            type="password"
            autoComplete={mode === "signup" ? "new-password" : "current-password"}
            required
            minLength={8}
            className="tap-target rounded-lg border border-outline-medium bg-elevated px-4 text-base text-ink-primary outline-none focus:border-brand-600"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-label="Contraseña"
          />
        </label>
      )}

      {error && (
        <p role="alert" className="text-sm font-semibold text-state-danger">
          {error}
        </p>
      )}

      <button type="submit" className="btn-primary" disabled={isPending}>
        {isPending
          ? "Enviando…"
          : mode === "magic"
          ? "Recibir enlace"
          : mode === "password"
          ? "Entrar"
          : "Crear cuenta"}
      </button>

      <p className="text-center text-xs text-ink-subtle">
        Al continuar aceptas el tratamiento confidencial de tus datos. Tu información solo la ves tú
        y los profesionales autorizados.
      </p>
    </form>
  );
}

function ModeTab({
  id,
  current,
  onSelect,
  children
}: {
  id: Mode;
  current: Mode;
  onSelect: (m: Mode) => void;
  children: React.ReactNode;
}) {
  const active = id === current;
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={() => onSelect(id)}
      className={
        "flex-1 rounded-full border px-3 py-2 text-xs font-semibold transition-colors " +
        (active
          ? "border-brand-600 bg-brand-600 text-ink-inverse"
          : "border-outline-medium bg-elevated text-ink-secondary")
      }
    >
      {children}
    </button>
  );
}
