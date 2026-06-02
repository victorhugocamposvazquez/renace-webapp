"use client";

import { useEffect, useRef } from "react";

/** Anillo de progreso con transición suave al cambiar el total. */
export function ProgressRing({
  totalPercent,
  ringCircumference,
  ringRadius
}: {
  totalPercent: number;
  ringCircumference: number;
  ringRadius: number;
}) {
  const prevRef = useRef(totalPercent);
  const pulseRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    if (prevRef.current !== totalPercent && pulseRef.current) {
      pulseRef.current.classList.remove("animate-ring-pulse");
      pulseRef.current.getBoundingClientRect();
      pulseRef.current.classList.add("animate-ring-pulse");
    }
    prevRef.current = totalPercent;
  }, [totalPercent]);

  return (
    <>
      <circle
        cx="180"
        cy="180"
        r={ringRadius}
        fill="none"
        stroke="#D6D3CE"
        strokeWidth="1"
        strokeDasharray="2 4"
      />
      <circle
        cx="180"
        cy="180"
        r={ringRadius}
        fill="none"
        stroke="#ECEAE6"
        strokeWidth="6"
      />
      <circle
        ref={pulseRef}
        cx="180"
        cy="180"
        r={ringRadius}
        fill="none"
        stroke="url(#renace-track-gradient)"
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray={ringCircumference}
        strokeDashoffset={ringCircumference * (1 - totalPercent / 100)}
        transform="rotate(-90 180 180)"
        className="transition-[stroke-dashoffset] duration-700 ease-out"
      />
    </>
  );
}
