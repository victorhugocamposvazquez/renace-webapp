import type { Metadata } from "next";
import Link from "next/link";
import { requireUser } from "@/lib/auth";
import {
  getProfile,
  listAreaProgress,
  listTrustedContacts,
  fillAllAreas,
  listRecentMoods,
  listActiveDates
} from "@renace/supabase";
import { weekFromDay, computePresenceStreak, streakLabel, todayDateString } from "@renace/core";
import { BackLink } from "@/components/BackLink";
import { AreaRingsGrid } from "@/components/perfil/AreaRingsGrid";
import { TrustedContactsManager } from "@/components/perfil/TrustedContactsManager";
import { SignOutButton } from "@/components/perfil/SignOutButton";
import { MoodWeekChart } from "@/components/perfil/MoodWeekChart";

export const metadata: Metadata = { title: "Perfil · RENACE" };

export default async function PerfilPage() {
  const { client, userId } = await requireUser();
  const [profile, rawAreas, contacts, moods, activeDates] = await Promise.all([
    getProfile(client, userId),
    listAreaProgress(client, userId),
    listTrustedContacts(client, userId),
    listRecentMoods(client, userId, 14),
    listActiveDates(client, userId, 60)
  ]);
  if (!profile) return null;
  const areas = fillAllAreas(rawAreas, userId);
  const week = weekFromDay(profile.day_in_program);
  const streak = computePresenceStreak(activeDates, todayDateString());
  const streakText = streakLabel(streak, profile.onboarding_reasons ?? []);

  return (
    <div className="page-stack px-5 py-5">
      <BackLink />

      <header className="flex flex-col items-center gap-2 pt-2 text-center">
        <div
          aria-hidden
          className="grid h-24 w-24 place-items-center rounded-full bg-brand-600 text-3xl font-bold text-ink-inverse ring-4 ring-elevated ring-offset-2 ring-offset-outline-medium"
        >
          {profile.alias.slice(0, 1).toUpperCase()}
        </div>
        <h1 className="text-xl font-bold tracking-tight text-ink-primary">
          {profile.alias}
        </h1>
        <p className="text-sm text-ink-muted">
          {profile.city ? `${profile.city} · ` : ""}Día {profile.day_in_program} · semana {week}
        </p>
        <div className="mt-1 flex flex-wrap justify-center gap-2">
          <span className="pill bg-brand-100 text-brand-700">Día {profile.day_in_program}</span>
          <span className="pill bg-brand-50 text-brand-800">{streakText}</span>
          {profile.is_mentor && (
            <span className="pill bg-area-comunidad-tint text-area-comunidad-text">Mentor</span>
          )}
        </div>
      </header>

      <h2 className="label-eyebrow mt-2">Tu perfil 360°</h2>
      <AreaRingsGrid progress={areas} />

      <h2 className="label-eyebrow mt-2">Tu semana</h2>
      <MoodWeekChart moods={moods} />

      <Link
        href="/recorrido"
        className="card flex items-center justify-between px-4 py-3 text-sm font-bold text-ink-primary active:scale-[0.99]"
      >
        Ver tu recorrido completo
        <span className="text-ink-subtle" aria-hidden>→</span>
      </Link>

      <h2 className="label-eyebrow mt-2">Tus contactos</h2>
      <TrustedContactsManager contacts={contacts} />

      <h2 className="label-eyebrow mt-2">Ajustes</h2>
      <div className="card p-1.5">
        <ul role="list" className="divide-y divide-outline-soft">
          <li className="px-3 py-3">
            <SignOutButton />
          </li>
        </ul>
      </div>
    </div>
  );
}
