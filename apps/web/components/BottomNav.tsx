"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
  return (
    <nav
      aria-label="Navegación principal"
      className="sticky bottom-0 z-30 mt-auto px-3 pb-[max(env(safe-area-inset-bottom),10px)] pt-2"
    >
      <div className="flex gap-1 rounded-full border border-outline-soft bg-white/85 px-1.5 py-1.5 shadow-card backdrop-blur-xl">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const active = tab.matches(pathname);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={active ? "page" : undefined}
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
                className="transition-transform duration-200 group-active:scale-90"
              />
              <span className="leading-none">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
