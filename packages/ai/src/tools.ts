import { z } from "zod";
import { tool } from "ai";
import {
  logMood,
  addJournalEntry,
  listJournal,
  listUpcomingEvents,
  createConsultRequest
} from "@renace/supabase";
import type { RenaceClient } from "@renace/supabase";
import { ConsultCategorySchema } from "@renace/core";

/**
 * Tools de Aria. Las creamos con el `userId` ya cerrado, para que el modelo
 * no pueda nunca afectar a otro usuario.
 */
export function createAriaTools(client: RenaceClient, userId: string) {
  return {
    log_mood: tool({
      description:
        "Registra el ánimo del usuario en su diario emocional. Úsalo solo si el usuario indica claramente cómo se siente y consiente registrarlo.",
      parameters: z.object({
        score: z.number().int().min(1).max(5).describe("1=muy bajo, 5=muy bien"),
        note: z.string().max(200).optional()
      }),
      execute: async ({ score, note }) => {
        const r = await logMood(client, userId, { score, note });
        return { ok: true, id: r.id, score };
      }
    }),

    start_breathing_478: tool({
      description:
        "Inicia una respiración guiada 4-7-8 de 2 minutos. Devuelve los pasos para que la UI los muestre.",
      parameters: z.object({}),
      execute: async () => ({
        ok: true,
        protocol: "4-7-8",
        durationSeconds: 120,
        steps: [
          "Inhala suave por la nariz 4 segundos",
          "Mantén el aire 7 segundos",
          "Exhala lento por la boca 8 segundos"
        ]
      })
    }),

    find_support_group: tool({
      description:
        "Busca el próximo grupo de apoyo o evento en directo y devuelve sus detalles.",
      parameters: z.object({
        kind: z
          .enum(["support_group", "class", "workshop", "sport"])
          .optional()
          .describe("Tipo de evento")
      }),
      execute: async ({ kind }) => {
        const events = await listUpcomingEvents(client, userId, 5);
        const filtered = kind ? events.filter((e) => e.kind === kind) : events;
        const next = filtered[0] ?? null;
        if (!next) return { ok: false as const, reason: "no_events" };
        return {
          ok: true as const,
          event: {
            id: next.id,
            title: next.title,
            startsAt: next.starts_at,
            attendees: next.attendees,
            attending: next.attending
          }
        };
      }
    }),

    book_legal_consult: tool({
      description:
        "Abre una solicitud de consulta jurídica en nombre del usuario. Confirma siempre con él/ella antes de usarla.",
      parameters: z.object({
        category: ConsultCategorySchema,
        body: z.string().min(5).max(2000)
      }),
      execute: async ({ category, body }) => {
        const r = await createConsultRequest(client, userId, { category, body });
        return { ok: true, id: r.id };
      }
    }),

    summarize_journal: tool({
      description:
        "Lee las últimas entradas del diario para hacer un breve resumen empático. Solo si el usuario lo pide.",
      parameters: z.object({
        limit: z.number().int().min(1).max(20).default(5)
      }),
      execute: async ({ limit }) => {
        const entries = await listJournal(client, userId, limit);
        return {
          ok: true,
          entries: entries.map((e) => ({
            id: e.id,
            content: e.content,
            createdAt: e.created_at
          }))
        };
      }
    }),

    add_journal_entry: tool({
      description:
        "Guarda una entrada en el diario personal del usuario, citándolo textualmente o resumiendo lo que él/ella ha dicho. Pide consentimiento antes.",
      parameters: z.object({
        content: z.string().min(1).max(5000)
      }),
      execute: async ({ content }) => {
        const r = await addJournalEntry(client, userId, { content });
        return { ok: true, id: r.id };
      }
    })
  };
}
