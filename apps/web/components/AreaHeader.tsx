import {
  IconHeartHandshake,
  IconActivity,
  IconScale,
  IconBriefcase,
  IconUsers,
  type IconProps
} from "@tabler/icons-react";
import type { ComponentType } from "react";
import { AREA_META, type AreaId } from "@renace/core";
import { AREA_THEMES } from "@renace/tokens";

const AREA_ICON: Record<AreaId, ComponentType<IconProps>> = {
  emocional: IconHeartHandshake,
  fisica: IconActivity,
  juridica: IconScale,
  laboral: IconBriefcase,
  comunidad: IconUsers
};

/**
 * Hero de área al estilo v3: gradiente del color del área, icono en caja
 * translúcida, propósito narrativo y barra de progreso opcional.
 */
export function AreaHeader({
  area,
  percent
}: {
  area: AreaId;
  /** Progreso del área (0–100). Si se omite, no se muestra la barra. */
  percent?: number;
}) {
  const meta = AREA_META[area];
  const theme = AREA_THEMES[area];
  const Icon = AREA_ICON[area];
  const pct = percent != null ? Math.max(0, Math.min(100, Math.round(percent))) : null;

  return (
    <header
      className="relative -mx-5 -mt-5 overflow-hidden px-5 pb-6 pt-6 text-ink-inverse"
      style={{
        background: `linear-gradient(135deg, ${theme.core} 0%, ${theme.coreDark} 100%)`
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 -top-12 h-56 w-56 rounded-full opacity-20"
        style={{ background: "radial-gradient(circle, #fff 0%, transparent 70%)" }}
      />
      <div className="relative flex items-center gap-3">
        <span
          aria-hidden
          className="grid h-12 w-12 place-items-center rounded-2xl bg-white/20 backdrop-blur-sm"
        >
          <Icon size={24} stroke={2} aria-hidden />
        </span>
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/80">
            {meta.eyebrow}
          </p>
          <h1 className="text-[28px] font-bold leading-tight tracking-tight">{meta.label}</h1>
        </div>
      </div>

      <p className="relative mt-3 max-w-[34ch] text-[15px] font-medium leading-relaxed text-white/90">
        {meta.purpose}
      </p>

      {pct != null && (
        <div className="relative mt-4">
          <div className="mb-1.5 flex items-center justify-between text-[12px] font-semibold text-white/85">
            <span>Tu progreso en esta área</span>
            <span>{pct}%</span>
          </div>
          <div
            className="h-2 overflow-hidden rounded-full bg-white/25"
            role="progressbar"
            aria-valuenow={pct}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Progreso en ${meta.label}: ${pct}%`}
          >
            <div
              className="h-full rounded-full bg-white transition-all duration-500"
              style={{ width: `${pct}%` }}
              aria-hidden
            />
          </div>
        </div>
      )}
    </header>
  );
}
