import type { CourseWithEnrollment } from "@renace/supabase";
import { LiveClassCard } from "./LiveClassCard";

/**
 * Sección "Clases en directo".
 * - La primera (más cercana en el tiempo) se muestra en formato grande.
 * - El resto se muestra como lista compacta.
 */
export function LiveClassesSection({
  classes
}: {
  classes: CourseWithEnrollment[];
}) {
  if (classes.length === 0) {
    return (
      <section>
        <div className="mb-2 flex items-end justify-between">
          <h2 className="text-base font-bold text-ink-primary">Clases en directo</h2>
        </div>
        <p className="rounded-2xl bg-paper-tint px-4 py-6 text-sm text-ink-muted">
          No hay clases programadas ahora mismo. Vuelve en unos días.
        </p>
      </section>
    );
  }
  const next = classes[0];
  const rest = classes.slice(1);
  if (!next) return null;
  return (
    <section className="flex flex-col gap-3">
      <header className="flex items-end justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-ink-primary">Clases en directo</h2>
          <p className="text-xs text-ink-subtle">
            Únete o activa un recordatorio
          </p>
        </div>
      </header>

      <LiveClassCard course={next} variant="full" />

      {rest.length > 0 && (
        <ul role="list" className="flex flex-col gap-2">
          {rest.map((c) => (
            <li key={c.id}>
              <LiveClassCard course={c} variant="compact" />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
