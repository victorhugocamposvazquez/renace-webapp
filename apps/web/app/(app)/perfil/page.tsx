import type { Metadata } from "next";
import {
  IconBell,
  IconShieldLock,
  IconDeviceWatch,
  IconLogout
} from "@tabler/icons-react";
import { requireUser } from "@/lib/auth";
import {
  getProfile,
  listAreaProgress,
  listTrustedContacts,
  fillAllAreas
} from "@renace/supabase";
import { weekFromDay } from "@renace/core";
import { BackLink } from "@/components/BackLink";
import { AreaRingsGrid } from "@/components/perfil/AreaRingsGrid";
import { TrustedContactsManager } from "@/components/perfil/TrustedContactsManager";
import { signOutAction } from "./actions";

export const metadata: Metadata = { title: "Perfil · RENACE" };

export default async function PerfilPage() {
  const { client, userId } = await requireUser();
  const [profile, rawAreas, contacts] = await Promise.all([
    getProfile(client, userId),
    listAreaProgress(client, userId),
    listTrustedContacts(client, userId)
  ]);
  if (!profile) return null;
  const areas = fillAllAreas(rawAreas, userId);
  const week = weekFromDay(profile.day_in_program);

  return (
    <div className="flex flex-1 flex-col gap-4 px-5 py-5">
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
        <div className="mt-1 flex gap-2">
          <span className="pill bg-brand-100 text-brand-700">Día {profile.day_in_program}</span>
          {profile.is_mentor && (
            <span className="pill bg-area-comunidad-tint text-area-comunidad-text">Mentor</span>
          )}
        </div>
      </header>

      <h2 className="label-eyebrow mt-2">Tu perfil 360°</h2>
      <AreaRingsGrid progress={areas} />

      <h2 className="label-eyebrow mt-2">Tus contactos</h2>
      <TrustedContactsManager contacts={contacts} />

      <h2 className="label-eyebrow mt-2">Ajustes</h2>
      <div className="card p-1.5">
        <ul role="list" className="divide-y divide-outline-soft">
          <li id="notifications" className="flex items-center gap-3 px-3 py-3">
            <IconBell size={22} aria-hidden className="text-ink-secondary" />
            <div className="flex-1 text-base font-semibold text-ink-primary">Notificaciones</div>
            <span className="pill bg-canvas text-ink-subtle">Pronto</span>
          </li>
          <li className="flex items-center gap-3 px-3 py-3">
            <IconShieldLock size={22} aria-hidden className="text-ink-secondary" />
            <div className="flex-1 text-base font-semibold text-ink-primary">Privacidad</div>
            <span className="pill bg-canvas text-ink-subtle">Pronto</span>
          </li>
          <li id="smartwatch" className="flex items-center gap-3 px-3 py-3">
            <IconDeviceWatch size={22} aria-hidden className="text-ink-secondary" />
            <div className="flex-1 text-base font-semibold text-ink-primary">Smartwatch</div>
            <span className="pill bg-canvas text-ink-subtle">Sin conectar</span>
          </li>
          <li className="px-3 py-3">
            <form action={signOutAction}>
              <button
                type="submit"
                className="tap-target flex w-full items-center justify-between gap-3 text-base font-semibold text-state-danger"
              >
                <span className="inline-flex items-center gap-3">
                  <IconLogout size={22} aria-hidden />
                  Cerrar sesión
                </span>
              </button>
            </form>
          </li>
        </ul>
      </div>
    </div>
  );
}
