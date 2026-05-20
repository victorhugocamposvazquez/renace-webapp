import { z } from "zod";

export const MilestoneStatusSchema = z.enum(["pending", "in_progress", "done"]);
export type MilestoneStatus = z.infer<typeof MilestoneStatusSchema>;

export const MilestoneStatusUpdateSchema = z.object({
  id: z.string().uuid(),
  status: MilestoneStatusSchema
});
export type MilestoneStatusUpdate = z.infer<typeof MilestoneStatusUpdateSchema>;
