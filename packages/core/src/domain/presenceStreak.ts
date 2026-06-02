/**
 * Racha de días consecutivos con actividad registrada (ánimo, log, diario, curso…).
 */
export function computePresenceStreak(activeDates: string[], today: string): number {
  if (activeDates.length === 0) return 0;
  const set = new Set(activeDates);
  let streak = 0;
  let cursor = today;
  while (set.has(cursor)) {
    streak += 1;
    cursor = addDays(cursor, -1);
  }
  return streak;
}

export function streakLabel(streak: number, reasons: string[]): string {
  const recoveryFocused =
    reasons.includes("adiccion") || reasons.includes("no-recaer");
  if (streak === 0) {
    return recoveryFocused ? "Empieza tu racha hoy" : "Vuelve hoy a tu camino";
  }
  if (recoveryFocused) {
    return `${streak} día${streak === 1 ? "" : "s"} en tu camino`;
  }
  return `${streak} día${streak === 1 ? "" : "s"} seguidos activo`;
}

function addDays(isoDate: string, delta: number): string {
  const d = new Date(`${isoDate}T12:00:00`);
  d.setDate(d.getDate() + delta);
  return d.toISOString().slice(0, 10);
}
