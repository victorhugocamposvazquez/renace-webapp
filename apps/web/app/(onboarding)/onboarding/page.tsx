import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { getProfile } from "@renace/supabase";
import { OnboardingFlow } from "./OnboardingFlow";

export const metadata: Metadata = {
  title: "Empecemos · RENACE"
};

export default async function OnboardingPage() {
  const { client, userId, email } = await requireUser();
  const profile = await getProfile(client, userId);
  if (profile?.onboarding_completed) {
    redirect("/home");
  }
  const defaultAlias = profile?.alias ?? email?.split("@")[0] ?? "";
  return (
    <main className="stage flex flex-col gap-5 px-5 py-8">
      <OnboardingFlow defaultAlias={defaultAlias} />
    </main>
  );
}
