import Link from "next/link";

export type CourseHubTab = "mine" | "live" | "catalog";

const TABS: {
  id: CourseHubTab;
  label: string;
  href: (tab: CourseHubTab) => string;
}[] = [
  { id: "mine", label: "En marcha", href: () => "/cursos" },
  { id: "live", label: "En directo", href: () => "/cursos?tab=live" },
  { id: "catalog", label: "Catálogo", href: () => "/cursos?tab=catalog" }
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
          const count = counts[t.id];
          return (
            <Link
              key={t.id}
              href={t.href(t.id)}
              scroll={false}
              aria-current={isActive ? "page" : undefined}
              className={"hub-segmented-item " + (isActive ? "hub-segmented-item-active" : "")}
            >
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
    </nav>
  );
}
