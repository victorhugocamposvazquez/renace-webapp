import { IconBroadcast } from "@tabler/icons-react";
import type { CourseWithEnrollment } from "@renace/supabase";
import { LiveClassCard } from "./LiveClassCard";

type Group = {
  label: string;
  items: CourseWithEnrollment[];
};

function groupClasses(classes: CourseWithEnrollment[]): {
  live: CourseWithEnrollment[];
  groups: Group[];
} {
  const now = new Date();
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const dayAfter = new Date(today);
  dayAfter.setDate(today.getDate() + 2);
  const inAWeek = new Date(today);
  inAWeek.setDate(today.getDate() + 7);

  const live: CourseWithEnrollment[] = [];
  const todayItems: CourseWithEnrollment[] = [];
  const tomorrowItems: CourseWithEnrollment[] = [];
  const weekItems: CourseWithEnrollment[] = [];
  const laterItems: CourseWithEnrollment[] = [];

  for (const c of classes) {
    if (!c.starts_at) continue;
    const startsAt = new Date(c.starts_at);
    const diffMs = startsAt.getTime() - now.getTime();
    const diffMin = diffMs / 60000;
    if (diffMs <= 0 && diffMin > -90) {
      live.push(c);
    } else if (startsAt < tomorrow) {
      todayItems.push(c);
    } else if (startsAt < dayAfter) {
      tomorrowItems.push(c);
    } else if (startsAt < inAWeek) {
      weekItems.push(c);
    } else {
      laterItems.push(c);
    }
  }

  const groups: Group[] = [];
  if (todayItems.length) groups.push({ label: "Hoy", items: todayItems });
  if (tomorrowItems.length)
    groups.push({ label: "Mañana", items: tomorrowItems });
  if (weekItems.length)
    groups.push({ label: "Esta semana", items: weekItems });
  if (laterItems.length)
    groups.push({ label: "Más adelante", items: laterItems });
  return { live, groups };
}

/**
 * Sección "Próximas clases en directo".
 * - Si hay alguna en vivo o muy próxima: card grande arriba.
 * - El resto agrupado por día ("Hoy", "Mañana", "Esta semana"…).
 */
export function LiveClassesSection({
  classes,
  title = "Próximas clases en directo",
  subtitle = "Sesiones guiadas en vivo. Únete o activa el recordatorio para que te avise."
}: {
  classes: CourseWithEnrollment[];
  title?: string;
  subtitle?: string;
}) {
  if (classes.length === 0) {
    return (
      <section>
        <header className="mb-2">
          <h2 className="text-base font-bold text-ink-primary">{title}</h2>
          <p className="text-xs text-ink-subtle">{subtitle}</p>
        </header>
        <div className="rounded-2xl border border-dashed border-outline-soft bg-canvas px-4 py-6 text-center">
          <div className="mx-auto mb-2 grid h-10 w-10 place-items-center rounded-full bg-brand-50 text-brand-700">
            <IconBroadcast size={18} aria-hidden />
          </div>
          <p className="text-sm font-medium text-ink-secondary">
            No hay clases programadas
          </p>
          <p className="mt-0.5 text-xs text-ink-subtle">
            Vuelve a esta sección para descubrir nuevas sesiones en vivo.
          </p>
        </div>
      </section>
    );
  }

  const { live, groups } = groupClasses(classes);

  // La que va arriba en grande: la que esté live, o la primera del primer grupo.
  const headline =
    live[0] ?? groups[0]?.items[0] ?? classes[0] ?? null;

  // Las demás se renderizan en compacto sin repetir la headline.
  const rest: { label: string; items: CourseWithEnrollment[] }[] = [];
  for (const g of groups) {
    const items = g.items.filter((c) => c !== headline);
    if (items.length) rest.push({ label: g.label, items });
  }
  if (live.length > 1) {
    rest.unshift({
      label: "En directo ahora",
      items: live.filter((c) => c !== headline)
    });
  }

  return (
    <section className="flex flex-col gap-4">
      <header>
        <h2 className="text-base font-bold text-ink-primary">{title}</h2>
        <p className="text-xs text-ink-subtle">{subtitle}</p>
      </header>

      {headline && <LiveClassCard course={headline} variant="full" />}

      {rest.map((group) => (
        <div key={group.label} className="flex flex-col gap-2">
          <h3 className="text-[11px] font-bold uppercase tracking-wide text-ink-subtle">
            {group.label}
          </h3>
          <ul role="list" className="flex flex-col gap-2">
            {group.items.map((c) => (
              <li key={c.id}>
                <LiveClassCard course={c} variant="compact" />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
}
