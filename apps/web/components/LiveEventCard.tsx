import Link from "next/link";
import { IconVideo } from "@tabler/icons-react";
import type { LiveEventWithAttendance } from "@renace/supabase";
import { formatShortDateTime } from "@renace/core";

export function LiveEventCard({
  event,
  accent = "#5A4FB8"
}: {
  event: LiveEventWithAttendance;
  accent?: string;
}) {
  return (
    <Link
      href="/comunidad"
      className="block rounded-2xl p-4 text-ink-inverse active:opacity-90"
      style={{ backgroundColor: accent }}
    >
      <div className="flex items-center gap-3">
        <span
          aria-hidden
          className="grid h-11 w-11 place-items-center rounded-xl bg-white/20"
        >
          <IconVideo size={22} aria-hidden />
        </span>
        <div className="flex-1">
          <div className="text-md font-bold leading-tight">{event.title}</div>
          <div className="text-xs font-medium text-white/85">
            {formatShortDateTime(new Date(event.starts_at))} · {event.attendees} apuntados
          </div>
        </div>
      </div>
    </Link>
  );
}
