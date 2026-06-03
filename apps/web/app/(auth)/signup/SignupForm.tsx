"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  IconArrowRight,
  IconCheck,
  IconLock,
  IconMail,
  IconShieldCheck
} from "@tabler/icons-react";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";

/**
 * Formulario de alta nueva: email + contraseña + confirmación.
 *
 * Tras el signup, Supabase envía un email de confirmación. Mientras tanto
 * mostramos un estado "Revisa tu correo".
 *
 * El alias y las áreas de foco se piden después en /onboarding (cuando el
 * usuario abre el link del email y vuelve autenticado).
 */
export function SignupForm() {
  const params = useSearchParams();
  const redirectTo = params.get("redirectTo") ?? "/home";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [accept, setAccept] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [isPending, startTransition] = useTransition();

  const passwordIssues = useMemo(() => analyzePassword(password), [password]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (passwordIssues.length > 0) {
      setError("Tu contraseña aún no es lo bastante fuerte.");
      return;
    }
    if (password !== confirm) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    if (!accept) {
      setError("Necesitamos que aceptes la política de privacidad.");
      return;
    }

    startTransition(async () => {
      const supabase = getSupabaseBrowserClient();
      try {
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
      } catch (err) {
        const message = err instanceof Error ? err.message : "Algo ha fallado";
        setError(translateError(message));
      }
    });
  }

  if (sent) {
    return (
      <div
        className="card-glass flex flex-col items-center gap-3 text-center"
        role="status"
      >
        <div
          aria-hidden
          className="grid h-12 w-12 place-items-center rounded-full bg-brand-100 text-brand-700"
        >
          <IconCheck size={26} stroke={2.4} />
        </div>
        <h2 className="text-xl font-semibold text-ink-primary">
          Cuenta creada · revisa tu correo
        </h2>
        <p className="max-w-[30ch] text-sm leading-snug text-ink-muted">
          Te hemos enviado un enlace a{" "}
          <strong className="text-ink-primary">{email}</strong> para confirmar
          que es tuyo. Ábrelo desde el mismo dispositivo para entrar.
        </p>
        <p className="max-w-[30ch] text-sm leading-snug text-ink-muted">
          Después te haremos unas preguntas rápidas para preparar tu espacio. No
          hay respuestas buenas ni malas.
        </p>
        <Link
          href={{ pathname: "/login", query: { email } }}
          className="btn-ghost mt-1"
        >
          Volver al login
        </Link>
      </div>
    );
  }

  return (
    <form className="flex flex-col gap-5" onSubmit={handleSubmit} noValidate>
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
        <Field
          id="password"
          label="Crea una contraseña"
          icon={IconLock}
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={setPassword}
          placeholder="Mínimo 8 caracteres"
          minLength={8}
          required
        />
        <PasswordHints issues={passwordIssues} value={password} />
        <Field
          id="confirm"
          label="Confírmala"
          icon={IconShieldCheck}
          type="password"
          autoComplete="new-password"
          value={confirm}
          onChange={setConfirm}
          placeholder="Repite tu contraseña"
          minLength={8}
          required
        />

        <label className="flex items-start gap-2 text-[13px] text-ink-secondary">
          <input
            type="checkbox"
            checked={accept}
            onChange={(e) => setAccept(e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-brand-600"
            aria-describedby="accept-help"
          />
          <span id="accept-help" className="leading-snug">
            He leído y acepto la política de privacidad. Mis datos son
            confidenciales.
          </span>
        </label>

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
              <Spinner /> Creando cuenta…
            </span>
          ) : (
            <>
              Crear mi cuenta
              <IconArrowRight size={18} stroke={2.4} aria-hidden />
            </>
          )}
        </button>
      </div>

      <p className="text-center text-sm text-ink-muted">
        ¿Ya tienes cuenta?{" "}
        <Link
          href={{
            pathname: "/login",
            query: redirectTo !== "/home" ? { redirectTo } : undefined
          }}
          className="font-bold text-brand-700 underline-offset-4 hover:underline"
        >
          Entra aquí
        </Link>
      </p>
    </form>
  );
}

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

type PasswordIssue = "length" | "letter" | "number";

function analyzePassword(pwd: string): PasswordIssue[] {
  const issues: PasswordIssue[] = [];
  if (pwd.length < 8) issues.push("length");
  if (!/[A-Za-z]/.test(pwd)) issues.push("letter");
  if (!/[0-9]/.test(pwd)) issues.push("number");
  return issues;
}

function PasswordHints({
  issues,
  value
}: {
  issues: PasswordIssue[];
  value: string;
}) {
  if (!value) return null;
  const items: { id: PasswordIssue; label: string }[] = [
    { id: "length", label: "Al menos 8 caracteres" },
    { id: "letter", label: "Una letra" },
    { id: "number", label: "Un número" }
  ];
  return (
    <ul className="flex flex-wrap gap-1.5" aria-label="Requisitos de contraseña">
      {items.map((it) => {
        const ok = !issues.includes(it.id);
        return (
          <li
            key={it.id}
            className={
              "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold " +
              (ok
                ? "bg-brand-50 text-brand-700"
                : "bg-canvas text-ink-muted")
            }
          >
            <IconCheck
              size={11}
              aria-hidden
              className={ok ? "opacity-100" : "opacity-30"}
            />
            {it.label}
          </li>
        );
      })}
    </ul>
  );
}

function translateError(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes("already registered") || lower.includes("user already")) {
    return "Ya hay una cuenta con este correo. Entra desde el login.";
  }
  if (lower.includes("weak password")) {
    return "Tu contraseña aún no es lo bastante fuerte.";
  }
  if (lower.includes("invalid email")) {
    return "El correo no parece válido.";
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
