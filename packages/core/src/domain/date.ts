const DAY_NAMES = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado"
];

const MONTH_NAMES = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre"
];

export function formatLongDate(now: Date): string {
  return `${DAY_NAMES[now.getDay()]}, ${now.getDate()} ${MONTH_NAMES[now.getMonth()]}`;
}

export function formatShortDateTime(d: Date): string {
  const day = String(d.getDate()).padStart(2, "0");
  const month = MONTH_NAMES[d.getMonth()]?.slice(0, 3) ?? "";
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  return `${day} ${month} · ${hours}:${minutes}`;
}

/**
 * Cuánto falta para una fecha futura, en formato amigable:
 *   "ahora · en vivo" / "en 12 min" / "en 3h" / "mañana 18:00" / "vie 11 jul · 18:00"
 */
export function formatCountdown(d: Date, now: Date = new Date()): string {
  const diffMs = d.getTime() - now.getTime();
  if (diffMs <= 0) return "en vivo ahora";
  const diffMin = Math.round(diffMs / 60000);
  if (diffMin < 60) return `en ${diffMin} min`;
  const diffH = Math.round(diffMin / 60);
  if (diffH < 24) return `en ${diffH}h`;
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  if (
    d.getFullYear() === tomorrow.getFullYear() &&
    d.getMonth() === tomorrow.getMonth() &&
    d.getDate() === tomorrow.getDate()
  ) {
    return `mañana · ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  }
  const diffD = Math.round(diffH / 24);
  if (diffD < 7) {
    const day = (DAY_NAMES[d.getDay()] ?? "").slice(0, 3).toLowerCase();
    return `${day} · ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  }
  return formatShortDateTime(d);
}

/**
 * Devuelve "1h 30m" / "45 min" para minutos totales.
 */
export function formatDuration(totalMinutes: number): string {
  if (totalMinutes < 60) return `${totalMinutes} min`;
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

export function relativeFromNow(d: Date, now: Date = new Date()): string {
  const diffMs = now.getTime() - d.getTime();
  const diffMin = Math.round(diffMs / 60000);
  if (diffMin < 1) return "ahora";
  if (diffMin < 60) return `hace ${diffMin} min`;
  const diffH = Math.round(diffMin / 60);
  if (diffH < 24) return `hace ${diffH}h`;
  const diffD = Math.round(diffH / 24);
  if (diffD < 7) return `hace ${diffD} días`;
  const diffW = Math.round(diffD / 7);
  if (diffW < 5) return `hace ${diffW} sem`;
  return d.toLocaleDateString("es-ES");
}
