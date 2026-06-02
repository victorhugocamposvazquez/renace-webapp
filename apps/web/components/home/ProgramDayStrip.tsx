"use client";

import { useEffect, useRef, useState } from "react";
import { IconCalendarWeek } from "@tabler/icons-react";
import type { ProgramDayEntry } from "@renace/core";
import { formatProgramDayDate } from "@renace/core";

export function ProgramDayStrip({ days }: { days: ProgramDayEntry[] }) {
  const current = days.find((d) => d.isCurrent) ?? days[days.length - 1];
  const [selected, setSelected] = useState(current?.day ?? 1);
  const scrollRef = useRef<HTMLDivElement>(null);
  const selectedEntry = days.find((d) => d.day === selected) ?? current;

  useEffect(() => {
    if (!scrollRef.current || !current) return;
    const el = scrollRef.current.querySelector(`[data-day="${current.day}"]`);
    el?.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
  }, [current]);

  if (days.length === 0 || !selectedEntry) return null;

  return (
    <div className="relative min-w-0 shrink-0">
      <div
        ref={scrollRef}
        role="tablist"
        aria-label="Histórico de días del programa"
        className="hide-scrollbar flex gap-1.5 overflow-x-auto pb-1"
      >
        {days.map((d) => {
          const active = d.day === selected;
          return (
            <button
              key={d.day}
              type="button"
              role="tab"
              data-day={d.day}
              aria-selected={active}
              aria-label={`Día ${d.day}, semana ${d.week}${d.moodLabel ? `, ánimo ${d.moodLabel}` : ""}`}
              onClick={() => setSelected(d.day)}
              className={
                "flex shrink-0 flex-col items-center gap-0.5 rounded-2xl border px-3 py-2 transition-all active:scale-[0.97] " +
                (active
                  ? "border-brand-300 bg-brand-50/90 text-brand-800 shadow-soft"
                  : d.isCurrent
                    ? "border-brand-200/70 bg-elevated/90 text-ink-primary"
                    : "border-outline-soft/80 bg-elevated/70 text-ink-secondary")
              }
            >
              <span className="text-[10px] font-semibold uppercase tracking-wide opacity-70">
                Día
              </span>
              <span className="text-[15px] font-bold leading-tight">{d.day}</span>
              {d.moodEmoji ? (
                <span aria-hidden className="text-xs leading-none">
                  {d.moodEmoji}
                </span>
              ) : (
                <span aria-hidden className="h-3 w-3 rounded-full bg-outline-soft/80" />
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-2 flex min-w-[140px] flex-col gap-0.5 rounded-2xl border border-outline-soft/80 bg-elevated/80 px-3 py-2 shadow-soft backdrop-blur-sm">
        <div className="flex items-center gap-1.5">
          <IconCalendarWeek size={14} aria-hidden className="text-brand-700 opacity-80" />
          <span className="text-[13px] font-bold text-ink-primary">
            Día {selectedEntry.day}
          </span>
          <span className="text-[11px] font-medium text-ink-muted">
            · Sem {selectedEntry.week}
          </span>
        </div>
        <span className="text-[11px] capitalize text-ink-subtle">
          {formatProgramDayDate(selectedEntry.date)}
        </span>
        <span className="text-[11px] font-medium text-ink-secondary">
          {selectedEntry.moodLabel
            ? `${selectedEntry.moodEmoji} ${selectedEntry.moodLabel}`
            : selectedEntry.isCurrent
              ? "Sin ánimo registrado hoy"
              : "Sin registro de ánimo"}
        </span>
      </div>
    </div>
  );
}
