import Link from "next/link";
import { IconChevronRight, IconTrendingUp } from "@tabler/icons-react";
import type { AreaProgress } from "@renace/supabase";

/**
 * Resumen del progreso global de "Tu recuperación".
 *
 * El detalle por área ya se muestra arriba en el pentágono (Renace360), así que
 * aquí solo damos el número global + estado y los dos accesos del recorrido
 * (histórico diario y hitos), sin repetir las 5 áreas.
 *
 * El total se calcula como la media de las 5 áreas (igual que totalProgress).
 */
export function RecoveryProgress({
  totalPercent,
  dayInProgram,
  week
}: {
  progress: AreaProgress[];
  totalPercent: number;
  dayInProgram: number;
  week: number;
}) {
  const status = pickStatus(totalPercent);

  return (
    <article className="overflow-hidden rounded-[20px] border border-outline-soft/70 bg-elevated shadow-card">
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
            Día {dayInProgram} · Semana {week} · tus cinco áreas juntas
          </p>
        </div>
      </div>

      {/* Barra principal */}
      <div className="px-5 pb-4 pt-3">
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
                  ? "linear-gradient(90deg, #13924C 0%, #6F4FE8 100%)"
                  : "transparent"
            }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 border-t border-outline-soft/60">
        <Link
          href="/recorrido/dias"
          className="flex items-center justify-between gap-2 border-r border-outline-soft/60 px-4 py-3 text-xs font-bold text-brand-700 transition-colors hover:bg-brand-50/40"
        >
          <span>Histórico diario</span>
          <IconChevronRight size={14} aria-hidden />
        </Link>
        <Link
          href="/recorrido"
          className="flex items-center justify-between gap-2 px-4 py-3 text-xs font-bold text-brand-700 transition-colors hover:bg-brand-50/40"
        >
          <span>Hitos del recorrido</span>
          <IconChevronRight size={14} aria-hidden />
        </Link>
      </div>
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
