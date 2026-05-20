import Link from "next/link";
import { IconChevronRight, IconTrendingUp } from "@tabler/icons-react";
import { AREA_THEMES, type AreaId } from "@renace/tokens";
import type { AreaProgress } from "@renace/supabase";

/**
 * Línea de progreso global de "Tu recuperación".
 *
 * Visualmente:
 * 1. Cabecera con el % global grande + label.
 * 2. Una barra principal con gradient brand→accent, rellenada al `totalPercent`.
 * 3. Debajo, una fila de 5 mini-barras (una por área) con el color de cada
 *    área, mostrando su % individual. Tocas una y vas a esa área.
 *
 * El total se calcula como la media de las 5 áreas (igual que totalProgress).
 */
const AREA_ORDER: AreaId[] = [
  "emocional",
  "fisica",
  "juridica",
  "laboral",
  "comunidad"
];

export function RecoveryProgress({
  progress,
  totalPercent,
  dayInProgram,
  week
}: {
  progress: AreaProgress[];
  totalPercent: number;
  dayInProgram: number;
  week: number;
}) {
  const byArea = new Map(progress.map((p) => [p.area, p]));
  const status = pickStatus(totalPercent);

  return (
    <article className="overflow-hidden rounded-2xl border border-outline-soft/80 bg-elevated shadow-card">
      {/* Top: número + status */}
      <div className="flex items-start justify-between gap-3 px-5 pb-2 pt-5">
        <div className="min-w-0 flex-1">
          <p className="label-eyebrow">Tu recuperación</p>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-[42px] font-bold leading-none tracking-tight text-ink-primary">
              {totalPercent}
            </span>
            <span className="text-lg font-semibold text-ink-muted">%</span>
            <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-brand-50 px-2 py-0.5 text-[11px] font-bold text-brand-700">
              <IconTrendingUp size={12} aria-hidden />
              {status}
            </span>
          </div>
          <p className="mt-1 text-xs text-ink-subtle">
            Día {dayInProgram} · Semana {week} · suma de las 5 áreas
          </p>
        </div>
      </div>

      {/* Barra principal */}
      <div className="px-5 pt-3">
        <div
          className="h-2.5 overflow-hidden rounded-full bg-outline-soft"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={totalPercent}
          aria-label="Progreso global de recuperación"
        >
          <div
            className="h-full rounded-full bg-brand-gradient transition-all duration-500 ease-out-expo"
            style={{
              width: `${Math.max(2, totalPercent)}%`,
              // Cuando hay algo de progreso, añadimos un toque accent al final
              background:
                totalPercent > 0
                  ? "linear-gradient(90deg, #0FA065 0%, #6F4FE8 100%)"
                  : "transparent"
            }}
          />
        </div>
      </div>

      {/* Mini barras por área (clickables) */}
      <ul
        role="list"
        className="mt-4 grid grid-cols-5 gap-1.5 border-t border-outline-soft/60 bg-canvas/60 px-3 py-3"
      >
        {AREA_ORDER.map((area) => {
          const theme = AREA_THEMES[area];
          const pct = byArea.get(area)?.percent ?? 0;
          return (
            <li key={area}>
              <Link
                href={`/${area}`}
                aria-label={`${theme.label}: ${pct}%`}
                className="group flex flex-col items-stretch gap-1.5 rounded-lg p-1.5 transition-colors hover:bg-elevated active:scale-[0.98]"
              >
                <div className="flex h-12 items-end overflow-hidden rounded-md">
                  <div
                    className="w-full rounded-md transition-all duration-500 ease-out-expo"
                    style={{
                      height: `${Math.max(6, pct)}%`,
                      background: `linear-gradient(180deg, ${theme.core} 0%, ${theme.core}cc 100%)`
                    }}
                    aria-hidden
                  />
                </div>
                <div className="flex flex-col items-center gap-0.5">
                  <span
                    className="text-[10px] font-bold leading-none"
                    style={{ color: theme.text }}
                  >
                    {theme.label.slice(0, 3)}
                  </span>
                  <span className="text-[10px] font-bold text-ink-muted">
                    {pct}%
                  </span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>

      <Link
        href="/recorrido"
        className="flex items-center justify-between gap-2 border-t border-outline-soft/60 px-5 py-3 text-xs font-bold text-brand-700 transition-colors hover:bg-brand-50/40"
      >
        <span>Ver tu recorrido completo</span>
        <IconChevronRight size={14} aria-hidden />
      </Link>
    </article>
  );
}

function pickStatus(percent: number): string {
  if (percent === 0) return "Empieza hoy";
  if (percent < 20) return "Arranque";
  if (percent < 45) return "En camino";
  if (percent < 70) return "Avanzando";
  if (percent < 95) return "Recta final";
  return "Recuperación";
}
