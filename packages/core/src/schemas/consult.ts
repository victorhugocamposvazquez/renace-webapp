import { z } from "zod";

export const CONSULT_CATEGORIES = [
  "debt",
  "custody",
  "complaint",
  "aid",
  "docs",
  "other"
] as const;
export const ConsultCategorySchema = z.enum(CONSULT_CATEGORIES);
export type ConsultCategory = z.infer<typeof ConsultCategorySchema>;

export const CONSULT_CATEGORY_LABEL: Record<ConsultCategory, string> = {
  debt: "Deudas",
  custody: "Custodias",
  complaint: "Denuncias",
  aid: "Ayudas",
  docs: "Documentación",
  other: "Otros"
};

export const ConsultRequestInputSchema = z.object({
  category: ConsultCategorySchema,
  body: z
    .string()
    .trim()
    .min(5, "Cuéntanos un poco más")
    .max(2000, "Demasiado largo, resume si puedes")
});
export type ConsultRequestInput = z.infer<typeof ConsultRequestInputSchema>;
