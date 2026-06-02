"use client";

import { useEffect, useState } from "react";
import { IconSparkles } from "@tabler/icons-react";

export function CelebrationBurst({
  message,
  accent
}: {
  message: string;
  accent: string;
}) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = window.setTimeout(() => setVisible(false), 4000);
    return () => window.clearTimeout(t);
  }, []);

  if (!visible) return null;

  return (
    <div
      role="status"
      className="flex items-center gap-3 rounded-2xl border px-4 py-3 animate-[page-in_400ms_ease-out]"
      style={{
        background: `${accent}12`,
        borderColor: `${accent}33`
      }}
    >
      <span
        className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-ink-inverse"
        style={{ background: accent }}
      >
        <IconSparkles size={18} aria-hidden />
      </span>
      <p className="text-sm font-bold text-ink-primary">{message}</p>
    </div>
  );
}
