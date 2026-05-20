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

const AREA_ICON: Record<AreaId, React.ComponentType<{ size?: number; "aria-hidden"?: boolean; color?: string }>> = {
  emocional: IconHeartHandshake,
  fisica: IconActivity,
  juridica: IconScale,
  laboral: IconBriefcase,
  comunidad: IconUsers
};

/**
 * El círculo 360 es decorativo (SVG) pero los 5 círculos de área son botones
 * reales con touch target accesible; usamos position absoluto sobre un grid
 * cuadrado en lugar de SVG <g> para que cumplan los 44pt y reciban focus.
 */
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
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[340px]">
      <svg
        viewBox="0 0 360 360"
        className="absolute inset-0 h-full w-full"
        aria-hidden
      >
        <defs>
          <radialGradient id="renace-core-gradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#2BB68A" />
            <stop offset="100%" stopColor="#0F6E56" />
          </radialGradient>
        </defs>
        <circle cx="180" cy="180" r="160" fill="none" stroke="#C5D0BF" strokeWidth="1" strokeDasharray="2 4" />
        <circle cx="180" cy="180" r="160" fill="none" stroke="#ECEFE9" strokeWidth="4" />
        <circle
          cx="180"
          cy="180"
          r="160"
          fill="none"
          stroke="#0F6E56"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={2 * Math.PI * 160}
          strokeDashoffset={2 * Math.PI * 160 * (1 - totalPercent / 100)}
          transform="rotate(-90 180 180)"
        />
        <circle cx="180" cy="180" r="68" fill="url(#renace-core-gradient)" />
        <circle cx="180" cy="180" r="68" fill="none" stroke="#fff" strokeWidth="4" />
      </svg>

      {(["emocional", "fisica", "juridica", "laboral", "comunidad"] as AreaId[]).map((area, i) => (
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
          className="grid h-10 w-10 place-items-center rounded-full bg-white/25 text-base font-bold"
        >
          {alias.slice(0, 1).toUpperCase()}
        </span>
        <span aria-hidden className="mt-1 text-base font-bold leading-none">
          {totalPercent}%
        </span>
        <span aria-hidden className="mt-1 text-[10px] font-semibold tracking-wider text-white/90">
          día {dayInProgram} · sem {week}
        </span>
      </Link>
    </div>
  );
}

const AREA_POSITIONS = [
  { top: "0%", left: "50%" }, // emocional — top
  { top: "22%", left: "85%" }, // fisica — top-right
  { top: "73%", left: "76%" }, // juridica — bottom-right
  { top: "73%", left: "24%" }, // laboral — bottom-left
  { top: "22%", left: "15%" } // comunidad — top-left
] as const;

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
      className="tap-target absolute z-10 -translate-x-1/2 -translate-y-1/2 active:scale-95"
      style={{ top: position.top, left: position.left }}
    >
      <span
        className="flex h-[92px] w-[92px] flex-col items-center justify-center rounded-full border-[3px]"
        style={{
          backgroundColor: theme.tint,
          borderColor: theme.core
        }}
      >
        <Icon size={28} aria-hidden color={theme.core} />
        <span
          className="mt-1 text-[11px] font-bold leading-none"
          style={{ color: theme.core }}
        >
          {theme.label}
        </span>
      </span>
    </Link>
  );
}
