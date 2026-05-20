import { z } from "zod";

export const LegalCaseStatusSchema = z.enum(["open", "in_progress", "closed"]);
export type LegalCaseStatus = z.infer<typeof LegalCaseStatusSchema>;
