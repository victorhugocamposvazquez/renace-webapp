import { z } from "zod";

export const AREA_IDS = ["emocional", "fisica", "juridica", "laboral", "comunidad"] as const;
export const AreaIdSchema = z.enum(AREA_IDS);
export type AreaId = z.infer<typeof AreaIdSchema>;

/**
 * Razones por las que un usuario decide empezar. Se preguntan en el
 * onboarding y se guardan como su primera entrada de diario para que tenga
 * un punto de partida emocional al que volver.
 */
export const ONBOARDING_REASONS = [
  "trabajo",
  "familia",
  "adiccion",
  "salud",
  "legal",
  "estabilidad",
  "paz",
  "no-recaer",
  "cero"
] as const;
export const OnboardingReasonSchema = z.enum(ONBOARDING_REASONS);
export type OnboardingReason = z.infer<typeof OnboardingReasonSchema>;

export const ProfileOnboardingSchema = z.object({
  alias: z.string().trim().min(1, "Necesitamos un nombre o alias").max(60),
  reasons: z
    .array(OnboardingReasonSchema)
    .min(1, "Marca al menos un motivo, aunque sea uno")
    .max(ONBOARDING_REASONS.length),
  areaFocus: z
    .array(AreaIdSchema)
    .min(1, "Elige al menos un área")
    .max(5),
  ariaName: z.string().trim().min(1).max(30).default("Aria"),
  ariaPersist: z.boolean().default(false)
});
export type ProfileOnboardingInput = z.infer<typeof ProfileOnboardingSchema>;

export const ProfileUpdateSchema = ProfileOnboardingSchema.partial();
export type ProfileUpdateInput = z.infer<typeof ProfileUpdateSchema>;
