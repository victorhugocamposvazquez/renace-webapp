import type { Metadata } from "next";
import Link from "next/link";
import { IconFileText } from "@tabler/icons-react";
import { requireUser } from "@/lib/auth";
import {
  listJobOffers,
  listMyApplications,
  listAreaCourses,
  listInProgressCourses,
  listAreaProgress
} from "@renace/supabase";
import { laboralPhaseFromPercent } from "@renace/core";
import { AREA_THEMES } from "@renace/tokens";
import { BackLink } from "@/components/BackLink";
import { AreaHeader } from "@/components/AreaHeader";
import { OfferCard } from "@/components/laboral/OfferCard";
import { CourseListSection } from "@/components/cursos/CourseListSection";
import { ContinueWatchingList } from "@/components/cursos/ContinueWatchingList";

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
      <BackLink fallbackHref="/recuperacion" />
      <AreaHeader area="laboral" percent={laboralPercent} />

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
        <ContinueWatchingList
          courses={continueLaboral}
          subtitle="Tus cursos laborales activos"
          seeAllHref="/cursos?tab=catalog&area=laboral"
        />
      )}

      <CourseListSection
        title="Cursos para encontrar trabajo"
        subtitle="Salidas reales, hoy"
        courses={highDemand.length > 0 ? highDemand : recommended}
        seeAllHref="/cursos?tab=catalog&area=laboral"
        limit={5}
        accentColor={AREA_THEMES.laboral.core}
      />

      {transverse.length > 0 && (
        <CourseListSection
          title="Hábitos que sostienen"
          subtitle="Base transversal para cualquier empleo"
          courses={transverse}
          limit={5}
          accentColor={AREA_THEMES.laboral.core}
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
      <div className="card border-area-laboral-border p-4">
        <div className="flex items-start gap-3">
          <span
            aria-hidden
            className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-area-laboral-tint text-area-laboral"
          >
            <IconFileText size={20} aria-hidden />
          </span>
          <div>
            <p className="text-base font-semibold text-ink-primary">Prepara tu CV paso a paso</p>
            <p className="mt-1 text-sm text-ink-subtle">
              Avanza en el curso laboral para construir un perfil real. Por ahora puedes revisar
              ofertas y marcar las que te interesan.
            </p>
            <Link
              href="/cursos?tab=catalog&area=laboral"
              className="mt-3 inline-flex text-sm font-semibold text-area-laboral underline-offset-2 hover:underline"
            >
              Ver cursos laborales
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
