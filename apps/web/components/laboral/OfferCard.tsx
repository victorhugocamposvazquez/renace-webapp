"use client";

import { useTransition } from "react";
import { IconClock } from "@tabler/icons-react";
import type { JobOffer } from "@renace/supabase";
import { markInterestedAction } from "@/app/(app)/laboral/actions";

export function OfferCard({
  offer,
  applied
}: {
  offer: JobOffer;
  applied: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const matchColor = offer.match_score >= 85 ? "#0F6E56" : offer.match_score >= 70 ? "#B47119" : "#5C6759";

  function mark() {
    if (applied) return;
    startTransition(async () => {
      const fd = new FormData();
      fd.set("offerId", offer.id);
      await markInterestedAction(fd);
    });
  }

  return (
    <article className="card flex flex-col gap-3 border-area-laboral-border">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-ink-primary">{offer.title}</h3>
          <p className="mt-1 text-xs text-ink-subtle">
            {offer.company} · {offer.location}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xl font-bold" style={{ color: matchColor }}>
            {offer.match_score}%
          </p>
          <p className="text-xs text-ink-subtle">match</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5">
        <span className="pill bg-canvas text-ink-secondary">
          <IconClock size={12} aria-hidden /> {offer.schedule?.replace(/_/g, " ") ?? "Sin horario"}
        </span>
        {offer.partner_company && (
          <span className="pill bg-area-laboral-tint text-area-laboral-text">
            Empresa asociada
          </span>
        )}
      </div>
      <button
        type="button"
        onClick={mark}
        disabled={isPending || applied}
        className={
          applied
            ? "btn-secondary"
            : "btn-primary"
        }
        style={!applied ? { backgroundColor: "#B47119" } : undefined}
      >
        {applied ? "Apuntado ✓" : isPending ? "Guardando…" : "Me interesa"}
      </button>
    </article>
  );
}
