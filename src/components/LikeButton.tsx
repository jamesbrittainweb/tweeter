"use client";

import { useTransition } from "react";

import { toggleLike } from "@/lib/actions";

export function LikeButton({
  postId,
  liked,
}: {
  postId: string;
  liked: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      disabled={isPending}
      onClick={() => startTransition(() => toggleLike(postId))}
      className={
        liked
          ? "inline-flex items-center gap-2 text-xs font-semibold text-rose-500 disabled:opacity-60"
          : "inline-flex items-center gap-2 text-xs font-semibold text-muted hover:text-foreground disabled:opacity-60"
      }
      aria-label={liked ? "Unlike" : "Like"}
    >
      <span aria-hidden>{liked ? "♥" : "♡"}</span>
      <span className="hidden sm:inline">{liked ? "Liked" : "Like"}</span>
    </button>
  );
}
