import { IconBell } from "@tabler/icons-react";
import Link from "next/link";
import { greetingFor, formatLongDate } from "@renace/core";
import type { TrustedContact } from "@renace/supabase";
import { SOSButton } from "./SOSButton";

type AppHeaderProps = {
  alias: string;
  notifications?: number;
  trustedContacts: TrustedContact[];
};

export function AppHeader({ alias, notifications = 0, trustedContacts }: AppHeaderProps) {
  const now = new Date();
  const greeting = greetingFor(now);
  return (
    <header className="flex items-start justify-between gap-3 px-5 pt-6">
      <div className="min-w-0">
        <p className="label-eyebrow">{formatLongDate(now)}</p>
        <h1 className="mt-1 truncate text-[28px] font-bold leading-[1.05] tracking-tight text-ink-primary">
          {greeting},{" "}
          <span className="bg-gradient-to-r from-brand-600 to-accent-500 bg-clip-text text-transparent">
            {alias}
          </span>
        </h1>
      </div>
      <div className="flex items-center gap-2">
        <SOSButton contacts={trustedContacts} />
        <Link
          href="/perfil#notifications"
          aria-label={
            notifications > 0
              ? `Notificaciones (${notifications} nuevas)`
              : "Notificaciones"
          }
          className="tap-target relative grid place-items-center rounded-full border border-outline-soft bg-elevated shadow-soft transition-transform duration-200 active:scale-95"
        >
          <IconBell size={20} aria-hidden stroke={1.8} />
          {notifications > 0 && (
            <span
              className="absolute right-2 top-2 grid h-2.5 w-2.5 place-items-center rounded-full bg-state-danger ring-2 ring-elevated"
              aria-hidden
            />
          )}
        </Link>
      </div>
    </header>
  );
}
