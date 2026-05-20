"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { IconPlayerPlayFilled } from "@tabler/icons-react";
import { enrollCourseAction } from "@/app/(app)/cursos/actions";

export function EnrollButton({
  courseId,
  accent
}: {
  courseId: string;
  accent: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function onClick() {
    startTransition(async () => {
      const fd = new FormData();
      fd.set("courseId", courseId);
      const res = await enrollCourseAction(undefined, fd);
      if (!res || "error" in res) {
        return;
      }
      router.refresh();
    });
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={pending}
      className="btn-primary"
      style={{ background: accent }}
    >
      <IconPlayerPlayFilled size={16} aria-hidden />
      <span>{pending ? "Inscribiendo…" : "Empezar curso"}</span>
    </button>
  );
}
