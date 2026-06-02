import type { AreaId } from "@renace/supabase";
import { AREA_THEMES } from "@renace/tokens";

type Props = {
  area: AreaId;
  size?: "sm" | "md";
  /** En cards sobre fondo oscuro (live hero). */
  onDark?: boolean;
};

export function AreaBadge({ area, size = "sm", onDark = false }: Props) {
  const theme = AREA_THEMES[area];
  const sm = size === "sm";

  if (onDark) {
    return (
      <span
        className={
          "inline-flex items-center rounded-full font-bold uppercase tracking-wide " +
          (sm ? "px-2 py-0.5 text-[9px]" : "px-2.5 py-1 text-[10px]")
        }
        style={{
          background: "rgba(255,255,255,0.22)",
          color: "#fff",
          border: "1px solid rgba(255,255,255,0.35)"
        }}
      >
        {theme.label}
      </span>
    );
  }

  return (
    <span
      className={
        "inline-flex items-center gap-1 rounded-full border font-bold " +
        (sm ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-[11px]")
      }
      style={{
        backgroundColor: theme.tint,
        borderColor: theme.border,
        color: theme.text
      }}
    >
      <span
        aria-hidden
        className="rounded-full"
        style={{
          width: sm ? 6 : 7,
          height: sm ? 6 : 7,
          backgroundColor: theme.core
        }}
      />
      {theme.label}
    </span>
  );
}
