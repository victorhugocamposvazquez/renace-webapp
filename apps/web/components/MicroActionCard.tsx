import Link from "next/link";
import { IconBolt, IconArrowRight } from "@tabler/icons-react";
import type { MicroAction } from "@renace/core";

export function MicroActionCard({ action }: { action: MicroAction }) {
  return (
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
      <Link
        href={action.href}
        className="btn-primary mt-4 inline-flex w-full items-center justify-center gap-2"
      >
        {action.cta}
        <IconArrowRight size={16} aria-hidden />
      </Link>
    </article>
  );
}
