"use client";

import { useTransition } from "react";

import { toggleFollow } from "@/lib/actions";

export function FollowButton({
  profileId,
  following,
}: {
  profileId: string;
  following: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      disabled={isPending}
      onClick={() => startTransition(() => toggleFollow(profileId))}
      className={
        following
          ? "rounded-full border border-border bg-background px-4 py-2 text-sm font-semibold disabled:opacity-60"
          : "rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-background disabled:opacity-60"
      }
    >
      {isPending ? "…" : following ? "Following" : "Follow"}
    </button>
  );
}
