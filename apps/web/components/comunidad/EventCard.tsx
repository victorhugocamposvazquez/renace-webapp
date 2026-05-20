"use client";

import { useState, useTransition } from "react";
import { IconVideo } from "@tabler/icons-react";
import type { LiveEventWithAttendance } from "@renace/supabase";
import { formatShortDateTime } from "@renace/core";
import { toggleAttendanceAction } from "@/app/(app)/comunidad/actions";

export function EventCard({ event }: { event: LiveEventWithAttendance }) {
  const [attending, setAttending] = useState(event.attending);
  const [count, setCount] = useState(event.attendees);
  const [isPending, startTransition] = useTransition();

  function toggle() {
    const next = !attending;
    setAttending(next);
    setCount((c) => c + (next ? 1 : -1));
    startTransition(async () => {
      const fd = new FormData();
      fd.set("eventId", event.id);
      const result = await toggleAttendanceAction(fd);
      if (!result.ok) {
        setAttending(!next);
        setCount((c) => c + (next ? -1 : 1));
      }
    });
  }

  return (
    <article
      className="rounded-2xl p-4 text-ink-inverse"
      style={{ backgroundColor: "#5A4FB8" }}
    >
      <div className="flex items-center gap-3">
        <span
          aria-hidden
          className="grid h-11 w-11 place-items-center rounded-xl bg-white/20"
        >
          <IconVideo size={22} aria-hidden />
        </span>
        <div className="flex-1">
          <h3 className="text-md font-bold leading-tight">{event.title}</h3>
          <p className="text-xs font-medium text-white/85">
            {formatShortDateTime(new Date(event.starts_at))} · {count} apuntados
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={toggle}
        disabled={isPending}
        className="btn-white mt-3"
        style={{ color: "#5A4FB8" }}
      >
        {attending ? "Apuntado ✓" : "Apuntarme"}
      </button>
    </article>
  );
}
