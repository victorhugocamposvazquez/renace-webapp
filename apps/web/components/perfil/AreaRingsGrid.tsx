import {
  IconHeartHandshake,
  IconActivity,
  IconScale,
  IconBriefcase
} from "@tabler/icons-react";
import type { AreaProgress } from "@renace/supabase";
import type { AreaId } from "@renace/tokens";
import { AREA_THEMES } from "@renace/tokens";
import { Ring } from "@/components/Ring";

const AREA_ICON: Partial<Record<AreaId, React.ComponentType<{ size?: number; "aria-hidden"?: boolean }>>> = {
  emocional: IconHeartHandshake,
  fisica: IconActivity,
  juridica: IconScale,
  laboral: IconBriefcase
};

const STATUS_LABEL: Record<AreaProgress["status"], string> = {
  on_track: "En camino",
  attention: "Atención",
  blocked: "Bloqueado",
  done: "Hecho"
};

export function AreaRingsGrid({ progress }: { progress: AreaProgress[] }) {
  const four = (["emocional", "fisica", "juridica", "laboral"] as AreaId[])
    .map((id) => ({ id, row: progress.find((p) => p.area === id) ?? null }));
  return (
    <div className="grid grid-cols-2 gap-2.5">
      {four.map(({ id, row }) => {
        const theme = AREA_THEMES[id];
        const Icon = AREA_ICON[id]!;
        const percent = row?.percent ?? 0;
        const status = row?.status ?? "on_track";
        return (
          <article
            key={id}
            className="card"
            style={{ borderColor: theme.border }}
            aria-label={`${theme.label}: ${percent}%, ${STATUS_LABEL[status]}`}
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
            <p className="mt-3 text-base font-bold text-ink-primary">{theme.label}</p>
            <p className="text-xs text-ink-subtle">{STATUS_LABEL[status]}</p>
          </article>
        );
      })}
    </div>
  );
}
