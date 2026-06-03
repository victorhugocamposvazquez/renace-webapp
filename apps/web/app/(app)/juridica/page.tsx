import type { Metadata } from "next";
import { requireUser } from "@/lib/auth";
import { getActiveLegalCase, listConsultRequests, listAreaProgress } from "@renace/supabase";
import { formatShortDateTime } from "@renace/core";
import { AREA_THEMES } from "@renace/tokens";
import { BackLink } from "@/components/BackLink";
import { AreaHeader } from "@/components/AreaHeader";
import { ConsultForm } from "@/components/juridica/ConsultForm";
import { ConsultList } from "@/components/juridica/ConsultList";

export const metadata: Metadata = { title: "Jurídica · RENACE" };

const CASE_STATUS_LABEL: Record<string, string> = {
  open: "Abierto",
  in_progress: "En revisión",
  closed: "Cerrado"
};

export default async function JuridicaPage() {
  const { client, userId } = await requireUser();
  const [activeCase, consults, areaProgress] = await Promise.all([
    getActiveLegalCase(client, userId),
    listConsultRequests(client, userId),
    listAreaProgress(client, userId)
  ]);
  const juridicaPercent = areaProgress.find((a) => a.area === "juridica")?.percent ?? 0;

  return (
    <div className="flex flex-1 flex-col gap-4 px-5 py-5">
      <BackLink fallbackHref="/home" />
      <AreaHeader area="juridica" percent={juridicaPercent} />

      {activeCase ? (
        <article
          className="rounded-3xl p-5 text-ink-inverse shadow-card"
          style={{
            background: `linear-gradient(135deg, ${AREA_THEMES.juridica.core} 0%, ${AREA_THEMES.juridica.coreDark} 100%)`
          }}
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-white/85">
                Tu expediente
              </p>
              <h2 className="mt-1 text-lg font-bold">{activeCase.title}</h2>
            </div>
            <span className="pill bg-white/20 text-white">
              {CASE_STATUS_LABEL[activeCase.status] ?? activeCase.status}
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

      <ConsultList consults={consults} />
    </div>
  );
}
