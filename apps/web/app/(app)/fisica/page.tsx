import type { Metadata } from "next";
import Link from "next/link";
import { IconBolt } from "@tabler/icons-react";
import { requireUser } from "@/lib/auth";
import {
  getProfile,
  listRecentMoods,
  listAreaCourses,
  listUpcomingLiveClasses,
  listContinueWatching
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
  const [profile, recent, liveClasses, courses, cont] = await Promise.all([
    getProfile(client, userId),
    listRecentMoods(client, userId, 7),
    listUpcomingLiveClasses(client, userId, "fisica"),
    listAreaCourses(client, userId, "fisica"),
    listContinueWatching(client, userId, 6)
  ]);
  if (!profile) return null;

  const moodAvg =
    recent.length === 0
      ? null
      : Math.round((recent.reduce((a, m) => a + m.score, 0) / recent.length) * 10) / 10;
  const sparkBars = recent.map((m) => (m.score / 5) * 100);
  const continueFisica = cont.filter((c) => c.area === "fisica");
  const recommended = courses.filter((c) => !c.enrollment).slice(0, 8);

  return (
    <div className="flex flex-1 flex-col gap-5 px-5 py-5">
      <BackLink fallbackHref="/home" />
      <AreaHeader area="fisica" />

      {/* Las clases en directo son el foco visual de Física */}
      <LiveClassesSection classes={liveClasses} />

      {continueFisica.length > 0 && (
        <ContinueWatchingShelf courses={continueFisica} />
      )}

      <MetricGrid
        metrics={[
          {
            kind: "ring",
            label: "Pasos",
            value: "—",
            sub: "Conecta tu wearable para empezar",
            percent: 0,
            color: "#0F6E56"
          },
          {
            kind: "ring",
            label: "Sueño",
            value: "—",
            sub: "Manualmente o desde reloj",
            percent: 0,
            color: "#0F6E56"
          },
          {
            kind: "spark",
            label: "Ánimo medio",
            value: moodAvg !== null ? String(moodAvg) : "—",
            sub: "Últimos 7 días",
            bars: sparkBars,
            color: "#0F6E56"
          },
          {
            kind: "plain",
            label: "Racha",
            value: `${profile.day_in_program} días`,
            sub: "tu tiempo en el proceso"
          }
        ]}
      />

      <Link
        href="/aria?intent=breathing"
        className="block rounded-2xl bg-brand-600 p-4 text-ink-inverse active:opacity-90"
      >
        <div className="flex items-center gap-2">
          <IconBolt size={20} aria-hidden />
          <h2 className="text-md font-bold">¿Sientes ansiedad alta?</h2>
        </div>
        <p className="mt-2 text-base font-medium">
          Hagamos una respiración guiada de 2 minutos con Aria.
        </p>
        <span className="btn-white mt-3 inline-flex items-center justify-center text-area-fisica-text">
          Empezar ahora
        </span>
      </Link>

      <CourseShelf
        title="Mueve tu cuerpo, sin agobios"
        subtitle="Rutinas progresivas a tu ritmo"
        courses={recommended}
        emptyText="Pronto nuevas rutinas por aquí."
      />
    </div>
  );
}
