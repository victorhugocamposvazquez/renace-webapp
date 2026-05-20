import type { Metadata } from "next";
import { requireUser } from "@/lib/auth";
import { getActiveLegalCase, listConsultRequests } from "@renace/supabase";
import { formatShortDateTime, relativeFromNow } from "@renace/core";
import { BackLink } from "@/components/BackLink";
import { AreaHeader } from "@/components/AreaHeader";
import { ConsultForm } from "@/components/juridica/ConsultForm";

export const metadata: Metadata = { title: "Jurídica · RENACE" };

const STATUS_LABEL: Record<string, string> = {
  open: "Abierto",
  in_progress: "En curso",
  closed: "Cerrado",
  submitted: "Enviada",
  reviewing: "En revisión",
  scheduled: "Cita pendiente"
};

export default async function JuridicaPage() {
  const { client, userId } = await requireUser();
  const [activeCase, consults] = await Promise.all([
    getActiveLegalCase(client, userId),
    listConsultRequests(client, userId)
  ]);

  return (
    <div className="flex flex-1 flex-col gap-4 px-5 py-5">
      <BackLink />
      <AreaHeader area="juridica" />

      {activeCase ? (
        <article className="rounded-2xl p-4 text-ink-inverse" style={{ backgroundColor: "#1B6FC2" }}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-white/85">
                Caso abierto
              </p>
              <h2 className="mt-1 text-lg font-bold">{activeCase.title}</h2>
            </div>
            <span className="pill bg-white/20 text-white">
              {STATUS_LABEL[activeCase.status] ?? activeCase.status}
            </span>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 border-t border-white/25 pt-3">
            <div>
              <p className="text-xs font-semibold text-white/85">Próxima cita</p>
              <p className="mt-0.5 text-base font-bold">
                {activeCase.next_meeting_at
                  ? formatShortDateTime(new Date(activeCase.next_meeting_at))
                  : "Sin agendar"}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs font-semibold text-white/85">Abogado</p>
              <p className="mt-0.5 text-base font-bold">
                {activeCase.lawyer_name ?? "Por asignar"}
              </p>
            </div>
          </div>
        </article>
      ) : (
        <article className="card border-area-juridica-border">
          <p className="text-base font-semibold text-ink-primary">No tienes un caso abierto.</p>
          <p className="mt-1 text-sm text-ink-muted">
            Cuando envíes una consulta abriremos un expediente. Toda comunicación es confidencial.
          </p>
        </article>
      )}

      <ConsultForm />

      {consults.length > 0 && (
        <>
          <h2 className="label-eyebrow mt-2">Tus consultas</h2>
          <ul role="list" className="flex flex-col gap-2">
            {consults.map((c) => (
              <li
                key={c.id}
                className="card flex items-start gap-3 border-area-juridica-border"
              >
                <div className="flex-1">
                  <p className="text-sm font-semibold text-ink-primary">{c.body.slice(0, 80)}{c.body.length > 80 ? "…" : ""}</p>
                  <p className="mt-1 text-xs text-ink-subtle">
                    {relativeFromNow(new Date(c.created_at))}
                  </p>
                </div>
                <span className="pill bg-area-juridica-tint text-area-juridica-text">
                  {STATUS_LABEL[c.status] ?? c.status}
                </span>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
