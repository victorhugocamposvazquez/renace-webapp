import { createOpenAI } from "@ai-sdk/openai";
import { streamText, type CoreMessage } from "ai";
import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  getProfile,
  getTodayMood,
  listJournal,
  persistAriaMessage
} from "@renace/supabase";
import { MOOD_LABELS, type MoodScore } from "@renace/core";
import { buildAriaSystemPrompt, createAriaTools } from "@renace/ai";

export const runtime = "nodejs";
export const maxDuration = 30;

type ChatPayload = {
  messages: CoreMessage[];
};

const provider = createOpenAI({
  apiKey: process.env.AI_GATEWAY_API_KEY ?? process.env.OPENAI_API_KEY ?? "",
  baseURL:
    process.env.AI_GATEWAY_BASE_URL ?? "https://ai-gateway.vercel.sh/v1/openai"
});

const MODEL_ID = process.env.AI_MODEL ?? "gpt-4o-mini";

export async function POST(request: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = (await request.json()) as ChatPayload;
  if (!Array.isArray(body.messages)) {
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  }

  const [profile, todayMood, todayJournal] = await Promise.all([
    getProfile(supabase, user.id),
    getTodayMood(supabase, user.id),
    listJournal(supabase, user.id, 1)
  ]);

  if (!profile) {
    return NextResponse.json({ error: "no_profile" }, { status: 400 });
  }

  const system = buildAriaSystemPrompt({
    alias: profile.alias,
    dayInProgram: profile.day_in_program,
    recentMoodScore: todayMood?.score ?? null,
    recentMoodLabel: todayMood ? MOOD_LABELS[todayMood.score as MoodScore]?.label ?? null : null,
    hasJournalToday: Boolean(
      todayJournal[0] &&
        new Date(todayJournal[0].created_at).toDateString() === new Date().toDateString()
    )
  });

  const tools = createAriaTools(supabase, user.id);

  const lastUserMessage = [...body.messages]
    .reverse()
    .find((m) => m.role === "user");
  if (profile.aria_persist && lastUserMessage) {
    const content =
      typeof lastUserMessage.content === "string"
        ? lastUserMessage.content
        : JSON.stringify(lastUserMessage.content);
    await persistAriaMessage(supabase, user.id, "user", content);
  }

  const isMockMode =
    !process.env.AI_GATEWAY_API_KEY && !process.env.OPENAI_API_KEY;

  if (isMockMode) {
    return mockReply({
      alias: profile.alias,
      lastUser:
        typeof lastUserMessage?.content === "string" ? lastUserMessage.content : ""
    });
  }

  const result = streamText({
    model: provider(MODEL_ID),
    system,
    messages: body.messages,
    tools,
    maxSteps: 4,
    onFinish: async ({ text }) => {
      if (profile.aria_persist && text) {
        await persistAriaMessage(supabase, user.id, "assistant", text);
      }
    }
  });

  return result.toDataStreamResponse();
}

/**
 * Modo demo cuando no hay clave del LLM. Streamea una respuesta predefinida
 * y útil para presentar la UI sin gastar tokens.
 */
function mockReply({
  alias,
  lastUser
}: {
  alias: string;
  lastUser: string;
}): Response {
  const aliasFirst = alias.split(" ")[0] ?? alias;
  const reply = lastUser.toLowerCase().includes("ansied")
    ? `Te leemos, ${aliasFirst}. Vamos a bajar el ritmo. ¿Probamos una respiración 4-7-8 de dos minutos? Te guiamos.`
    : lastUser.toLowerCase().includes("recaí")
    ? `${aliasFirst}, gracias por contárnoslo. Una recaída no borra el camino que llevas. ¿Quieres que veamos qué te llevó hasta ahí, sin juicios?`
    : `Aquí nos tienes, ${aliasFirst}. Somos tu equipo de RENACE. ¿Cómo te encuentras ahora mismo, en una sola palabra?`;

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const words = reply.split(" ");
      for (const w of words) {
        controller.enqueue(encoder.encode(`0:${JSON.stringify(w + " ")}\n`));
        await new Promise((r) => setTimeout(r, 35));
      }
      controller.enqueue(
        encoder.encode(
          `d:${JSON.stringify({ finishReason: "stop", usage: { promptTokens: 0, completionTokens: 0 } })}\n`
        )
      );
      controller.close();
    }
  });
  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "x-vercel-ai-data-stream": "v1"
    }
  });
}
