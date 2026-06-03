import type { Metadata } from "next";
import Link from "next/link";
import { IconBolt } from "@tabler/icons-react";
import { requireUser } from "@/lib/auth";
import {
  getProfile,
  listRecentMoods,
  listAreaCourses,
  listUpcomingLiveClasses,
  listInProgressCourses,
  listAreaProgress
} from "@renace/supabase";
import { BackLink } from "@/components/BackLink";
import { AreaHeader } from "@/components/AreaHeader";
import { MetricGrid } from "@/components/fisica/MetricGrid";
import { LiveClassesSection } from "@/components/cursos/LiveClassesSection";
import { CourseShelf } from "@/components/cursos/CourseShelf";
import { ContinueWatchingShelf } from "@/components/cursos/ContinueWatchingShelf";

export const metadata: Metadata = { title: "Física · RENACE" };

export default async function FisicaPage() {
  const { client, userId } = await requireUser();
  const [profile, recent, liveClasses, courses, inProgress, areaProgress] = await Promise.all([
    getProfile(client, userId),
    listRecentMoods(client, userId, 7),
    listUpcomingLiveClasses(client, userId, "fisica"),
    listAreaCourses(client, userId, "fisica"),
    listInProgressCourses(client, userId, 8),
    listAreaProgress(client, userId)
  ]);
  if (!profile) return null;
  const fisicaPercent = areaProgress.find((a) => a.area === "fisica")?.percent ?? 0;

  const moodAvg =
    recent.length === 0
      ? null
      : Math.round((recent.reduce((a, m) => a + m.score, 0) / recent.length) * 10) / 10;
  const sparkBars = recent.map((m) => (m.score / 5) * 100);
  const continueFisica = inProgress.filter((c) => c.area === "fisica");
  const recommended = courses.filter((c) => !c.enrollment).slice(0, 8);

  return (
    <div className="flex flex-1 flex-col gap-5 px-5 py-5">
      <BackLink fallbackHref="/home" />
      <AreaHeader area="fisica" percent={fisicaPercent} />

      {/* Las clases en directo son el foco visual de Física */}
      <LiveClassesSection classes={liveClasses} />

      {continueFisica.length > 0 && (
        <ContinueWatchingShelf
          courses={continueFisica}
          subtitle="Tus rutinas en marcha"
        />
      )}

      <MetricGrid
        metrics={[
          {
            kind: "plain",
            label: "Movimiento",
            value: "Regístralo",
            sub: "Marca la acción de paseo en Inicio"
          },
          {
            kind: "spark",
            label: "Ánimo medio",
            value: moodAvg !== null ? String(moodAvg) : "—",
            sub: "Últimos 7 días",
            bars: sparkBars,
            color: "#1B9E55"
          },
          {
            kind: "plain",
            label: "Racha",
            value: `${profile.day_in_program} días`,
            sub: "en tu camino"
          },
          {
            kind: "plain",
            label: "Respiración",
            value: "2 min",
            sub: "Con tu equipo si lo necesitas"
          }
        ]}
      />

      <Link
        href="/respira"
        className="block rounded-2xl bg-brand-600 p-4 text-ink-inverse active:opacity-90"
      >
        <div className="flex items-center gap-2">
          <IconBolt size={20} aria-hidden />
          <h2 className="text-md font-bold">¿Sientes ansiedad alta?</h2>
        </div>
        <p className="mt-2 text-base font-medium">
          Hagamos una respiración guiada de 2 minutos.
        </p>
        <span className="btn-white mt-3 inline-flex items-center justify-center text-area-fisica-text">
          Empezar ahora
        </span>
      </Link>

      <CourseShelf
        title="Mueve tu cuerpo, sin agobios"
        subtitle="Rutinas progresivas a tu ritmo"
        courses={recommended}
        seeAllHref="/cursos?tab=catalog"
        emptyText="Pronto nuevas rutinas por aquí."
      />
    </div>
  );
}
