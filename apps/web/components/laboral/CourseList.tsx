import type { Course } from "@renace/supabase";

const DEMAND_LABEL: Record<Course["demand"], string> = {
  alta: "Alta",
  muy_alta: "Muy alta",
  transversal: "Transversal"
};

export function CourseList({ courses }: { courses: Course[] }) {
  return (
    <ul role="list" className="flex flex-col gap-2">
      {courses.map((c) => (
        <li key={c.id} className="card flex items-start gap-3 border-area-laboral-border">
          <span
            aria-hidden
            className="grid h-11 w-11 place-items-center rounded-lg bg-area-laboral-tint text-2xl"
          >
            {c.emoji ?? "📘"}
          </span>
          <div className="flex-1">
            <h3 className="text-base font-semibold text-ink-primary">{c.title}</h3>
            <p className="mt-0.5 text-xs text-ink-subtle">
              {c.hours_min}–{c.hours_max}h · {c.exit_market}
            </p>
          </div>
          <span className="pill shrink-0 bg-area-laboral-tint text-area-laboral-text">
            {DEMAND_LABEL[c.demand]}
          </span>
        </li>
      ))}
    </ul>
  );
}
