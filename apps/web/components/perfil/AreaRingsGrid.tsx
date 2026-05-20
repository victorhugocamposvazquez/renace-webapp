import Link from "next/link";
import {
  IconHeartHandshake,
  IconActivity,
  IconScale,
  IconBriefcase,
  IconChevronRight
} from "@tabler/icons-react";
import type { AreaProgress } from "@renace/supabase";
import type { AreaId } from "@renace/tokens";
import { AREA_THEMES } from "@renace/tokens";
import { Ring } from "@/components/Ring";

const AREA_ICON: Partial<
  Record<AreaId, React.ComponentType<{ size?: number; "aria-hidden"?: boolean }>>
> = {
  emocional: IconHeartHandshake,
  fisica: IconActivity,
  juridica: IconScale,
  laboral: IconBriefcase
};

const AREA_HREF: Record<AreaId, string> = {
  emocional: "/emocional",
  fisica: "/fisica",
  juridica: "/juridica",
  laboral: "/laboral",
  comunidad: "/comunidad"
};

const STATUS_LABEL: Record<AreaProgress["status"], string> = {
  on_track: "En camino",
  attention: "Atención",
  blocked: "Bloqueado",
  done: "Hecho"
};

export function AreaRingsGrid({ progress }: { progress: AreaProgress[] }) {
  const four = (["emocional", "fisica", "juridica", "laboral"] as AreaId[]).map(
    (id) => ({ id, row: progress.find((p) => p.area === id) ?? null })
  );
  return (
    <div className="grid grid-cols-2 gap-2.5">
      {four.map(({ id, row }) => {
        const theme = AREA_THEMES[id];
        const Icon = AREA_ICON[id]!;
        const percent = row?.percent ?? 0;
        const status = row?.status ?? "on_track";
        return (
          <Link
            key={id}
            href={AREA_HREF[id]}
            prefetch
            aria-label={`Ir a ${theme.label}. Progreso ${percent}%, ${STATUS_LABEL[status]}`}
            className="card group relative flex flex-col outline-none transition active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-brand-600"
            style={{ borderColor: theme.border }}
          >
            <div className="flex items-start justify-between">
              <span
                aria-hidden
                className="grid h-8 w-8 place-items-center rounded-lg"
                style={{ backgroundColor: theme.tint, color: theme.core }}
              >
                <Icon size={16} aria-hidden />
              </span>
              <Ring percent={percent} color={theme.core} />
            </div>
            <div className="mt-3 flex items-end justify-between gap-1">
              <div>
                <p className="text-base font-bold text-ink-primary">
                  {theme.label}
                </p>
                <p className="text-xs text-ink-subtle">{STATUS_LABEL[status]}</p>
              </div>
              <IconChevronRight
                size={16}
                className="shrink-0 text-ink-subtle transition group-active:translate-x-0.5"
                aria-hidden
              />
            </div>
          </Link>
        );
      })}
    </div>
  );
}
