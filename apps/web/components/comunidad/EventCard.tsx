"use client";

import { useState, useTransition } from "react";
import { IconVideo, IconLogout2 } from "@tabler/icons-react";
import type { LiveEventWithAttendance } from "@renace/supabase";
import { formatShortDateTime } from "@renace/core";
import { toggleAttendanceAction } from "@/app/(app)/comunidad/actions";
import { ConfirmModal } from "@/components/ConfirmModal";

export function EventCard({ event }: { event: LiveEventWithAttendance }) {
  const [attending, setAttending] = useState(event.attending);
  const [count, setCount] = useState(event.attendees);
  const [confirmLeave, setConfirmLeave] = useState(false);
  const [isPending, startTransition] = useTransition();

  function setAttendance(next: boolean) {
    const prev = attending;
    setAttending(next);
    setCount((c) => c + (next ? 1 : -1));
    startTransition(async () => {
      const fd = new FormData();
      fd.set("eventId", event.id);
      const result = await toggleAttendanceAction(fd);
      if (!result.ok) {
        setAttending(prev);
        setCount((c) => c + (next ? -1 : 1));
      }
    });
  }

  function handleClick() {
    if (attending) {
      // Si ya está apuntado, pedimos confirmación para desapuntarse.
      setConfirmLeave(true);
    } else {
      // Apuntarse es positivo: sin confirmación.
      setAttendance(true);
    }
  }

  return (
    <article
      className="rounded-3xl p-5 text-ink-inverse shadow-card"
      style={{ background: "linear-gradient(135deg, #6F4FE8 0%, #5A4FB8 100%)" }}
    >
      <div className="flex items-center gap-3">
        <span
          aria-hidden
          className="grid h-11 w-11 place-items-center rounded-2xl bg-white/20 backdrop-blur-sm"
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
        onClick={handleClick}
        disabled={isPending}
        className="btn-white mt-3"
        style={{ color: "#5A3DCC" }}
      >
        {attending ? "Apuntado ✓" : "Apuntarme"}
      </button>

      <ConfirmModal
        open={confirmLeave}
        onCancel={() => !isPending && setConfirmLeave(false)}
        onConfirm={() => {
          setAttendance(false);
          setConfirmLeave(false);
        }}
        busy={isPending}
        tone="danger"
        icon={<IconLogout2 size={22} stroke={2.2} aria-hidden />}
        title="¿Desapuntarte del evento?"
        description={
          <>
            <p>
              <strong className="font-semibold text-ink-primary">{event.title}</strong> —{" "}
              {formatShortDateTime(new Date(event.starts_at))}.
            </p>
            <p className="mt-2 text-ink-subtle">
              Si cambias de opinión puedes volver a apuntarte mientras haya plaza.
            </p>
          </>
        }
        confirmLabel="Sí, desapuntarme"
        cancelLabel="Quedarme"
      />
    </article>
  );
}
