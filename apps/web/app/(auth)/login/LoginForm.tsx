"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  IconArrowRight,
  IconCheck,
  IconLock,
  IconMail,
  IconSparkles
} from "@tabler/icons-react";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";

type Mode = "magic" | "password";

const MODES: { id: Mode; label: string; icon: typeof IconMail }[] = [
  { id: "password", label: "Contraseña", icon: IconLock },
  { id: "magic", label: "Magic link", icon: IconSparkles }
];

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const redirectTo = params.get("redirectTo") ?? "/home";

  const [mode, setMode] = useState<Mode>("password");
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
            // shouldCreateUser=false → si no existe la cuenta, no la crea en
            // silencio. Forzamos al usuario a pasar por /signup.
            options: {
              shouldCreateUser: false,
              emailRedirectTo: `${window.location.origin}/auth/callback?redirectTo=${encodeURIComponent(
                redirectTo
              )}`
            }
          });
          if (error) throw error;
          setSent(true);
        } else {
          const { error } = await supabase.auth.signInWithPassword({
            email,
            password
          });
          if (error) throw error;
          router.replace(redirectTo);
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "Algo ha fallado";
        setError(translateError(message));
      }
    });
  }

  if (sent) {
    return (
      <div className="card-glass flex flex-col items-center gap-3 text-center" role="status">
        <div
          aria-hidden
          className="grid h-12 w-12 place-items-center rounded-full bg-brand-100 text-brand-700"
        >
          <IconCheck size={26} stroke={2.4} />
        </div>
        <h2 className="text-xl font-semibold text-ink-primary">Revisa tu correo</h2>
        <p className="max-w-[28ch] text-sm leading-snug text-ink-muted">
          Te hemos enviado un enlace a <strong className="text-ink-primary">{email}</strong>.
          Ábrelo desde el mismo dispositivo para entrar.
        </p>
        <button
          type="button"
          onClick={() => {
            setSent(false);
            setError(null);
          }}
          className="btn-ghost mt-1"
        >
          Usar otro correo
        </button>
      </div>
    );
  }

  return (
    <form className="flex flex-col gap-5" onSubmit={handleSubmit} noValidate>
      <div role="tablist" aria-label="Tipo de acceso" className="segmented">
        {MODES.map((m) => {
          const active = m.id === mode;
          const Icon = m.icon;
          return (
            <button
              key={m.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => {
                setMode(m.id);
                setError(null);
              }}
              className={`segmented-item ${active ? "segmented-item-active" : ""}`}
            >
              <Icon size={14} aria-hidden className="mr-1.5" stroke={2.2} />
              {m.label}
            </button>
          );
        })}
      </div>

      <div className="card-glass flex flex-col gap-4">
        <Field
          id="email"
          label="Correo electrónico"
          icon={IconMail}
          type="email"
          inputMode="email"
          autoComplete="email"
          value={email}
          onChange={setEmail}
          placeholder="tu@correo.com"
          required
        />

        {mode === "password" && (
          <Field
            id="password"
            label="Contraseña"
            icon={IconLock}
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={setPassword}
            placeholder="••••••••"
            required
          />
        )}

        {error && (
          <p
            role="alert"
            className="rounded-xl border border-state-danger/20 bg-state-danger/5 px-3 py-2 text-sm font-medium text-state-danger"
          >
            {error}
          </p>
        )}

        <button type="submit" className="btn-primary" disabled={isPending}>
          {isPending ? (
            <span className="inline-flex items-center gap-2">
              <Spinner /> Enviando…
            </span>
          ) : (
            <>
              {mode === "magic" ? "Recibir enlace mágico" : "Entrar"}
              <IconArrowRight size={18} stroke={2.4} aria-hidden />
            </>
          )}
        </button>

        {mode === "magic" && (
          <p className="text-center text-[11px] leading-relaxed text-ink-subtle">
            Te enviaremos un enlace seguro. Sin contraseñas que recordar.
          </p>
        )}
      </div>

      <p className="text-center text-sm text-ink-muted">
        ¿Aún no tienes cuenta?{" "}
        <Link
          href={{
            pathname: "/signup",
            query: redirectTo !== "/home" ? { redirectTo } : undefined
          }}
          className="font-bold text-brand-700 underline-offset-4 hover:underline"
        >
          Crear una cuenta
        </Link>
      </p>

      {process.env.NEXT_PUBLIC_DEMO_MODE === "true" && (
        <DemoLoginButton redirectTo={redirectTo} />
      )}
    </form>
  );
}

function DemoLoginButton({ redirectTo }: { redirectTo: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const email = process.env.NEXT_PUBLIC_DEMO_EMAIL ?? "demo@renace.app";
  const password = process.env.NEXT_PUBLIC_DEMO_PASSWORD ?? "DemoRenace2026!";

  function enterDemo() {
    setError(null);
    startTransition(async () => {
      const supabase = getSupabaseBrowserClient();
      const { error: signErr } = await supabase.auth.signInWithPassword({ email, password });
      if (signErr) {
        setError("No pudimos entrar con la cuenta demo. ¿Ejecutaste seed-demo-user.sql?");
        return;
      }
      router.replace(redirectTo);
    });
  }

  return (
    <div className="flex flex-col gap-2 border-t border-outline-soft pt-4">
      <button
        type="button"
        onClick={enterDemo}
        disabled={isPending}
        className="btn-secondary w-full border-brand-200 bg-brand-50 text-brand-800"
      >
        {isPending ? "Entrando…" : "Entrar como demo (inversores)"}
      </button>
      {error && (
        <p role="alert" className="text-center text-xs text-state-danger">
          {error}
        </p>
      )}
    </div>
  );
}

function translateError(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes("signups not allowed") || lower.includes("user not found")) {
    return "No encontramos esa cuenta. ¿Te has registrado ya?";
  }
  if (lower.includes("invalid login credentials")) {
    return "Email o contraseña incorrectos.";
  }
  if (lower.includes("email not confirmed")) {
    return "Confirma tu correo antes de entrar.";
  }
  if (lower.includes("rate limit")) {
    return "Demasiados intentos. Prueba en unos minutos.";
  }
  return message;
}

function Field({
  id,
  label,
  icon: Icon,
  value,
  onChange,
  ...rest
}: {
  id: string;
  label: string;
  icon: typeof IconMail;
  value: string;
  onChange: (v: string) => void;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value">) {
  return (
    <label htmlFor={id} className="flex flex-col gap-1.5">
      <span className="text-[13px] font-semibold text-ink-secondary">{label}</span>
      <div className="relative">
        <Icon
          aria-hidden
          size={18}
          stroke={1.8}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-subtle"
        />
        <input
          {...rest}
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="input pl-11"
          aria-label={label}
        />
      </div>
    </label>
  );
}

function Spinner() {
  return (
    <svg
      className="h-4 w-4 animate-spin"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeOpacity="0.25"
        strokeWidth="3"
      />
      <path
        d="M22 12a10 10 0 0 1-10 10"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}
