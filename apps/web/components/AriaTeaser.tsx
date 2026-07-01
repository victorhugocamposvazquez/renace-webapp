import Link from "next/link";
import { IconMessageHeart, IconArrowRight } from "@tabler/icons-react";

export function AriaTeaser({ intro }: { intro?: string }) {
  return (
    <Link
      href="/aria"
      className="group relative block overflow-hidden rounded-[24px] bg-brand-gradient p-5 text-ink-inverse shadow-brand-glow transition-all duration-200 ease-out-expo hover:brightness-105 active:scale-[0.99]"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-8 -top-12 h-40 w-40 rounded-full bg-white/15 blur-2xl"
      />
      <div className="relative flex items-center gap-3">
        <span
          aria-hidden
          className="grid h-12 w-12 place-items-center rounded-2xl bg-white/20 backdrop-blur-sm"
        >
          <IconMessageHeart size={22} aria-hidden stroke={2.2} />
        </span>
        <div className="flex-1">
          <div className="text-xs font-medium uppercase tracking-[0.14em] text-white/80">
            Estamos contigo
          </div>
          <div className="text-lg font-bold tracking-tight">Equipo RENACE</div>
        </div>
        <IconArrowRight
          size={20}
          aria-hidden
          className="transition-transform duration-200 group-hover:translate-x-1"
        />
      </div>
      <p className="relative mt-4 text-[15px] font-medium leading-relaxed text-white/95">
        {intro ??
          "¿Quieres hablar? Hay alguien del equipo listo para escucharte. No estás solo en ningún paso."}
      </p>
    </Link>
  );
}
