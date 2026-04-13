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
      className="text-xs text-muted hover:text-foreground disabled:opacity-60"
    >
      {liked ? "Unlike" : "Like"}
    </button>
  );
}
