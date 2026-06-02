import Link from "next/link";
import { IconChevronRight } from "@tabler/icons-react";

export function SectionHeader({
  title,
  subtitle,
  href,
  linkLabel = "Ver todo"
}: {
  title: string;
  subtitle?: string;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <header className="flex items-end justify-between gap-3">
      <div className="min-w-0">
        <h2 className="text-[17px] font-bold tracking-tight text-ink-primary">{title}</h2>
        {subtitle && (
          <p className="mt-0.5 text-[13px] leading-snug text-ink-muted">{subtitle}</p>
        )}
      </div>
      {href && (
        <Link
          href={href}
          className="group inline-flex shrink-0 items-center gap-0.5 text-[13px] font-semibold text-brand-700"
        >
          {linkLabel}
          <IconChevronRight
            size={14}
            aria-hidden
            className="transition-transform group-hover:translate-x-0.5"
          />
        </Link>
      )}
    </header>
  );
}
