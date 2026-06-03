import Link from "next/link";
import {
  IconPhone,
  IconWind,
  IconSparkles,
  IconArrowLeft
} from "@tabler/icons-react";
import { requireUser } from "@/lib/auth";
import { listTrustedContacts } from "@renace/supabase";
import { BackLink } from "@/components/BackLink";

export const metadata = { title: "Apoyo ahora · RENACE" };

export default async function CrisisPage() {
  const { client, userId } = await requireUser();
  const contacts = await listTrustedContacts(client, userId);
  const first = contacts[0] ?? null;

  return (
    <div className="page-stack min-h-[100dvh] px-5 py-5">
      <BackLink fallbackHref="/home" label="Volver" />

      <header className="mt-2 text-center">
        <p className="label-eyebrow text-brand-700">Estás a salvo aquí</p>
        <h1 className="display-title">Modo apoyo</h1>
        <p className="mt-2 display-subtitle">
          Sin distracciones. Elige una acción pequeña ahora mismo.
        </p>
      </header>

      <div className="flex flex-1 flex-col gap-3">
        <Link href="/respira" className="card-interactive flex items-center gap-4 p-4">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-gradient text-ink-inverse">
            <IconWind size={22} aria-hidden />
          </span>
          <div>
            <p className="font-bold text-ink-primary">Respirar 2 minutos</p>
            <p className="text-sm text-ink-muted">Ejercicio guiado 4-7-8</p>
          </div>
        </Link>

        {first ? (
          <a
            href={`tel:${first.phone.replace(/\s/g, "")}`}
            className="card-interactive flex items-center gap-4 p-4"
          >
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-area-emocional text-ink-inverse">
              <IconPhone size={22} aria-hidden />
            </span>
            <div>
              <p className="font-bold text-ink-primary">Llamar a {first.name}</p>
              <p className="text-sm text-ink-muted">{first.relation ?? "Contacto de confianza"}</p>
            </div>
          </a>
        ) : (
          <Link href="/perfil#trusted" className="card-interactive flex items-center gap-4 p-4">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-area-emocional text-ink-inverse">
              <IconPhone size={22} aria-hidden />
            </span>
            <div>
              <p className="font-bold text-ink-primary">Añadir contacto de confianza</p>
              <p className="text-sm text-ink-muted">Para cuando lo necesites</p>
            </div>
          </Link>
        )}

        <Link href="/aria" className="card-interactive flex items-center gap-4 p-4">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-accent-gradient text-ink-inverse">
            <IconSparkles size={22} aria-hidden />
          </span>
          <div>
            <p className="font-bold text-ink-primary">Hablar con Aria</p>
            <p className="text-sm text-ink-muted">Te escucha sin juzgar</p>
          </div>
        </Link>

        <a
          href="tel:024"
          className="rounded-2xl border border-state-danger/30 bg-state-danger/5 px-4 py-4 text-center"
        >
          <p className="text-sm font-bold text-state-danger">Emergencia · 024</p>
          <p className="mt-1 text-xs text-ink-muted">Línea de atención a la conducta suicida · 24 h, gratuita (España)</p>
        </a>
      </div>

      <Link href="/home" className="btn-secondary mt-4 inline-flex items-center justify-center gap-2">
        <IconArrowLeft size={16} aria-hidden />
        Volver al inicio
      </Link>
    </div>
  );
}
