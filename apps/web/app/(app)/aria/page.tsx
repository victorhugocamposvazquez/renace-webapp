import type { Metadata } from "next";
import { requireUser } from "@/lib/auth";
import { getProfile, listAriaMessages } from "@renace/supabase";
import { AriaChat } from "./AriaChat";

export const metadata: Metadata = { title: "Aria · RENACE" };

type SearchParamsRaw = Promise<Record<string, string | string[] | undefined>>;

export default async function AriaPage({
  searchParams
}: {
  searchParams: SearchParamsRaw;
}) {
  const { client, userId } = await requireUser();
  const [profile, history] = await Promise.all([
    getProfile(client, userId),
    listAriaMessages(client, userId, 30)
  ]);
  if (!profile) return null;

  const sp = await searchParams;
  const intent = typeof sp.intent === "string" ? sp.intent : null;

  return (
    <AriaChat
      ariaName={profile.aria_name}
      alias={profile.alias}
      initialMessages={history.map((m) => ({
        id: m.id,
        role: m.role,
        content: m.content
      }))}
      initialPrompt={
        intent === "breathing"
          ? "Me gustaría empezar una respiración 4-7-8 contigo, ¿me guías?"
          : null
      }
    />
  );
}
