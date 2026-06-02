import type { Metadata } from "next";
import { IconCheck, IconCompass, IconFileText } from "@tabler/icons-react";
import { requireUser } from "@/lib/auth";
import {
  listJobOffers,
  listMyApplications,
  listAreaCourses,
  listInProgressCourses,
  listAreaProgress
} from "@renace/supabase";
import { laboralPhaseFromPercent } from "@renace/core";
import { BackLink } from "@/components/BackLink";
import { AreaHeader } from "@/components/AreaHeader";
import { OfferCard } from "@/components/laboral/OfferCard";
import { CourseShelf } from "@/components/cursos/CourseShelf";
import { ContinueWatchingShelf } from "@/components/cursos/ContinueWatchingShelf";

export const metadata: Metadata = { title: "Laboral · RENACE" };

export default async function LaboralPage() {
  const { client, userId } = await requireUser();
  const [offers, apps, areaCourses, inProgress, areaProgress] = await Promise.all([
    listJobOffers(client, 6),
    listMyApplications(client, userId),
    listAreaCourses(client, userId, "laboral"),
    listInProgressCourses(client, userId, 8),
    listAreaProgress(client, userId)
  ]);
  const laboralPercent = areaProgress.find((a) => a.area === "laboral")?.percent ?? 0;
  const laboralPhase = laboralPhaseFromPercent(laboralPercent);
  const appliedSet = new Set(apps.map((a) => a.offer_id));
  const continueLaboral = inProgress.filter((c) => c.area === "laboral");

  const recommended = areaCourses.filter((c) => !c.enrollment).slice(0, 8);
  const transverse = areaCourses.filter((c) => c.demand === "transversal");
  const highDemand = areaCourses.filter((c) => c.demand === "muy_alta");

  return (
    <div className="page-stack px-5 py-5">
      <BackLink fallbackHref="/home" />
      <AreaHeader area="laboral" />

      <article className="card border-area-laboral-border">
        <div className="flex items-center justify-between">
          <div>
            <p className="label-eyebrow text-area-laboral-text">
              Fase {laboralPhase.phase} de 4
            </p>
            <p className="mt-0.5 text-base font-bold text-ink-primary">{laboralPhase.label}</p>
          </div>
          <div className="flex gap-1.5" aria-hidden>
            {[1, 2, 3, 4].map((n) => (
              <span
                key={n}
                className={
                  "h-1.5 w-6 rounded-full " +
                  (n <= laboralPhase.phase ? "bg-area-laboral" : "bg-outline-soft")
                }
              />
            ))}
          </div>
        </div>
        <p className="mt-2 text-xs text-ink-subtle">{laboralPhase.subtitle}</p>
      </article>

      {continueLaboral.length > 0 && (
        <ContinueWatchingShelf
          courses={continueLaboral}
          subtitle="Tus cursos laborales activos"
        />
      )}

      <CourseShelf
        title="Cursos para encontrar trabajo"
        subtitle="Salidas reales, hoy"
        courses={highDemand.length > 0 ? highDemand : recommended}
        seeAllHref="/cursos?tab=catalog"
      />

      {transverse.length > 0 && (
        <CourseShelf
          title="Hábitos que sostienen"
          subtitle="Base transversal para cualquier empleo"
          courses={transverse}
        />
      )}

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

      <h2 className="label-eyebrow">Tu CV</h2>
      <div className="card p-1.5">
        <ul role="list" className="divide-y divide-outline-soft">
          <li className="flex items-center gap-3 px-3 py-3">
            <span
              aria-hidden
              className="grid h-10 w-10 place-items-center rounded-lg bg-area-laboral-tint text-area-laboral"
            >
              <IconCompass size={20} aria-hidden />
            </span>
            <div className="flex-1">
              <div className="text-base font-semibold text-ink-primary">Orientación</div>
              <div className="text-xs text-ink-subtle">Perfil analizado</div>
            </div>
            <span
              aria-label="Hecho"
              className="grid h-7 w-7 place-items-center rounded-full bg-brand-600 text-ink-inverse"
            >
              <IconCheck size={16} aria-hidden />
            </span>
          </li>
          <li className="flex items-center gap-3 px-3 py-3">
            <span
              aria-hidden
              className="grid h-10 w-10 place-items-center rounded-lg bg-area-laboral-tint text-area-laboral"
            >
              <IconFileText size={20} aria-hidden />
            </span>
            <div className="flex-1">
              <div className="text-base font-semibold text-ink-primary">Tu CV</div>
              <div className="text-xs text-ink-subtle">Actualizado hace 3 días</div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}
