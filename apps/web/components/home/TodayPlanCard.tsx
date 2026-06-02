import Link from "next/link";
import { IconCheck, IconCircle, IconMoodSmile, IconSchool, IconBolt } from "@tabler/icons-react";
import type { AreaId } from "@renace/supabase";

export function TodayPlanCard({
  moodDone,
  microDone,
  courseHref,
  weakAreaLabel
}: {
  moodDone: boolean;
  microDone: boolean;
  courseHref: string | null;
  weakAreaLabel: string;
}) {
  const items = [
    {
      done: moodDone,
      icon: IconMoodSmile,
      label: "Registrar tu ánimo",
      href: null as string | null
    },
    {
      done: microDone,
      icon: IconBolt,
      label: "Completar la acción de hoy",
      href: null
    },
    {
      done: false,
      icon: IconSchool,
      label: courseHref ? "10 min en tu curso" : `Un paso en ${weakAreaLabel}`,
      href: courseHref ?? "/cursos?tab=mine"
    }
  ];

  const doneCount = items.filter((i) => i.done).length;

  return (
    <section className="card border-brand-200/60 bg-brand-50/30">
      <div className="flex items-baseline justify-between gap-2">
        <div>
          <p className="label-eyebrow text-brand-700">Plan de hoy</p>
          <h2 className="text-base font-bold text-ink-primary">Tu ritual diario</h2>
        </div>
        <span className="text-xs font-bold text-brand-700">
          {doneCount}/{items.length}
        </span>
      </div>
      <ul role="list" className="mt-3 flex flex-col gap-2">
        {items.map((item) => {
          const Icon = item.icon;
          const row = (
            <div className="flex items-center gap-3 rounded-xl border border-outline-soft/70 bg-elevated px-3 py-2.5">
              <span
                aria-hidden
                className={
                  "grid h-8 w-8 place-items-center rounded-full " +
                  (item.done ? "bg-brand-600 text-ink-inverse" : "bg-canvas text-ink-muted")
                }
              >
                {item.done ? <IconCheck size={16} /> : <IconCircle size={16} />}
              </span>
              <Icon size={16} aria-hidden className="text-brand-700 opacity-70" />
              <span className="flex-1 text-sm font-semibold text-ink-primary">{item.label}</span>
            </div>
          );
          return (
            <li key={item.label}>
              {item.href && !item.done ? (
                <Link href={item.href} className="block active:scale-[0.99]">
                  {row}
                </Link>
              ) : (
                row
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export function pickWeakestAreaLabel(
  areas: { area: AreaId; percent: number }[]
): string {
  const sorted = [...areas].sort((a, b) => a.percent - b.percent);
  const labels: Record<AreaId, string> = {
    emocional: "Emocional",
    fisica: "Física",
    juridica: "Jurídica",
    laboral: "Laboral",
    comunidad: "Red"
  };
  return labels[sorted[0]?.area ?? "emocional"];
}
