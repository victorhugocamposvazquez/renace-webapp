"use client";

import { useTransition, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  IconHome2,
  IconSparkles,
  IconUsers,
  IconUser,
  IconSchool
} from "@tabler/icons-react";
import { cn } from "@/lib/cn";

type Tab = {
  href: string;
  label: string;
  shortLabel: string;
  icon: React.ComponentType<{
    size?: number;
    "aria-hidden"?: boolean;
    stroke?: number;
    className?: string;
  }>;
  matches: (pathname: string) => boolean;
  accent?: boolean;
};

const TABS: Tab[] = [
  {
    href: "/home",
    label: "Inicio",
    shortLabel: "Inicio",
    icon: IconHome2,
    matches: (p) => p === "/home"
  },
  {
    href: "/cursos",
    label: "Cursos",
    shortLabel: "Cursos",
    icon: IconSchool,
    matches: (p) => p.startsWith("/cursos")
  },
  {
    href: "/aria",
    label: "Aria",
    shortLabel: "Aria",
    icon: IconSparkles,
    matches: (p) => p.startsWith("/aria"),
    accent: true
  },
  {
    href: "/comunidad",
    label: "Comunidad",
    shortLabel: "Red",
    icon: IconUsers,
    matches: (p) => p.startsWith("/comunidad")
  },
  {
    href: "/perfil",
    label: "Perfil",
    shortLabel: "Perfil",
    icon: IconUser,
    matches: (p) => p.startsWith("/perfil")
  }
];

export function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [pendingHref, setPendingHref] = useState<string | null>(null);

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
      className="sticky bottom-0 z-30 mt-auto px-4 pb-[max(env(safe-area-inset-bottom),12px)] pt-2"
    >
      <div className="flex gap-0.5 rounded-[22px] border border-outline-soft/80 bg-elevated/92 p-1 shadow-lift backdrop-blur-2xl">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const effectivePathname = pendingHref ?? pathname;
          const active = tab.matches(effectivePathname);
          const isLoading = isPending && pendingHref === tab.href;
          const ariaActive = active && tab.accent;

          return (
            <Link
              key={tab.href}
              href={tab.href}
              prefetch
              aria-current={active ? "page" : undefined}
              aria-label={tab.label}
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
                "nav-tab",
                active && !tab.accent && "nav-tab-active",
                ariaActive && "nav-tab-aria-active",
                !active && "nav-tab-idle"
              )}
            >
              <Icon
                size={21}
                aria-hidden
                stroke={active ? 2.2 : 1.75}
                className={cn(
                  "transition-transform duration-200",
                  isLoading && "opacity-70",
                  active && "scale-105"
                )}
              />
              <span
                className={cn(
                  "max-w-full truncate text-[9px] font-bold leading-none tracking-wide",
                  active ? "opacity-100" : "opacity-70"
                )}
              >
                {active ? tab.label : tab.shortLabel}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
