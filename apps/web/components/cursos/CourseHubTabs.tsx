import Link from "next/link";
import {
  IconBookmark,
  IconBroadcast,
  IconCompass
} from "@tabler/icons-react";

export type CourseHubTab = "mine" | "live" | "catalog";

const TABS: {
  id: CourseHubTab;
  label: string;
  description: string;
  icon: typeof IconBookmark;
  href: (tab: CourseHubTab) => string;
}[] = [
  {
    id: "mine",
    label: "En marcha",
    description: "Lo que ya empezaste",
    icon: IconBookmark,
    href: () => "/cursos"
  },
  {
    id: "live",
    label: "En directo",
    description: "Clases en vivo",
    icon: IconBroadcast,
    href: () => "/cursos?tab=live"
  },
  {
    id: "catalog",
    label: "Catálogo",
    description: "Explorar todo",
    icon: IconCompass,
    href: () => "/cursos?tab=catalog"
  }
];

export function CourseHubTabs({
  active,
  counts
}: {
  active: CourseHubTab;
  counts: Record<CourseHubTab, number>;
}) {
  return (
    <nav aria-label="Secciones de formación" className="w-full">
      <div className="hub-segmented">
        {TABS.map((t) => {
          const isActive = t.id === active;
          const Icon = t.icon;
          const count = counts[t.id];
          return (
            <Link
              key={t.id}
              href={t.href(t.id)}
              scroll={false}
              aria-current={isActive ? "page" : undefined}
              className={"hub-segmented-item " + (isActive ? "hub-segmented-item-active" : "")}
            >
              <Icon size={18} aria-hidden stroke={isActive ? 2.2 : 1.75} />
              <span className="hub-segmented-label">{t.label}</span>
              {count > 0 && (
                <span className="hub-segmented-count" aria-label={`${count} elementos`}>
                  {count}
                </span>
              )}
            </Link>
          );
        })}
      </div>
      <p className="mt-2 text-center text-[12px] text-ink-muted">
        {TABS.find((t) => t.id === active)?.description}
      </p>
    </nav>
  );
}
