"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { IconBellRinging, IconCalendarTime } from "@tabler/icons-react";
import { toggleClassReminderAction } from "@/app/(app)/cursos/actions";

export function ReminderToggleForm({
  courseId,
  initial,
  accent
}: {
  courseId: string;
  initial: boolean;
  accent: string;
}) {
  const router = useRouter();
  const [active, setActive] = useState(initial);
  const [pending, startTransition] = useTransition();

  function onClick() {
    const next = !active;
    setActive(next);
    startTransition(async () => {
      const fd = new FormData();
      fd.set("courseId", courseId);
      const res = await toggleClassReminderAction(undefined, fd);
      if (res && "error" in res) {
        setActive(!next);
      } else {
        router.refresh();
      }
    });
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={pending}
      aria-pressed={active}
      className="btn-primary"
      style={active ? { background: accent } : { background: "#1F1F23" }}
    >
      {active ? (
        <>
          <IconBellRinging size={16} aria-hidden />
          <span>Recordatorio activo</span>
        </>
      ) : (
        <>
          <IconCalendarTime size={16} aria-hidden />
          <span>Recordarme cuando empiece</span>
        </>
      )}
    </button>
  );
}
