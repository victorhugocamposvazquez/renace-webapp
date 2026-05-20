import type { RenaceClient, CommunityPost } from "../types/database";

export type CommunityPostWithAuthor = CommunityPost & {
  author: { alias: string; is_mentor: boolean } | null;
  likes: number;
  liked_by_me: boolean;
};

export async function listCommunityPosts(
  client: RenaceClient,
  meId: string,
  limit = 20
): Promise<CommunityPostWithAuthor[]> {
  const { data, error } = await client
    .from("community_posts")
    .select(
      `
      id, user_id, body, created_at,
      author:profiles!community_posts_user_id_fkey(alias, is_mentor),
      reactions:community_reactions(post_id, user_id, kind)
    `
    )
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;

  type RawRow = CommunityPost & {
    author: { alias: string; is_mentor: boolean } | { alias: string; is_mentor: boolean }[] | null;
    reactions: { post_id: string; user_id: string; kind: "like" | "comment_count" }[];
  };

  return (data as unknown as RawRow[] | null ?? []).map((row) => {
    const likes = row.reactions.filter((r) => r.kind === "like").length;
    const liked_by_me = row.reactions.some(
      (r) => r.kind === "like" && r.user_id === meId
    );
    const authorRaw = Array.isArray(row.author) ? row.author[0] ?? null : row.author;
    return {
      id: row.id,
      user_id: row.user_id,
      body: row.body,
      created_at: row.created_at,
      author: authorRaw,
      likes,
      liked_by_me
    };
  });
}

export async function createCommunityPost(
  client: RenaceClient,
  userId: string,
  input: { body: string }
): Promise<CommunityPost> {
  const { data, error } = await client
    .from("community_posts")
    .insert({ user_id: userId, body: input.body })
    .select("*")
    .single();
  if (error) throw error;
  return data;
}

/**
 * Borra un post propio. RLS garantiza que solo el autor puede borrar.
 * Devuelve true si efectivamente se borró una fila.
 */
export async function deleteCommunityPost(
  client: RenaceClient,
  userId: string,
  postId: string
): Promise<boolean> {
  const { data, error } = await client
    .from("community_posts")
    .delete()
    .eq("id", postId)
    .eq("user_id", userId)
    .select("id");
  if (error) throw error;
  return (data?.length ?? 0) > 0;
}

export async function toggleLike(
  client: RenaceClient,
  userId: string,
  postId: string
): Promise<{ liked: boolean }> {
  const { data: existing, error: findErr } = await client
    .from("community_reactions")
    .select("*")
    .eq("post_id", postId)
    .eq("user_id", userId)
    .eq("kind", "like")
    .maybeSingle();
  if (findErr) throw findErr;
  if (existing) {
    const { error } = await client
      .from("community_reactions")
      .delete()
      .eq("post_id", postId)
      .eq("user_id", userId)
      .eq("kind", "like");
    if (error) throw error;
    return { liked: false };
  }
  const { error: insErr } = await client
    .from("community_reactions")
    .insert({ post_id: postId, user_id: userId, kind: "like" });
  if (insErr) throw insErr;
  return { liked: true };
}
