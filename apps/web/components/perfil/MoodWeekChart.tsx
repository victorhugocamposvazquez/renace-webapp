import type { MoodLog } from "@renace/supabase";
import { MOOD_LABELS, type MoodScore } from "@renace/core";

export function MoodWeekChart({ moods }: { moods: MoodLog[] }) {
  if (moods.length === 0) {
    return (
      <p className="card text-sm text-ink-muted">
        Registra tu ánimo en Emocional para ver tu semana aquí.
      </p>
    );
  }

  const recent = [...moods].reverse().slice(-7);
  const max = 5;

  return (
    <div className="card">
      <p className="text-xs font-bold uppercase tracking-wider text-ink-subtle">Tu semana</p>
      <div className="mt-3 flex items-end justify-between gap-2" role="img" aria-label="Gráfico de ánimo de la semana">
        {recent.map((m) => {
          const h = Math.round((m.score / max) * 100);
          const label = MOOD_LABELS[m.score as MoodScore]?.label ?? "";
          const day = new Date(m.created_at).toLocaleDateString("es-ES", { weekday: "short" });
          return (
            <div key={m.id} className="flex flex-1 flex-col items-center gap-1">
              <div className="flex h-16 w-full items-end justify-center">
                <div
                  className="w-full max-w-[28px] rounded-t-md bg-brand-500 transition-all"
                  style={{ height: `${Math.max(12, h)}%`, opacity: 0.4 + m.score * 0.12 }}
                  title={`${label} · ${m.score}/5`}
                />
              </div>
              <span className="text-[10px] font-semibold capitalize text-ink-subtle">{day}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
