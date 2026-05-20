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
  icon: React.ComponentType<{ size?: number; "aria-hidden"?: boolean; stroke?: number }>;
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
      className="sticky bottom-0 z-30 mt-auto flex gap-1 border-t border-outline-soft bg-elevated px-3 pb-[max(env(safe-area-inset-bottom),12px)] pt-2"
    >
      {TABS.map((tab) => {
        const Icon = tab.icon;
        const active = tab.matches(pathname);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "tap-target flex flex-1 flex-col items-center justify-center gap-1 rounded-lg py-2 text-xs font-semibold",
              active ? "bg-brand-100 text-brand-600" : "text-ink-subtle"
            )}
          >
            <Icon size={24} aria-hidden stroke={active ? 2.2 : 1.8} />
            <span className="text-[11px] leading-none">{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
