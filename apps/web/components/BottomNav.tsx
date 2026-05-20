"use client";

import { useTransition, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  IconHome2,
  IconSparkles,
  IconUsers,
  IconUser
} from "@tabler/icons-react";
import { cn } from "@/lib/cn";

type Tab = {
  href: string;
  label: string;
  icon: React.ComponentType<{
    size?: number;
    "aria-hidden"?: boolean;
    stroke?: number;
    className?: string;
  }>;
  matches: (pathname: string) => boolean;
};

const TABS: Tab[] = [
  {
    href: "/home",
    label: "Inicio",
    icon: IconHome2,
    matches: (p) => p === "/home"
  },
  {
    href: "/aria",
    label: "Aria",
    icon: IconSparkles,
    matches: (p) => p.startsWith("/aria")
  },
  {
    href: "/comunidad",
    label: "Comunidad",
    icon: IconUsers,
    matches: (p) => p.startsWith("/comunidad")
  },
  {
    href: "/perfil",
    label: "Perfil",
    icon: IconUser,
    matches: (p) => p.startsWith("/perfil")
  }
];

export function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  // Tab "optimista": al pulsar, marcamos el destino como activo de inmediato
  // aunque la navegación todavía no haya terminado.
  const [pendingHref, setPendingHref] = useState<string | null>(null);

  // Cuando el pathname ya refleja el destino, dejamos de mostrar el pendiente.
  if (pendingHref && pathname === pendingHref) {
    queueMicrotask(() => setPendingHref(null));
  }

  function navigate(href: string) {
    if (pathname === href) return;
    setPendingHref(href);
    startTransition(() => {
      router.push(href);
    });
  }

  return (
    <nav
      aria-label="Navegación principal"
      className="sticky bottom-0 z-30 mt-auto px-3 pb-[max(env(safe-area-inset-bottom),10px)] pt-2"
    >
      <div className="flex gap-1 rounded-full border border-outline-soft bg-white/85 px-1.5 py-1.5 shadow-card backdrop-blur-xl">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const effectivePathname = pendingHref ?? pathname;
          const active = tab.matches(effectivePathname);
          const isLoading = isPending && pendingHref === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              prefetch
              aria-current={active ? "page" : undefined}
              onClick={(e) => {
                if (
                  e.metaKey ||
                  e.ctrlKey ||
                  e.shiftKey ||
                  e.altKey ||
                  e.button !== 0
                )
                  return;
                e.preventDefault();
                navigate(tab.href);
              }}
              className={cn(
                "group relative flex flex-1 flex-col items-center justify-center gap-0.5 rounded-full py-2 text-[11px] font-semibold transition-all duration-200 ease-out",
                active
                  ? "bg-ink-primary text-ink-inverse shadow-soft"
                  : "text-ink-subtle hover:text-ink-secondary"
              )}
            >
              <Icon
                size={22}
                aria-hidden
                stroke={active ? 2.2 : 1.8}
                className={cn(
                  "transition-transform duration-200 group-active:scale-90",
                  isLoading && "opacity-80"
                )}
              />
              <span className="leading-none">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
