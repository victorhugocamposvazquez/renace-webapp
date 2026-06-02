"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { IconBolt, IconArrowRight, IconCheck } from "@tabler/icons-react";
import type { MicroAction } from "@renace/core";
import { completeMicroActionAction } from "@/app/(app)/home/actions";
import { CelebrationBurst } from "@/components/CelebrationBurst";

export function MicroActionCard({
  action,
  doneToday = false
}: {
  action: MicroAction;
  doneToday?: boolean;
}) {
  const [done, setDone] = useState(doneToday);
  const [celebrate, setCelebrate] = useState(false);
  const [isPending, startTransition] = useTransition();

  function markDone() {
    startTransition(async () => {
      const fd = new FormData();
      fd.set("actionId", action.id);
      fd.set("title", action.title);
      const res = await completeMicroActionAction(fd);
      if (res.ok) {
        setDone(true);
        if (!res.already) setCelebrate(true);
      }
    });
  }

  return (
    <>
      {celebrate && (
        <CelebrationBurst message="Acción completada. Sigue así." accent="#0FA065" />
      )}
      <article className="card-accent-left group relative overflow-hidden">
        <div className="relative flex items-start gap-3">
          <span
            aria-hidden
            className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-brand-gradient text-ink-inverse shadow-brand-glow"
          >
            <IconBolt size={20} aria-hidden />
          </span>
          <div className="min-w-0 flex-1">
            <p className="label-eyebrow text-brand-700">Acción de hoy</p>
            <h2 className="mt-1 text-lg font-bold tracking-tight text-ink-primary">
              {action.title}
            </h2>
            <p className="mt-1 text-[14px] leading-relaxed text-ink-muted">{action.body}</p>
          </div>
        </div>
        <div className="mt-4 flex flex-col gap-2">
          {done ? (
            <p
              role="status"
              className="btn-primary inline-flex w-full cursor-default items-center justify-center gap-2 bg-brand-600/90"
            >
              <IconCheck size={16} aria-hidden />
              Hecho hoy
            </p>
          ) : (
            <button
              type="button"
              className="btn-primary w-full"
              onClick={markDone}
              disabled={isPending}
            >
              {isPending ? "Guardando…" : "Hecho"}
            </button>
          )}
          <Link
            href={action.href}
            className="btn-secondary inline-flex w-full items-center justify-center gap-2 text-sm"
          >
            {action.cta}
            <IconArrowRight size={16} aria-hidden />
          </Link>
        </div>
      </article>
    </>
  );
}
