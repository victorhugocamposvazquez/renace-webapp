import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "./supabase/server";

/**
 * Garantiza una sesión válida en Server Components y Server Actions.
 * Devuelve { client, userId, email }.
 */
export async function requireUser() {
  const client = await createSupabaseServerClient();
  const {
    data: { user }
  } = await client.auth.getUser();
  if (!user) redirect("/login");
  return { client, userId: user.id, email: user.email ?? null };
}
