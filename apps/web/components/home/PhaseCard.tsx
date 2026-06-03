import type { ProgramPhase } from "@renace/core";

export function PhaseCard({ phase }: { phase: ProgramPhase }) {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-brand-gradient p-5 text-ink-inverse shadow-brand-glow">
      <span
        aria-hidden
        className="pointer-events-none absolute -right-5 -top-8 h-32 w-32 rounded-full bg-white/10"
      />
      <p className="text-[11px] font-bold uppercase tracking-wider text-white/85">
        Tu programa · Fase {phase.phase} de {phase.totalPhases}
      </p>
      <p className="mt-1 text-lg font-bold tracking-tight">{phase.name}</p>
      <p className="mt-0.5 text-[13px] font-medium text-white/90">{phase.description}</p>
      <div className="mt-3.5 flex gap-1.5">
        {Array.from({ length: phase.weeksInPhase }).map((_, i) => (
          <span
            key={i}
            aria-hidden
            className={
              "h-1.5 flex-1 rounded-full " +
              (i < phase.weekInPhase ? "bg-white" : "bg-white/25")
            }
          />
        ))}
      </div>
      <p className="mt-2 text-[13px] font-medium text-white/85">
        Semana {phase.weekInPhase} de {phase.weeksInPhase}
      </p>
    </div>
  );
}
