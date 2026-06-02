import type { Metadata } from "next";
import Link from "next/link";
import {
  IconBookmark,
  IconBroadcast,
  IconCompass,
  IconSparkles
} from "@tabler/icons-react";
import { requireUser } from "@/lib/auth";
import {
  listInProgressCourses,
  listAllUpcomingLiveClasses,
  listAllCourses
} from "@renace/supabase";
import type { AreaId } from "@renace/supabase";
import { AREA_LABEL, AREA_ORDER } from "@renace/core";
import { BackLink } from "@/components/BackLink";
import { ContinueWatchingShelf } from "@/components/cursos/ContinueWatchingShelf";
import { CourseShelf } from "@/components/cursos/CourseShelf";
import { LiveClassesSection } from "@/components/cursos/LiveClassesSection";

export const metadata: Metadata = { title: "Cursos · RENACE" };

type Tab = "mine" | "live" | "catalog";
type Props = { searchParams: Promise<{ tab?: string }> };

const TABS: { id: Tab; label: string; icon: typeof IconBookmark }[] = [
  { id: "mine", label: "En marcha", icon: IconBookmark },
  { id: "live", label: "En directo", icon: IconBroadcast },
  { id: "catalog", label: "Catálogo", icon: IconCompass }
];

export default async function CursosHubPage({ searchParams }: Props) {
  const sp = await searchParams;
  const tab: Tab =
    sp.tab === "live" || sp.tab === "catalog" ? sp.tab : "mine";

  const { client, userId } = await requireUser();

  // Cargamos todo en paralelo: tabs son ligeros y permite saber si están vacíos
  // para mostrar badges/empty states adecuados.
  const [inProgress, liveClasses, catalog] = await Promise.all([
    listInProgressCourses(client, userId, 20),
    listAllUpcomingLiveClasses(client, userId, 20),
    listAllCourses(client, userId)
  ]);

  return (
    <div className="page-stack px-5 py-5">
      <BackLink fallbackHref="/home" />

      <header>
        <p className="label-eyebrow">Tu formación</p>
        <h1 className="mt-1 text-2xl font-bold text-ink-primary">Cursos</h1>
        <p className="mt-1 text-sm text-ink-subtle">
          Aprende a tu ritmo, únete a clases en directo y construye tu plan.
        </p>
      </header>

      {/* Tabs (segmented control) */}
      <nav
        aria-label="Filtros de cursos"
        className="-mx-5 overflow-x-auto px-5"
      >
        <ul role="list" className="flex gap-2">
          {TABS.map((t) => {
            const active = t.id === tab;
            const count =
              t.id === "mine"
                ? inProgress.length
                : t.id === "live"
                  ? liveClasses.length
                  : catalog.length;
            const Icon = t.icon;
            return (
              <li key={t.id}>
                <Link
                  href={t.id === "mine" ? "/cursos" : `/cursos?tab=${t.id}`}
                  scroll={false}
                  aria-current={active ? "page" : undefined}
                  className={
                    "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-semibold transition " +
                    (active
                      ? "border-transparent bg-ink-primary text-ink-inverse"
                      : "border-outline-soft bg-surface text-ink-secondary")
                  }
                >
                  <Icon size={14} aria-hidden />
                  <span>{t.label}</span>
                  {count > 0 && (
                    <span
                      className={
                        "ml-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold " +
                        (active
                          ? "bg-white/20 text-ink-inverse"
                          : "bg-outline-soft text-ink-secondary")
                      }
                    >
                      {count}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {tab === "mine" && (
        <TabMine inProgress={inProgress} liveClasses={liveClasses} />
      )}
      {tab === "live" && <TabLive classes={liveClasses} />}
      {tab === "catalog" && <TabCatalog courses={catalog} />}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* TAB: en marcha                                                      */
/* ------------------------------------------------------------------ */

function TabMine({
  inProgress,
  liveClasses
}: {
  inProgress: import("@renace/supabase").CourseWithEnrollment[];
  liveClasses: import("@renace/supabase").CourseWithEnrollment[];
}) {
  const liveWithReminder = liveClasses.filter((c) => c.enrollment?.reminder_set);
  if (inProgress.length === 0 && liveWithReminder.length === 0) {
    return (
      <EmptyState
        icon={<IconSparkles size={20} aria-hidden />}
        title="Aún no tienes nada en marcha"
        description="Echa un vistazo al catálogo o a las clases en directo. Cuando empieces algo, lo verás aquí."
        ctas={[
          { href: "/cursos?tab=catalog", label: "Explorar catálogo" },
          { href: "/cursos?tab=live", label: "Ver en directo" }
        ]}
      />
    );
  }
  return (
    <div className="flex flex-col gap-6">
      {inProgress.length > 0 && (
        <ContinueWatchingShelf
          courses={inProgress}
          subtitle="Tus cursos activos en cualquier área"
        />
      )}
      {liveWithReminder.length > 0 && (
        <LiveClassesSection
          classes={liveWithReminder}
          title="Tus clases con recordatorio"
          subtitle="Te avisaremos cuando empiecen."
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
        description="Cuando programemos nuevas sesiones en vivo, aparecerán aquí."
      />
    );
  }
  return <LiveClassesSection classes={classes} />;
}

/* ------------------------------------------------------------------ */
/* TAB: catálogo                                                       */
/* ------------------------------------------------------------------ */

function TabCatalog({
  courses
}: {
  courses: import("@renace/supabase").CourseWithEnrollment[];
}) {
  if (courses.length === 0) {
    return (
      <EmptyState
        icon={<IconCompass size={20} aria-hidden />}
        title="Catálogo en construcción"
        description="Estamos preparando contenidos. Vuelve en unos días."
      />
    );
  }

  // Group by area
  const byArea = new Map<AreaId, typeof courses>();
  for (const c of courses) {
    const list = byArea.get(c.area) ?? [];
    list.push(c);
    byArea.set(c.area, list);
  }

  return (
    <div className="-mx-5 flex flex-col gap-6">
      {AREA_ORDER.map((area) => {
        const list = byArea.get(area);
        if (!list || list.length === 0) return null;
        return (
          <CourseShelf
            key={area}
            title={AREA_LABEL[area]}
            subtitle={`${list.length} curso${list.length === 1 ? "" : "s"}`}
            courses={list}
          />
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Empty state                                                         */
/* ------------------------------------------------------------------ */

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
    <div className="rounded-3xl border border-dashed border-outline-soft bg-surface px-5 py-10 text-center">
      <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-full bg-brand-50 text-brand-700">
        {icon}
      </div>
      <p className="text-base font-bold text-ink-primary">{title}</p>
      <p className="mt-1 text-sm text-ink-subtle">{description}</p>
      {ctas.length > 0 && (
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {ctas.map((c) => (
            <Link
              key={c.href}
              href={c.href}
              className="inline-flex items-center gap-1.5 rounded-full bg-ink-primary px-3.5 py-2 text-sm font-bold text-ink-inverse active:scale-95"
            >
              {c.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
