import { describe, it, expect } from "vitest";
import {
  DAILY_PURPOSE,
  pickDailyAction,
  dailyGreeting,
  type DailyActionCandidate
} from "./dailyPlan";

const course: NonNullable<DailyActionCandidate["course"]> = {
  title: "Curso de prueba",
  meta: "Lección 2 de 5",
  href: "/cursos/x/leccion/2"
};

const physicalLive: NonNullable<DailyActionCandidate["physical"]> = {
  kind: "live",
  title: "Clase en directo",
  meta: "Física",
  when: "Hoy 18:00",
  href: "/cursos?tab=live"
};

const physicalVideo: NonNullable<DailyActionCandidate["physical"]> = {
  kind: "video",
  title: "Rutina suave",
  meta: "Vídeo de Física",
  href: "/cursos/rutina"
};

describe("DAILY_PURPOSE", () => {
  it("es una frase de propósito no vacía", () => {
    expect(DAILY_PURPOSE.length).toBeGreaterThan(0);
  });
});

describe("pickDailyAction", () => {
  it("prioriza la respiración cuando el ánimo es bajo (<= 2), aunque haya candidatos", () => {
    const action = pickDailyAction({
      todayMoodScore: 1,
      candidate: { course, physical: physicalLive }
    });
    expect(action.kind).toBe("breathing");
    expect(action.href).toBe("/respira");
  });

  it("elige el curso en marcha cuando el ánimo no es bajo", () => {
    const action = pickDailyAction({
      todayMoodScore: 4,
      candidate: { course, physical: physicalLive }
    });
    expect(action.kind).toBe("course");
    expect(action.title).toBe(course.title);
    expect(action.href).toBe(course.href);
  });

  it("trata el ánimo desconocido (null) como no-bajo y no fuerza respiración", () => {
    const action = pickDailyAction({
      todayMoodScore: null,
      candidate: { course, physical: null }
    });
    expect(action.kind).toBe("course");
  });

  it("sin curso, propone la clase física en directo con su CTA", () => {
    const action = pickDailyAction({
      todayMoodScore: 5,
      candidate: { course: null, physical: physicalLive }
    });
    expect(action.kind).toBe("physical_live");
    expect(action.cta).toBe("Guardar mi plaza");
    expect(action.when).toBe(physicalLive.when);
  });

  it("sin curso ni directo, propone el vídeo físico con su CTA", () => {
    const action = pickDailyAction({
      todayMoodScore: 3,
      candidate: { course: null, physical: physicalVideo }
    });
    expect(action.kind).toBe("physical_video");
    expect(action.cta).toBe("Ver el vídeo");
  });

  it("hace fallback a respiración cuando no hay ningún candidato", () => {
    const action = pickDailyAction({
      todayMoodScore: 4,
      candidate: { course: null, physical: null }
    });
    expect(action.kind).toBe("breathing");
  });
});

describe("dailyGreeting", () => {
  it("felicita y cierra el día cuando todo está hecho", () => {
    const msg = dailyGreeting({ aliasFirst: "Ana", todayMoodScore: 4, allDone: true });
    expect(msg).toContain("Ana");
    expect(msg.toLowerCase()).toContain("hecho");
  });

  it("invita al check-in cuando no hay ánimo registrado", () => {
    const msg = dailyGreeting({ aliasFirst: "Ana", todayMoodScore: null, allDone: false });
    expect(msg.toLowerCase()).toContain("cómo estás");
  });

  it("usa un tono de calma cuando el ánimo es bajo", () => {
    const msg = dailyGreeting({ aliasFirst: "Ana", todayMoodScore: 1, allDone: false });
    expect(msg.toLowerCase()).toContain("sin prisa");
  });

  it("anima a avanzar cuando el ánimo es bueno", () => {
    const msg = dailyGreeting({ aliasFirst: "Ana", todayMoodScore: 5, allDone: false });
    expect(msg).toContain("Ana");
  });
});
