import type { RenaceClient } from "../types/database";
import { listMilestones, setMilestoneStatus } from "./timeline";
import { listTrustedContacts } from "./trusted";
import { listJournal } from "./journal";

type AutoKey = "onboarding" | "trusted_contact" | "first_course" | "journal_habit" | "support_group";

const TITLE_TO_KEY: Record<string, AutoKey> = {
  "Primeros pasos": "onboarding",
  "Contacto de confianza": "trusted_contact",
  "Primer curso": "first_course",
  "Diario emocional": "journal_habit",
  "Grupo de apoyo": "support_group"
};

/**
 * Marca hitos como done/in_progress según actividad real del usuario.
 */
export async function syncMilestonesFromActivity(
  client: RenaceClient,
  userId: string
): Promise<void> {
  const [milestones, contacts, journal, enrollmentsRes, attendancesRes] = await Promise.all([
    listMilestones(client, userId),
    listTrustedContacts(client, userId),
    listJournal(client, userId, 50),
    client.from("course_enrollments").select("id").eq("user_id", userId).limit(1),
    client.from("event_attendees").select("event_id").eq("user_id", userId).limit(1)
  ]);

  const hasCourse = (enrollmentsRes.data?.length ?? 0) > 0;
  const hasEvent = (attendancesRes.data?.length ?? 0) > 0;

  const fulfilled: Record<AutoKey, boolean> = {
    onboarding: true,
    trusted_contact: contacts.length >= 1,
    first_course: hasCourse,
    journal_habit: journal.length >= 3,
    support_group: hasEvent
  };

  for (const m of milestones) {
    const key = TITLE_TO_KEY[m.title];
    if (!key || m.status === "done") continue;
    if (fulfilled[key]) {
      await setMilestoneStatus(client, userId, m.id, "done");
    } else if (m.status === "pending") {
      const inProgress =
        (key === "journal_habit" && journal.length > 0) ||
        (key === "first_course" && hasCourse);
      if (inProgress) {
        await setMilestoneStatus(client, userId, m.id, "in_progress");
      }
    }
  }
}
