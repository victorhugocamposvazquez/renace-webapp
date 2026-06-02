import { z } from "zod";

export const ACTIVITY_KINDS = [
  "micro_action",
  "breathing",
  "lesson_complete",
  "weekly_checkin"
] as const;

export type ActivityKind = (typeof ACTIVITY_KINDS)[number];

export const LogActivitySchema = z.object({
  kind: z.enum(ACTIVITY_KINDS),
  payload: z.record(z.unknown()).optional()
});

export type LogActivityInput = z.infer<typeof LogActivitySchema>;

export const CravingLogSchema = z.object({
  intensity: z.number().int().min(1).max(5),
  note: z.string().trim().max(500).optional().nullable(),
  triggerId: z
    .string()
    .uuid()
    .optional()
    .nullable()
    .or(z.literal("").transform(() => null))
});

export type CravingLogInput = z.infer<typeof CravingLogSchema>;
