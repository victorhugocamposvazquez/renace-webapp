import { z } from "zod";

export const AREA_IDS = ["emocional", "fisica", "juridica", "laboral", "comunidad"] as const;
export const AreaIdSchema = z.enum(AREA_IDS);
export type AreaId = z.infer<typeof AreaIdSchema>;

export const ProfileOnboardingSchema = z.object({
  alias: z.string().trim().min(1, "Necesitamos un nombre o alias").max(60),
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
