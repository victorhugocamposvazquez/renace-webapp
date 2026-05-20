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
          className="h-8 w-2 rounded"
          style={{ backgroundColor: theme.core }}
        />
        <div>
          <p className="label-eyebrow" style={{ color: theme.core }}>
            {meta.eyebrow}
          </p>
          <h1 className="mt-0.5 text-3xl font-bold tracking-tight text-ink-primary">
            {meta.label}
          </h1>
        </div>
      </div>
      <p className="text-base font-medium text-ink-muted">{meta.subtitle}</p>
    </header>
  );
}
