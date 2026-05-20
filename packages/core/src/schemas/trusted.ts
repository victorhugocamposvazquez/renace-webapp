import { z } from "zod";

export const TrustedContactInputSchema = z.object({
  name: z.string().trim().min(1).max(60),
  phone: z
    .string()
    .trim()
    .min(6, "Demasiado corto")
    .max(30)
    .regex(/^[\d +()\-]+$/, "Solo números, espacios, + y guiones"),
  relation: z.string().trim().max(40).optional().nullable()
});
export type TrustedContactInput = z.infer<typeof TrustedContactInputSchema>;
