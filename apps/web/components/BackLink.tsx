import Link from "next/link";
import { IconArrowLeft } from "@tabler/icons-react";

export function BackLink({ href = "/home", label = "Volver" }: { href?: string; label?: string }) {
  return (
    <Link
      href={href}
      className="tap-target inline-flex items-center gap-1.5 self-start rounded-full border border-outline-soft bg-elevated px-3.5 py-2 text-sm font-semibold text-ink-secondary shadow-soft transition-transform duration-200 hover:text-ink-primary active:scale-[0.97]"
    >
      <IconArrowLeft size={16} aria-hidden stroke={2} /> {label}
    </Link>
  );
}
