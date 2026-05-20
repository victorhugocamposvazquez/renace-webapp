import type { Metadata } from "next";
import Link from "next/link";
import {
  IconBarbell,
  IconSalad,
  IconYoga,
  IconDeviceWatch,
  IconBolt
} from "@tabler/icons-react";
import { requireUser } from "@/lib/auth";
import { getProfile, listRecentMoods } from "@renace/supabase";
import { BackLink } from "@/components/BackLink";
import { AreaHeader } from "@/components/AreaHeader";
import { MetricGrid } from "@/components/fisica/MetricGrid";

export const metadata: Metadata = { title: "Física · RENACE" };

const PLAN = [
  { id: "deporte", label: "Deporte", subtitle: "4 sesiones / semana", icon: IconBarbell, badge: "Activo" },
  { id: "nutricion", label: "Nutrición", subtitle: "Plan personalizado", icon: IconSalad },
  { id: "antiansiedad", label: "Anti-ansiedad", subtitle: "Rutinas guiadas", icon: IconYoga },
  { id: "smartwatch", label: "Smartwatch", subtitle: "Sincroniza pasos y sueño", icon: IconDeviceWatch, badge: "Conectar" }
];

export default async function FisicaPage() {
  const { client, userId } = await requireUser();
  const [profile, recent] = await Promise.all([
    getProfile(client, userId),
    listRecentMoods(client, userId, 7)
  ]);
  if (!profile) return null;

  const moodAvg =
    recent.length === 0
      ? null
      : Math.round((recent.reduce((a, m) => a + m.score, 0) / recent.length) * 10) / 10;

  const sparkBars = recent.map((m) => (m.score / 5) * 100);

  return (
    <div className="flex flex-1 flex-col gap-4 px-5 py-5">
      <BackLink />
      <AreaHeader area="fisica" />

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
        <p className="mt-2 text-base font-medium">Hagamos una respiración guiada de 2 minutos con Aria.</p>
        <span className="btn-white mt-3 inline-flex items-center justify-center text-area-fisica-text">
          Empezar ahora
        </span>
      </Link>

      <h2 className="label-eyebrow">Tu plan</h2>
      <div className="card p-1.5">
        <ul role="list" className="divide-y divide-outline-soft">
          {PLAN.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id} className="flex items-center gap-3 px-3 py-3">
                <span
                  aria-hidden
                  className="grid h-10 w-10 place-items-center rounded-lg bg-area-fisica-tint text-area-fisica"
                >
                  <Icon size={20} aria-hidden />
                </span>
                <div className="flex-1">
                  <div className="text-base font-semibold text-ink-primary">{item.label}</div>
                  <div className="text-xs text-ink-subtle">{item.subtitle}</div>
                </div>
                {item.badge && (
                  <span className="pill bg-area-fisica-tint text-area-fisica-text">{item.badge}</span>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
