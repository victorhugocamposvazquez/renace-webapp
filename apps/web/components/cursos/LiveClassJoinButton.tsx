"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { IconBellRinging, IconCalendarTime } from "@tabler/icons-react";
import { toggleClassReminderAction } from "@/app/(app)/cursos/actions";

/** Recordatorio honesto para clases en directo (sin sala demo). */
export function LiveClassJoinButton({
  courseId,
  accent,
  label,
  initialReminder = false
}: {
  courseId: string;
  accent: string;
  label: string;
  initialReminder?: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [reminder, setReminder] = useState(initialReminder);

  function onToggle() {
    const next = !reminder;
    setReminder(next);
    startTransition(async () => {
      const fd = new FormData();
      fd.set("courseId", courseId);
      const res = await toggleClassReminderAction(undefined, fd);
      if (res && "error" in res) setReminder(!next);
      else router.refresh();
    });
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={onToggle}
        disabled={pending}
        aria-pressed={reminder}
        className="btn-primary flex w-full items-center justify-center gap-2 text-center"
        style={{ background: accent }}
      >
        {reminder ? (
          <>
            <IconBellRinging size={16} aria-hidden />
            Recordatorio activo
          </>
        ) : (
          <>
            <IconCalendarTime size={16} aria-hidden />
            {label}
          </>
        )}
      </button>
      <p className="text-center text-xs text-ink-subtle">
        Te avisaremos cuando la sesión esté disponible. El streaming en vivo llegará en una
        próxima versión.
      </p>
    </div>
  );
}
