import { z } from "zod";

export const JournalEntryInputSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, "Escribe algo, aunque sea breve")
    .max(5000, "Demasiado largo")
});
export type JournalEntryInput = z.infer<typeof JournalEntryInputSchema>;
