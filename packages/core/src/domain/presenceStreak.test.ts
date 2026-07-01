import { describe, it, expect } from "vitest";
import { computePresenceStreak, streakLabel } from "./presenceStreak";

describe("computePresenceStreak", () => {
  it("devuelve 0 cuando no hay fechas activas", () => {
    expect(computePresenceStreak([], "2026-07-01")).toBe(0);
  });

  it("cuenta días consecutivos hasta hoy", () => {
    const dates = ["2026-06-29", "2026-06-30", "2026-07-01"];
    expect(computePresenceStreak(dates, "2026-07-01")).toBe(3);
  });

  it("se corta en el primer hueco", () => {
    const dates = ["2026-06-28", "2026-06-30", "2026-07-01"];
    expect(computePresenceStreak(dates, "2026-07-01")).toBe(2);
  });

  it("es 0 si hoy no tiene actividad", () => {
    const dates = ["2026-06-29", "2026-06-30"];
    expect(computePresenceStreak(dates, "2026-07-01")).toBe(0);
  });

  it("ignora fechas duplicadas", () => {
    const dates = ["2026-07-01", "2026-07-01", "2026-06-30"];
    expect(computePresenceStreak(dates, "2026-07-01")).toBe(2);
  });
});

describe("streakLabel", () => {
  it("invita a empezar cuando la racha es 0", () => {
    expect(streakLabel(0, []).length).toBeGreaterThan(0);
  });

  it("usa lenguaje de 'camino' en perfil de recuperación", () => {
    expect(streakLabel(3, ["adiccion"]).toLowerCase()).toContain("camino");
  });

  it("pluraliza correctamente", () => {
    expect(streakLabel(1, [])).toContain("1 día ");
    expect(streakLabel(2, [])).toContain("2 días");
  });
});
