"use client";

import { useTransition } from "react";

import { toggleFollow } from "@/lib/actions";

export function FollowButtonSmall({
  profileId,
  following,
}: {
  profileId: string;
  following: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => startTransition(() => toggleFollow(profileId))}
      className={
        following
          ? "rounded-full border border-border bg-background px-3 py-1.5 text-xs font-extrabold hover:bg-border disabled:opacity-60"
          : "rounded-full bg-foreground px-3 py-1.5 text-xs font-extrabold text-background hover:opacity-95 disabled:opacity-60"
      }
    >
      {isPending ? "…" : following ? "Following" : "Follow"}
    </button>
  );
}

