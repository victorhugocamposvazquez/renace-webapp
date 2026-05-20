import type { AreaId } from "../schemas/profile";

export type ProgressLike = { area: AreaId; percent: number };

export function totalProgress(rows: ProgressLike[]): number {
  if (rows.length === 0) return 0;
  const sum = rows.reduce((acc, r) => acc + r.percent, 0);
  return Math.round(sum / rows.length);
}

export function weekFromDay(day: number): number {
  return Math.max(1, Math.ceil(day / 7));
}
