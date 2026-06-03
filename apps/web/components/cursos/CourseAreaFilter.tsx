import Link from "next/link";
import type { AreaId } from "@renace/supabase";
import { AREA_LABEL, AREA_ORDER } from "@renace/core";
import { AREA_THEMES } from "@renace/tokens";

const FILTER_AREAS: AreaId[] = AREA_ORDER.filter((a) =>
  ["laboral", "emocional", "fisica", "juridica", "comunidad"].includes(a)
);

export function CourseAreaFilter({
  activeArea,
  tab
}: {
  activeArea: AreaId | null;
  tab: "catalog" | "live";
}) {
  const base = tab === "catalog" ? "/cursos?tab=catalog" : "/cursos?tab=live";

  return (
    <div
      role="tablist"
      aria-label="Filtrar por área"
      className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 hide-scrollbar"
    >
      <FilterChip href={base} label="Todas" active={activeArea === null} />
      {FILTER_AREAS.map((area) => {
        const theme = AREA_THEMES[area];
        const href = `${base}&area=${area}`;
        const active = activeArea === area;
        return (
          <FilterChip
            key={area}
            href={href}
            label={AREA_LABEL[area]}
            active={active}
            dotColor={theme.core}
            tint={active ? theme.tint : undefined}
            textColor={active ? theme.text : undefined}
            borderColor={active ? theme.border : undefined}
          />
        );
      })}
    </div>
  );
}

function FilterChip({
  href,
  label,
  active,
  dotColor,
  tint,
  textColor,
  borderColor
}: {
  href: string;
  label: string;
  active: boolean;
  dotColor?: string;
  tint?: string;
  textColor?: string;
  borderColor?: string;
}) {
  return (
    <Link
      href={href}
      scroll={false}
      role="tab"
      aria-selected={active}
      className={
        "inline-flex min-h-[44px] shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-2 text-[13px] font-semibold transition-all " +
        (active
          ? "shadow-soft"
          : "border-outline-soft bg-elevated text-ink-secondary hover:border-outline-medium")
      }
      style={
        active && tint
          ? { backgroundColor: tint, borderColor: borderColor, color: textColor }
          : undefined
      }
    >
      {dotColor && (
        <span
          aria-hidden
          className="h-2 w-2 rounded-full"
          style={{ backgroundColor: dotColor }}
        />
      )}
      {label}
    </Link>
  );
}
