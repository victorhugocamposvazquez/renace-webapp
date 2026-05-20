import Link from "next/link";
import { IconArrowLeft } from "@tabler/icons-react";

export function BackLink({ href = "/home", label = "Volver" }: { href?: string; label?: string }) {
  return (
    <Link
      href={href}
      className="tap-target inline-flex items-center gap-1.5 self-start rounded-full border border-outline-medium bg-elevated px-3 py-2 text-sm font-semibold text-ink-primary"
    >
      <IconArrowLeft size={16} aria-hidden /> {label}
    </Link>
  );
}
