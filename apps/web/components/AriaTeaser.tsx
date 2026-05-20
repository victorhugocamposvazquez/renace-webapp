import Link from "next/link";
import { IconSparkles, IconArrowRight } from "@tabler/icons-react";

export function AriaTeaser({
  ariaName,
  intro
}: {
  ariaName: string;
  intro: string;
}) {
  return (
    <Link
      href="/aria"
      className="block rounded-2xl bg-brand-600 p-4 text-ink-inverse active:opacity-90"
    >
      <div className="flex items-center gap-3">
        <span
          aria-hidden
          className="grid h-11 w-11 place-items-center rounded-xl bg-white/20"
        >
          <IconSparkles size={22} aria-hidden />
        </span>
        <div className="flex-1">
          <div className="text-md font-bold">{ariaName}</div>
          <div className="text-xs font-medium text-white/85">Tu acompañante</div>
        </div>
        <IconArrowRight size={20} aria-hidden />
      </div>
      <p className="mt-3 text-base font-medium leading-relaxed">{intro}</p>
    </Link>
  );
}
