import { Ring } from "@/components/Ring";

type Metric =
  | {
      kind: "ring";
      label: string;
      value: string;
      sub: string;
      percent: number;
      color: string;
    }
  | {
      kind: "spark";
      label: string;
      value: string;
      sub: string;
      bars: number[];
      color: string;
    }
  | { kind: "plain"; label: string; value: string; sub: string };

export function MetricGrid({ metrics }: { metrics: Metric[] }) {
  return (
    <div className="grid grid-cols-2 gap-2.5">
      {metrics.map((m, i) => (
        <article
          key={i}
          className="card border-area-fisica-border"
          aria-label={`${m.label}: ${m.value}`}
        >
          <div className="flex items-start justify-between">
            <p className="label-eyebrow">{m.label}</p>
            {m.kind === "ring" && (
              <Ring percent={m.percent} color={m.color} label={`${m.percent}%`} />
            )}
          </div>
          <p className="mt-1 text-2xl font-bold tracking-tight text-ink-primary">{m.value}</p>
          <p className="text-xs text-ink-subtle">{m.sub}</p>
          {m.kind === "spark" && (
            <div className="mt-2 flex h-7 items-end gap-0.5" aria-hidden>
              {m.bars.map((b, idx) => (
                <span
                  key={idx}
                  className="w-1 flex-1 rounded-sm"
                  style={{ height: `${Math.max(20, b)}%`, backgroundColor: m.color }}
                />
              ))}
            </div>
          )}
        </article>
      ))}
    </div>
  );
}
