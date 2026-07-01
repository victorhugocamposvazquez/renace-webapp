import type { Metadata } from "next";
import Link from "next/link";
import { IconBroadcast, IconCompass, IconSparkles } from "@tabler/icons-react";
import { requireUser } from "@/lib/auth";
import {
  listInProgressCourses,
  listAllUpcomingLiveClasses,
  listAllCourses
} from "@renace/supabase";
import type { AreaId } from "@renace/supabase";
import { AREA_LABEL, AREA_ORDER } from "@renace/core";
import { BackLink } from "@/components/BackLink";
import { CourseHubTabs, type CourseHubTab } from "@/components/cursos/CourseHubTabs";
import { CourseListCard } from "@/components/cursos/CourseListCard";
import { AreaCourseGroup } from "@/components/cursos/CourseListSection";
import { CourseAreaFilter } from "@/components/cursos/CourseAreaFilter";
import { LiveClassesSection } from "@/components/cursos/LiveClassesSection";

export const metadata: Metadata = { title: "Cursos · RENACE" };

type Props = {
  searchParams: Promise<{ tab?: string; area?: string }>;
};

const VALID_AREAS = new Set<string>(AREA_ORDER);

function parseTab(raw?: string): CourseHubTab {
  if (raw === "live" || raw === "catalog") return raw;
  return "mine";
}

function parseArea(raw?: string): AreaId | null {
  if (!raw || !VALID_AREAS.has(raw)) return null;
  return raw as AreaId;
}

export default async function CursosHubPage({ searchParams }: Props) {
  const sp = await searchParams;
  const tab = parseTab(sp.tab);
  const areaFilter = parseArea(sp.area);

  const { client, userId } = await requireUser();

  const [inProgress, liveClasses, catalog] = await Promise.all([
    listInProgressCourses(client, userId, 20),
    listAllUpcomingLiveClasses(client, userId, 20),
    listAllCourses(client, userId)
  ]);

  const filteredLive = areaFilter
    ? liveClasses.filter((c) => c.area === areaFilter)
    : liveClasses;
  const filteredCatalog = areaFilter
    ? catalog.filter((c) => c.area === areaFilter)
    : catalog;

  return (
    <div className="page-stack px-5 py-5">
      <BackLink fallbackHref="/home" />

      <header className="px-1 pt-1">
        <p className="label-eyebrow text-brand-700">Tu formación</p>
        <h1 className="display-title">Cursos</h1>
        <p className="mt-2 display-subtitle">
          Cada curso pertenece a un área de tu vida: laboral, emocional, física y más.
        </p>
      </header>

      <CourseHubTabs
        active={tab}
        counts={{
          mine: inProgress.length,
          live: liveClasses.length,
          catalog: catalog.length
        }}
      />

      {tab === "mine" && <TabMine courses={inProgress} liveClasses={liveClasses} />}
      {tab === "live" && (
        <>
          <CourseAreaFilter activeArea={areaFilter} tab="live" />
          <TabLive classes={filteredLive} />
        </>
      )}
      {tab === "catalog" && (
        <>
          <CourseAreaFilter activeArea={areaFilter} tab="catalog" />
          <TabCatalog courses={filteredCatalog} areaFilter={areaFilter} />
        </>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* TAB: en marcha — agrupado por área                                  */
/* ------------------------------------------------------------------ */

function TabMine({
  courses,
  liveClasses
}: {
  courses: import("@renace/supabase").CourseWithEnrollment[];
  liveClasses: import("@renace/supabase").CourseWithEnrollment[];
}) {
  const liveWithReminder = liveClasses.filter((c) => c.enrollment?.reminder_set);

  if (courses.length === 0 && liveWithReminder.length === 0) {
    return (
      <EmptyState
        icon={<IconSparkles size={20} aria-hidden />}
        title="Aún no tienes nada en marcha"
        description="Explora el catálogo por área — laboral, emocional o física — e inscríbete en tu primer curso."
        ctas={[
          { href: "/cursos?tab=catalog", label: "Ver catálogo" },
          { href: "/cursos?tab=live", label: "Clases en directo" }
        ]}
      />
    );
  }

  const byArea = groupByArea(courses);

  return (
    <div className="flex flex-col gap-6">
      {AREA_ORDER.map((area) => {
        const list = byArea.get(area);
        if (!list || list.length === 0) return null;
        return (
          <AreaCourseGroup key={area} area={area} courses={list} />
        );
      })}

      {liveWithReminder.length > 0 && (
        <LiveClassesSection
          classes={liveWithReminder}
          title="Recordatorios activos"
          subtitle="Clases en directo a las que te avisaremos."
        />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* TAB: en directo                                                     */
/* ------------------------------------------------------------------ */

function TabLive({
  classes
}: {
  classes: import("@renace/supabase").CourseWithEnrollment[];
}) {
  if (classes.length === 0) {
    return (
      <EmptyState
        icon={<IconBroadcast size={20} aria-hidden />}
        title="No hay clases programadas"
        description="Prueba quitando el filtro de área o vuelve más tarde."
        ctas={[{ href: "/cursos?tab=catalog", label: "Ver catálogo" }]}
      />
    );
  }
  return <LiveClassesSection classes={classes} />;
}

/* ------------------------------------------------------------------ */
/* TAB: catálogo                                                       */
/* ------------------------------------------------------------------ */

function TabCatalog({
  courses,
  areaFilter
}: {
  courses: import("@renace/supabase").CourseWithEnrollment[];
  areaFilter: AreaId | null;
}) {
  if (courses.length === 0) {
    return (
      <EmptyState
        icon={<IconCompass size={20} aria-hidden />}
        title={areaFilter ? `Sin cursos en ${AREA_LABEL[areaFilter]}` : "Catálogo en construcción"}
        description={
          areaFilter
            ? "Prueba otra área o vuelve pronto — estamos ampliando contenidos."
            : "Estamos preparando nuevos contenidos."
        }
        ctas={
          areaFilter
            ? [{ href: "/cursos?tab=catalog", label: "Ver todas las áreas" }]
            : undefined
        }
      />
    );
  }

  if (areaFilter) {
    return (
      <ul role="list" className="flex flex-col gap-2.5">
        {courses.map((c) => (
          <li key={c.id}>
            <CourseListCard course={c} />
          </li>
        ))}
      </ul>
    );
  }

  const byArea = groupByArea(courses);

  return (
    <div className="flex flex-col gap-6">
      {AREA_ORDER.map((area) => {
        const list = byArea.get(area);
        if (!list || list.length === 0) return null;
        return (
          <AreaCourseGroup
            key={area}
            area={area}
            courses={list}
            seeAllHref={`/cursos?tab=catalog&area=${area}`}
          />
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Agrupación por área                                                 */
/* ------------------------------------------------------------------ */

function groupByArea<T extends { area: AreaId }>(items: T[]): Map<AreaId, T[]> {
  const map = new Map<AreaId, T[]>();
  for (const item of items) {
    const list = map.get(item.area) ?? [];
    list.push(item);
    map.set(item.area, list);
  }
  return map;
}

function EmptyState({
  icon,
  title,
  description,
  ctas = []
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  ctas?: { href: string; label: string }[];
}) {
  return (
    <div className="rounded-[24px] border border-dashed border-outline-soft bg-canvas px-5 py-10 text-center">
      <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-brand-50 text-brand-700">
        {icon}
      </div>
      <p className="text-base font-bold text-ink-primary">{title}</p>
      <p className="mt-1 text-sm text-ink-subtle">{description}</p>
      {ctas.length > 0 && (
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {ctas.map((c) => (
            <Link key={c.href} href={c.href} className="btn-secondary w-auto px-4 py-2 text-sm">
              {c.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
