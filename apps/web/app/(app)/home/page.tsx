import type { Metadata } from "next";
import { requireUser } from "@/lib/auth";
import {
  getProfile,
  listAreaProgress,
  listTrustedContacts,
  getTodayMood,
  fillAllAreas
} from "@renace/supabase";
import { pickMicroAction, totalProgress, weekFromDay } from "@renace/core";
import { AppHeader } from "@/components/AppHeader";
import { Renace360 } from "@/components/Renace360";
import { AriaTeaser } from "@/components/AriaTeaser";
import { MicroActionCard } from "@/components/MicroActionCard";
import { RecoveryProgress } from "@/components/RecoveryProgress";

export const metadata: Metadata = { title: "Inicio · RENACE" };

export default async function HomePage() {
  const { client, userId } = await requireUser();
  const [profile, rawAreas, contacts, todayMood] = await Promise.all([
    getProfile(client, userId),
    listAreaProgress(client, userId),
    listTrustedContacts(client, userId),
    getTodayMood(client, userId)
  ]);
  if (!profile) {
    // El middleware ya debería habernos llevado a /onboarding, pero por si acaso:
    return null;
  }

  const areas = fillAllAreas(rawAreas, userId);
  const total = totalProgress(areas);
  const week = weekFromDay(profile.day_in_program);
  const action = pickMicroAction({
    dayInProgram: profile.day_in_program,
    lastMood: todayMood?.score ?? null
  });

  const ariaIntro = buildAriaIntro({
    aliasFirst: profile.alias.split(" ")[0] ?? profile.alias,
    todayMoodScore: todayMood?.score ?? null
  });

  return (
    <div className="flex flex-1 flex-col gap-4 pb-4">
      <AppHeader
        alias={profile.alias.split(" ")[0] ?? profile.alias}
        trustedContacts={contacts}
        notifications={todayMood ? 0 : 1}
      />

      <section className="px-5">
        <Renace360
          progress={areas}
          totalPercent={total}
          dayInProgram={profile.day_in_program}
          week={week}
          alias={profile.alias}
        />
      </section>

      <section className="px-5">
        <RecoveryProgress
          progress={areas}
          totalPercent={total}
          dayInProgram={profile.day_in_program}
          week={week}
        />
      </section>

      <section className="px-5">
        <MicroActionCard action={action} />
      </section>

      <section className="px-5">
        <AriaTeaser ariaName={profile.aria_name} intro={ariaIntro} />
      </section>
    </div>
  );
}

function buildAriaIntro({
  aliasFirst,
  todayMoodScore
}: {
  aliasFirst: string;
  todayMoodScore: number | null;
}): string {
  if (todayMoodScore === null) {
    return `Hola ${aliasFirst}. ¿Cómo te encuentras hoy? Cuéntame en una palabra.`;
  }
  if (todayMoodScore <= 2) {
    return `He visto que hoy te estás sintiendo bajo. ¿Probamos un ejercicio de respiración 4-7-8?`;
  }
  if (todayMoodScore === 3) {
    return `Día neutro. ¿Hacemos un repaso de cómo va tu plan?`;
  }
  return `Buen ánimo hoy. ¿Aprovechamos para avanzar en algo del plan?`;
}
