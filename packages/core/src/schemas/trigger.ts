import { z } from "zod";

export const TriggerSeveritySchema = z.union([z.literal(1), z.literal(2), z.literal(3)]);
export type TriggerSeverity = z.infer<typeof TriggerSeveritySchema>;

export const TriggerInputSchema = z.object({
  label: z.string().trim().min(1).max(80),
  severity: TriggerSeveritySchema.default(2)
});
export type TriggerInput = z.infer<typeof TriggerInputSchema>;

export const TRIGGER_SEVERITY_LABEL: Record<TriggerSeverity, string> = {
  1: "Suave",
  2: "Moderado",
  3: "Alerta"
};
