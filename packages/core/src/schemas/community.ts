import { z } from "zod";

export const CommunityPostInputSchema = z.object({
  body: z.string().trim().min(1).max(800)
});
export type CommunityPostInput = z.infer<typeof CommunityPostInputSchema>;
