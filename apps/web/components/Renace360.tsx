import Link from "next/link";
import {
  IconHeartHandshake,
  IconActivity,
  IconScale,
  IconBriefcase,
  IconUsers
} from "@tabler/icons-react";
import { AREA_THEMES, type AreaId } from "@renace/tokens";
import type { AreaProgress } from "@renace/supabase";

const AREA_ICON: Record<
  AreaId,
  React.ComponentType<{ size?: number; "aria-hidden"?: boolean; color?: string; stroke?: number }>
> = {
  emocional: IconHeartHandshake,
  fisica: IconActivity,
  juridica: IconScale,
  laboral: IconBriefcase,
  comunidad: IconUsers
};

/* ----- Geometría del pentágono regular -----
 * Centro del contenedor cuadrado en (50%, 50%).
 * 5 posiciones equidistantes (72° apart) sobre la circunferencia del aro.
 * Primera posición en 12 en punto (-90° desde el eje X).
 * ORBIT_RADIUS_PCT: distancia del centro a cada burbuja (en % del lado).
 * Debe coincidir con el radio del aro SVG (RING_RADIUS_SVG / 360 × 100).
 */
const RING_RADIUS_SVG = 132;
const ORBIT_RADIUS_PCT = (RING_RADIUS_SVG / 360) * 100;

const AREA_ORDER: AreaId[] = ["emocional", "fisica", "juridica", "laboral", "comunidad"];

const AREA_POSITIONS = AREA_ORDER.map((_, i) => {
  const angleDeg = -90 + (i * 360) / AREA_ORDER.length;
  const rad = (angleDeg * Math.PI) / 180;
  return {
    left: `${50 + ORBIT_RADIUS_PCT * Math.cos(rad)}%`,
    top: `${50 + ORBIT_RADIUS_PCT * Math.sin(rad)}%`
  };
});

export function Renace360({
  progress,
  totalPercent,
  dayInProgram,
  week,
  alias
}: {
  progress: AreaProgress[];
  totalPercent: number;
  dayInProgram: number;
  week: number;
  alias: string;
}) {
  const byArea = new Map(progress.map((p) => [p.area, p]));
  const ringCircumference = 2 * Math.PI * RING_RADIUS_SVG;
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[320px]">
      <svg
        viewBox="0 0 360 360"
        className="absolute inset-0 h-full w-full"
        aria-hidden
      >
        <defs>
          <radialGradient id="renace-core-gradient" cx="35%" cy="35%" r="75%">
            <stop offset="0%" stopColor="#26BB7C" />
            <stop offset="60%" stopColor="#0FA065" />
            <stop offset="100%" stopColor="#0B6A45" />
          </radialGradient>
          <linearGradient id="renace-track-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0FA065" />
            <stop offset="100%" stopColor="#6F4FE8" />
          </linearGradient>
          <filter id="renace-core-shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#0A8554" floodOpacity="0.35" />
          </filter>
        </defs>
        <circle
          cx="180"
          cy="180"
          r={RING_RADIUS_SVG}
          fill="none"
          stroke="#D6D3CE"
          strokeWidth="1"
          strokeDasharray="2 4"
        />
        <circle
          cx="180"
          cy="180"
          r={RING_RADIUS_SVG}
          fill="none"
          stroke="#ECEAE6"
          strokeWidth="6"
        />
        <circle
          cx="180"
          cy="180"
          r={RING_RADIUS_SVG}
          fill="none"
          stroke="url(#renace-track-gradient)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={ringCircumference}
          strokeDashoffset={ringCircumference * (1 - totalPercent / 100)}
          transform="rotate(-90 180 180)"
        />
        <circle
          cx="180"
          cy="180"
          r="64"
          fill="url(#renace-core-gradient)"
          filter="url(#renace-core-shadow)"
        />
        <circle
          cx="180"
          cy="180"
          r="64"
          fill="none"
          stroke="#fff"
          strokeWidth="2.5"
          strokeOpacity="0.6"
        />
      </svg>

      {AREA_ORDER.map((area, i) => (
        <AreaButton
          key={area}
          area={area}
          progress={byArea.get(area)?.percent ?? 0}
          position={AREA_POSITIONS[i]!}
        />
      ))}

      <Link
        href="/perfil"
        aria-label={`Tu perfil, ${alias}. Día ${dayInProgram}, semana ${week}, ${totalPercent}% de avance.`}
        className="absolute left-1/2 top-1/2 z-10 flex h-[36%] w-[36%] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full text-ink-inverse"
      >
        <span
          aria-hidden
          className="grid h-9 w-9 place-items-center rounded-full bg-white/25 text-sm font-bold"
        >
          {alias.slice(0, 1).toUpperCase()}
        </span>
        <span aria-hidden className="mt-1 text-[15px] font-bold leading-none">
          {totalPercent}%
        </span>
        <span
          aria-hidden
          className="mt-1 text-[10px] font-semibold tracking-wider text-white/85"
        >
          día {dayInProgram} · sem {week}
        </span>
      </Link>
    </div>
  );
}

function AreaButton({
  area,
  progress,
  position
}: {
  area: AreaId;
  progress: number;
  position: { top: string; left: string };
}) {
  const theme = AREA_THEMES[area];
  const Icon = AREA_ICON[area];
  return (
    <Link
      href={`/${area}`}
      aria-label={`Área ${theme.label}. Avance ${progress}%`}
      className="absolute z-10 -translate-x-1/2 -translate-y-1/2 transition-transform duration-200 ease-out-expo active:scale-95"
      style={{ top: position.top, left: position.left }}
    >
      <span
        className="flex h-[78px] w-[78px] flex-col items-center justify-center rounded-full border-[2.5px] shadow-card"
        style={{
          backgroundColor: theme.tint,
          borderColor: theme.core
        }}
      >
        <Icon size={24} aria-hidden color={theme.core} stroke={2} />
        <span
          className="mt-0.5 text-[10.5px] font-bold leading-none tracking-tight"
          style={{ color: theme.core }}
        >
          {theme.label}
        </span>
      </span>
    </Link>
  );
}
