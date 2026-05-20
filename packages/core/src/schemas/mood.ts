import { z } from "zod";

export const MoodScoreSchema = z.number().int().min(1).max(5);
export type MoodScore = z.infer<typeof MoodScoreSchema>;

export const MoodLogInputSchema = z.object({
  score: MoodScoreSchema,
  note: z.string().trim().max(500).optional().nullable()
});
export type MoodLogInput = z.infer<typeof MoodLogInputSchema>;

export const MOOD_LABELS: Record<MoodScore, { emoji: string; label: string }> = {
  1: { emoji: "😔", label: "Muy bajo" },
  2: { emoji: "😟", label: "Bajo" },
  3: { emoji: "😐", label: "Neutro" },
  4: { emoji: "🙂", label: "Bien" },
  5: { emoji: "😄", label: "Muy bien" }
};
