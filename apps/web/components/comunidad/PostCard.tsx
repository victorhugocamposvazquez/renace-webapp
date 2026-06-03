"use client";

import { useTransition, useState } from "react";
import {
  IconHeart,
  IconHeartFilled,
  IconTrash
} from "@tabler/icons-react";
import type { CommunityPostWithAuthor } from "@renace/supabase";
import { relativeFromNow } from "@renace/core";
import {
  toggleLikeAction,
  deletePostAction
} from "@/app/(app)/comunidad/actions";
import { ConfirmModal } from "@/components/ConfirmModal";

export function PostCard({
  post,
  currentUserId
}: {
  post: CommunityPostWithAuthor;
  currentUserId: string;
}) {
  const [liked, setLiked] = useState(post.liked_by_me);
  const [likes, setLikes] = useState(post.likes);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const isMine = post.user_id === currentUserId;

  function toggle() {
    const optimisticLiked = !liked;
    setLiked(optimisticLiked);
    setLikes((n) => n + (optimisticLiked ? 1 : -1));
    startTransition(async () => {
      const fd = new FormData();
      fd.set("postId", post.id);
      const result = await toggleLikeAction(fd);
      if (!result.ok) {
        setLiked(!optimisticLiked);
        setLikes((n) => n + (optimisticLiked ? -1 : 1));
      }
    });
  }

  function remove() {
    startTransition(async () => {
      const fd = new FormData();
      fd.set("id", post.id);
      const result = await deletePostAction(fd);
      if (!result.ok) {
        setError(result.error);
      } else {
        setError(null);
      }
      setConfirmDelete(false);
    });
  }

  const alias = post.author?.alias ?? "Anónimo";
  const initials = alias
    .split(" ")
    .map((s) => s[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <article className="card border-area-comunidad-border">
      <header className="flex items-center gap-2.5">
        <span
          aria-hidden
          className="grid h-10 w-10 place-items-center rounded-full bg-area-comunidad-tint text-sm font-bold text-area-comunidad"
        >
          {initials || "??"}
        </span>
        <div className="flex-1">
          <p className="flex items-center gap-1.5 text-sm font-bold text-ink-primary">
            {alias}
            {post.author?.is_mentor && (
              <span className="pill bg-brand-100 text-brand-700">Mentor</span>
            )}
            {isMine && (
              <span className="pill bg-area-comunidad-tint text-area-comunidad-text">
                Tú
              </span>
            )}
          </p>
          <p className="text-xs text-ink-subtle">
            {relativeFromNow(new Date(post.created_at))}
          </p>
        </div>
        {isMine && (
          <button
            type="button"
            onClick={() => setConfirmDelete(true)}
            aria-label="Borrar mi post"
            className="tap-target -mr-2 grid place-items-center rounded-full text-ink-subtle transition-colors hover:text-state-danger"
          >
            <IconTrash size={18} aria-hidden />
          </button>
        )}
      </header>
      <p className="mt-3 whitespace-pre-line text-base leading-relaxed text-ink-primary">
        {post.body}
      </p>
      {error && (
        <p
          role="alert"
          className="mt-2 rounded-xl border border-state-danger/20 bg-state-danger/5 px-3 py-2 text-sm font-medium text-state-danger"
        >
          {error}
        </p>
      )}
      <footer className="mt-3 flex items-center gap-4 text-sm font-semibold text-ink-subtle">
        <button
          type="button"
          onClick={toggle}
          disabled={isPending}
          aria-pressed={liked}
          aria-label={liked ? "Quitar me gusta" : "Me gusta"}
          className="tap-target -ml-2 inline-flex items-center gap-1.5 px-2 transition-transform active:scale-95"
        >
          {liked ? (
            <IconHeartFilled
              size={18}
              aria-hidden
              className="text-area-comunidad"
            />
          ) : (
            <IconHeart size={18} aria-hidden />
          )}
          <span>{likes}</span>
        </button>
      </footer>

      <ConfirmModal
        open={confirmDelete}
        onCancel={() => !isPending && setConfirmDelete(false)}
        onConfirm={remove}
        busy={isPending}
        tone="danger"
        icon={<IconTrash size={22} stroke={2.2} aria-hidden />}
        title="¿Borrar tu publicación?"
        description={
          <>
            <p>
              Vamos a borrar tu post de la comunidad. Otras personas dejarán de
              verlo y no podrá recuperarse.
            </p>
            <p className="mt-2 max-h-32 overflow-hidden rounded-lg border border-outline-soft bg-canvas px-3 py-2 italic text-ink-secondary">
              «{post.body.slice(0, 180)}
              {post.body.length > 180 ? "…" : ""}»
            </p>
          </>
        }
        confirmLabel="Sí, borrar"
        cancelLabel="Mantener"
      />
    </article>
  );
}
