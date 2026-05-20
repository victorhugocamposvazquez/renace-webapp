import Link from "next/link";
import { IconBolt } from "@tabler/icons-react";
import type { MicroAction } from "@renace/core";

export function MicroActionCard({ action }: { action: MicroAction }) {
  return (
    <article className="card border-brand-200">
      <div className="flex items-center gap-2">
        <span
          aria-hidden
          className="grid h-9 w-9 place-items-center rounded-lg bg-brand-100 text-brand-600"
        >
          <IconBolt size={18} aria-hidden />
        </span>
        <p className="label-eyebrow text-brand-700">Acción de hoy</p>
      </div>
      <h2 className="mt-3 text-lg font-bold text-ink-primary">{action.title}</h2>
      <p className="mt-1 text-base text-ink-muted">{action.body}</p>
      <Link href={action.href} className="btn-primary mt-3 inline-flex items-center justify-center">
        {action.cta}
      </Link>
    </article>
  );
}
