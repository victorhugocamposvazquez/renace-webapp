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
    <header className="flex items-start justify-between gap-3 px-5 pt-5">
      <div>
        <p className="text-xs font-medium text-ink-subtle">{formatLongDate(now)}</p>
        <h1 className="mt-0.5 text-3xl font-bold leading-tight tracking-tight text-ink-primary">
          {greeting}, {alias}
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
          className="tap-target relative grid place-items-center rounded-lg border border-outline-medium bg-elevated"
        >
          <IconBell size={22} aria-hidden />
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
