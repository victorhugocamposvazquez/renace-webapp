import type { Metadata } from "next";
import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { listMilestones, seedDefaultMilestones } from "@renace/supabase";
import { DEFAULT_MILESTONES } from "@renace/core";
import { BackLink } from "@/components/BackLink";
import { MilestoneItem } from "@/components/recorrido/MilestoneItem";

export const metadata: Metadata = { title: "Recorrido · RENACE" };

export default async function RecorridoPage() {
  const { client, userId } = await requireUser();
  await seedDefaultMilestones(client, userId, DEFAULT_MILESTONES);
  const milestones = await listMilestones(client, userId);

  return (
    <div className="flex flex-1 flex-col gap-4 px-5 py-5">
      <BackLink />
      <header>
        <p className="label-eyebrow">Tu recorrido</p>
        <h1 className="mt-0.5 text-3xl font-bold tracking-tight text-ink-primary">
          De cero a estable
        </h1>
        <Link
          href="/recorrido/dias"
          className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-brand-700"
        >
          Ver histórico día a día
        </Link>
      </header>

      <div className="flex gap-2 overflow-x-auto pb-2">
        <span className="pill bg-brand-100 text-brand-700">Acompañar</span>
        <span className="pill bg-area-laboral-tint text-area-laboral-text">Seguir</span>
        <span className="pill bg-area-comunidad-tint text-area-comunidad-text">Rutina</span>
        <span className="pill bg-area-juridica-tint text-area-juridica-text">Reinsertar</span>
      </div>

      <ol role="list" className="mt-2">
        {milestones.map((m, i) => (
          <MilestoneItem
            key={m.id}
            milestone={m}
            isFirst={i === 0}
            isLast={i === milestones.length - 1}
          />
        ))}
      </ol>
    </div>
  );
}
