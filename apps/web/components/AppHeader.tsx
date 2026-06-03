import { IconBell } from "@tabler/icons-react";
import Link from "next/link";
import { greetingFor, formatLongDate } from "@renace/core";
import type { TrustedContact } from "@renace/supabase";
import { SOSButton } from "./SOSButton";

type AppHeaderProps = {
  alias: string;
  notifications?: number;
  trustedContacts: TrustedContact[];
  /** Si true, el header vive sobre el hero gradient (sin padding extra arriba). */
  embedded?: boolean;
};

export function AppHeader({
  alias,
  notifications = 0,
  trustedContacts,
  embedded = false
}: AppHeaderProps) {
  const now = new Date();
  const greeting = greetingFor(now);
  const initial = alias.slice(0, 1).toUpperCase();

  return (
    <header
      className={`flex flex-col gap-4 ${embedded ? "pt-4" : "px-5 pt-[max(env(safe-area-inset-top),24px)]"}`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <Link
            href="/perfil"
            aria-label="Ir a tu perfil"
            className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-brand-gradient text-base font-bold text-ink-inverse shadow-brand-glow transition-transform active:scale-95"
          >
            {initial}
          </Link>
          <div className="min-w-0">
            <p className="label-eyebrow">{formatLongDate(now)}</p>
            <h1 className="mt-0.5 truncate text-xl font-bold tracking-tight text-ink-primary">
              {greeting}, <span className="text-brand-700">{alias}</span>
            </h1>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <SOSButton contacts={trustedContacts} />
          <Link
            href="/recorrido/dias"
            aria-label={
              notifications > 0
                ? "Tienes algo pendiente hoy. Ver tu día"
                : "Ver tu día"
            }
            className="tap-target relative grid h-11 w-11 place-items-center rounded-2xl border border-outline-soft/80 bg-elevated/90 shadow-soft backdrop-blur-sm transition-transform duration-200 active:scale-95"
          >
            <IconBell size={20} aria-hidden stroke={1.8} />
            {notifications > 0 && (
              <span
                className="absolute right-2.5 top-2.5 grid h-2 w-2 place-items-center rounded-full bg-state-danger ring-2 ring-elevated"
                aria-hidden
              />
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
