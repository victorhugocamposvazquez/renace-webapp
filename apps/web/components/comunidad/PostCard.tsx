"use client";

import { useTransition, useState } from "react";
import { IconHeart, IconHeartFilled, IconMessage } from "@tabler/icons-react";
import type { CommunityPostWithAuthor } from "@renace/supabase";
import { relativeFromNow } from "@renace/core";
import { toggleLikeAction } from "@/app/(app)/comunidad/actions";

export function PostCard({ post }: { post: CommunityPostWithAuthor }) {
  const [liked, setLiked] = useState(post.liked_by_me);
  const [likes, setLikes] = useState(post.likes);
  const [isPending, startTransition] = useTransition();

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
          </p>
          <p className="text-xs text-ink-subtle">
            {relativeFromNow(new Date(post.created_at))}
          </p>
        </div>
      </header>
      <p className="mt-3 whitespace-pre-line text-base leading-relaxed text-ink-primary">
        {post.body}
      </p>
      <footer className="mt-3 flex items-center gap-4 text-sm font-semibold text-ink-subtle">
        <button
          type="button"
          onClick={toggle}
          disabled={isPending}
          aria-pressed={liked}
          aria-label={liked ? "Quitar me gusta" : "Me gusta"}
          className="tap-target -ml-2 inline-flex items-center gap-1.5 px-2"
        >
          {liked ? (
            <IconHeartFilled size={18} aria-hidden className="text-area-comunidad" />
          ) : (
            <IconHeart size={18} aria-hidden />
          )}
          <span>{likes}</span>
        </button>
        <span className="inline-flex items-center gap-1.5">
          <IconMessage size={18} aria-hidden />
          <span>0</span>
        </span>
      </footer>
    </article>
  );
}
