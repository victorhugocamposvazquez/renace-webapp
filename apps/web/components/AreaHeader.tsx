import { AREA_META, type AreaId } from "@renace/core";
import { AREA_THEMES } from "@renace/tokens";

export function AreaHeader({ area }: { area: AreaId }) {
  const meta = AREA_META[area];
  const theme = AREA_THEMES[area];
  return (
    <header className="relative overflow-hidden rounded-[24px] border border-outline-soft/70 bg-elevated p-5 shadow-soft">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-40 blur-2xl"
        style={{ background: theme.core }}
      />
      <div className="relative flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <span
            aria-hidden
            className="grid h-11 w-11 place-items-center rounded-2xl text-lg font-bold text-ink-inverse shadow-soft"
            style={{ background: theme.core }}
          >
            {meta.label.slice(0, 1)}
          </span>
          <div>
            <p className="label-eyebrow" style={{ color: theme.core }}>
              {meta.eyebrow}
            </p>
            <h1 className="display-title">{meta.label}</h1>
          </div>
        </div>
        <p className="display-subtitle">{meta.subtitle}</p>
      </div>
    </header>
  );
}
