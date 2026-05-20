import { IconChartLine } from "@tabler/icons-react";
import type { MoodLog } from "@renace/supabase";

export function MoodEvolution({ moods }: { moods: MoodLog[] }) {
  const recent = moods.slice().reverse(); // de antiguo a reciente
  const avg =
    recent.length === 0
      ? null
      : Math.round((recent.reduce((a, m) => a + m.score, 0) / recent.length) * 10) / 10;

  return (
    <section
      id="evolucion"
      aria-labelledby="evol-title"
      className="card border-area-emocional-border"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            aria-hidden
            className="grid h-9 w-9 place-items-center rounded-lg bg-area-emocional-tint text-area-emocional"
          >
            <IconChartLine size={18} aria-hidden />
          </span>
          <h2 id="evol-title" className="text-base font-bold text-ink-primary">
            Tu evolución
          </h2>
        </div>
        <div className="text-right">
          <p className="text-xl font-bold text-ink-primary">{avg ?? "—"}</p>
          <p className="text-xs text-ink-subtle">media</p>
        </div>
      </div>

      <div
        className="mt-3 flex h-12 items-end gap-1"
        aria-label={`Últimas ${recent.length} sesiones de ánimo`}
      >
        {recent.length === 0 && (
          <p className="text-sm text-ink-muted">Registra tu ánimo para verlo aquí.</p>
        )}
        {recent.map((m) => (
          <span
            key={m.id}
            className="w-2 flex-1 rounded-sm bg-area-emocional"
            style={{ height: `${(m.score / 5) * 100}%`, minHeight: "4px" }}
            aria-hidden
          />
        ))}
      </div>
    </section>
  );
}
