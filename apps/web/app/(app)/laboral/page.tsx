import type { Metadata } from "next";
import { IconCheck, IconCompass, IconSchool, IconFileText } from "@tabler/icons-react";
import { requireUser } from "@/lib/auth";
import { listJobOffers, listMyApplications, listCourses } from "@renace/supabase";
import { BackLink } from "@/components/BackLink";
import { AreaHeader } from "@/components/AreaHeader";
import { OfferCard } from "@/components/laboral/OfferCard";
import { CourseList } from "@/components/laboral/CourseList";

export const metadata: Metadata = { title: "Laboral · RENACE" };

export default async function LaboralPage() {
  const { client, userId } = await requireUser();
  const [offers, apps, courses] = await Promise.all([
    listJobOffers(client, 6),
    listMyApplications(client, userId),
    listCourses(client)
  ]);
  const appliedSet = new Set(apps.map((a) => a.offer_id));

  return (
    <div className="flex flex-1 flex-col gap-4 px-5 py-5">
      <BackLink />
      <AreaHeader area="laboral" />

      <article className="card border-area-laboral-border">
        <div className="flex items-center justify-between">
          <div>
            <p className="label-eyebrow text-area-laboral-text">Fase 3 de 4</p>
            <p className="mt-0.5 text-base font-bold text-ink-primary">Búsqueda activa</p>
          </div>
          <div className="flex gap-1.5" aria-hidden>
            {[1, 2, 3, 4].map((n) => (
              <span
                key={n}
                className={
                  "h-1.5 w-6 rounded-full " +
                  (n <= 3 ? "bg-area-laboral" : "bg-outline-soft")
                }
              />
            ))}
          </div>
        </div>
        <p className="mt-2 text-xs text-ink-subtle">Próximo hito · primera entrevista real</p>
      </article>

      <h2 className="label-eyebrow">Ofertas para ti</h2>
      {offers.length === 0 ? (
        <p className="card text-sm text-ink-muted border-area-laboral-border">
          Aún no hay ofertas que encajen contigo. Avanza en tu curso y volveremos a buscar.
        </p>
      ) : (
        <ul role="list" className="flex flex-col gap-2.5">
          {offers.map((o) => (
            <li key={o.id}>
              <OfferCard offer={o} applied={appliedSet.has(o.id)} />
            </li>
          ))}
        </ul>
      )}

      <h2 className="label-eyebrow">Tu progreso</h2>
      <div className="card p-1.5">
        <ul role="list" className="divide-y divide-outline-soft">
          <li className="flex items-center gap-3 px-3 py-3">
            <span aria-hidden className="grid h-10 w-10 place-items-center rounded-lg bg-area-laboral-tint text-area-laboral">
              <IconCompass size={20} aria-hidden />
            </span>
            <div className="flex-1">
              <div className="text-base font-semibold text-ink-primary">Orientación</div>
              <div className="text-xs text-ink-subtle">Perfil analizado</div>
            </div>
            <span aria-label="Hecho" className="grid h-7 w-7 place-items-center rounded-full bg-brand-600 text-ink-inverse">
              <IconCheck size={16} aria-hidden />
            </span>
          </li>
          <li className="flex items-center gap-3 px-3 py-3">
            <span aria-hidden className="grid h-10 w-10 place-items-center rounded-lg bg-area-laboral-tint text-area-laboral">
              <IconSchool size={20} aria-hidden />
            </span>
            <div className="flex-1">
              <div className="text-base font-semibold text-ink-primary">Curso de logística</div>
              <div className="mt-1 flex items-center gap-2">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-outline-soft">
                  <div className="h-full bg-area-laboral" style={{ width: "60%" }} aria-hidden />
                </div>
                <span className="text-xs font-bold text-ink-secondary" aria-label="60% completado">
                  60%
                </span>
              </div>
            </div>
          </li>
          <li className="flex items-center gap-3 px-3 py-3">
            <span aria-hidden className="grid h-10 w-10 place-items-center rounded-lg bg-area-laboral-tint text-area-laboral">
              <IconFileText size={20} aria-hidden />
            </span>
            <div className="flex-1">
              <div className="text-base font-semibold text-ink-primary">Tu CV</div>
              <div className="text-xs text-ink-subtle">Actualizado hace 3 días</div>
            </div>
          </li>
        </ul>
      </div>

      <h2 className="label-eyebrow">Catálogo de cursos</h2>
      <CourseList courses={courses} />
    </div>
  );
}
