"use client";

import { useTransition } from "react";
import type { TimelineMilestone } from "@renace/supabase";
import { updateMilestoneStatusAction } from "@/app/(app)/recorrido/actions";

const STATUS_COLOR = {
  done: "#0F6E56",
  in_progress: "#B47119",
  pending: "transparent"
} as const;

const STATUS_BORDER = {
  done: "#0F6E56",
  in_progress: "#B47119",
  pending: "#C5D0BF"
} as const;

const STATUS_LABEL = {
  done: "Hecho",
  in_progress: "En curso",
  pending: "Por llegar"
} as const;

export function MilestoneItem({
  milestone,
  isFirst,
  isLast
}: {
  milestone: TimelineMilestone;
  isFirst: boolean;
  isLast: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const status = milestone.status;
  const next =
    status === "done" ? "pending" : status === "in_progress" ? "done" : "in_progress";

  function toggle() {
    startTransition(async () => {
      const fd = new FormData();
      fd.set("id", milestone.id);
      fd.set("status", next);
      await updateMilestoneStatusAction(fd);
    });
  }

  return (
    <li className="relative pl-7">
      {!isFirst && !isLast && (
        <span
          aria-hidden
          className="absolute left-[10px] top-0 h-full w-[3px] bg-outline-medium"
        />
      )}
      {!isFirst && isLast && (
        <span
          aria-hidden
          className="absolute left-[10px] top-0 h-1/2 w-[3px] bg-outline-medium"
        />
      )}
      {isFirst && !isLast && (
        <span
          aria-hidden
          className="absolute left-[10px] bottom-0 h-1/2 w-[3px] bg-outline-medium"
        />
      )}
      <span
        aria-hidden
        className="absolute left-0 top-1.5 grid h-5 w-5 place-items-center rounded-full"
        style={{
          backgroundColor: STATUS_COLOR[status],
          border: `3px solid ${STATUS_BORDER[status]}`
        }}
      />
      <div className="pb-5">
        <p
          className="label-eyebrow"
          style={{
            color:
              status === "done"
                ? "#0F6E56"
                : status === "in_progress"
                ? "#B47119"
                : "#5C6759"
          }}
        >
          Semana {milestone.week} · {STATUS_LABEL[status]}
        </p>
        <h3 className="mt-1 text-base font-bold text-ink-primary">{milestone.title}</h3>
        <p
          className="mt-2 rounded-xl p-3 text-sm font-medium leading-relaxed"
          style={
            status === "in_progress"
              ? { backgroundColor: "#F9E8C9", color: "#7A4F0A" }
              : status === "done"
              ? { backgroundColor: "#fff", color: "#2C3A2E" }
              : { backgroundColor: "#fff", color: "#5C6759" }
          }
        >
          {milestone.body}
        </p>
        <button
          type="button"
          onClick={toggle}
          disabled={isPending}
          className="btn-secondary mt-2"
        >
          {isPending
            ? "Guardando…"
            : status === "done"
            ? "Marcar pendiente"
            : status === "in_progress"
            ? "Marcar hecho"
            : "Marcar en curso"}
        </button>
      </div>
    </li>
  );
}
