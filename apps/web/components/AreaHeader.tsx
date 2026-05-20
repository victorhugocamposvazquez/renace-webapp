import { AREA_META, type AreaId } from "@renace/core";
import { AREA_THEMES } from "@renace/tokens";

export function AreaHeader({ area }: { area: AreaId }) {
  const meta = AREA_META[area];
  const theme = AREA_THEMES[area];
  return (
    <header className="flex flex-col gap-2">
      <div className="flex items-center gap-3">
        <span
          aria-hidden
          className="h-9 w-1.5 rounded-full"
          style={{ backgroundColor: theme.core }}
        />
        <div>
          <p className="label-eyebrow" style={{ color: theme.core }}>
            {meta.eyebrow}
          </p>
          <h1 className="mt-1 text-[30px] font-bold leading-[1.05] tracking-tight text-ink-primary">
            {meta.label}
          </h1>
        </div>
      </div>
      <p className="text-[15px] font-medium leading-snug text-ink-muted">{meta.subtitle}</p>
    </header>
  );
}
