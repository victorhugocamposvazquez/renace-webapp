"use client";

import { useState } from "react";
import { LiveClassDemoModal } from "./LiveClassDemoModal";

export function LiveClassJoinButton({
  title,
  instructorName,
  accent,
  label
}: {
  title: string;
  instructorName: string | null;
  accent: string;
  label: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="btn-primary text-center w-full"
        style={{ background: accent }}
      >
        {label}
      </button>
      <LiveClassDemoModal
        title={title}
        instructorName={instructorName}
        accent={accent}
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
