"use client";

import { useState, useTransition } from "react";

import { Avatar } from "@/components/Avatar";
import { createPost } from "@/lib/actions";

export function Composer({
  profile,
}: {
  profile?: { handle: string; display_name: string | null; avatar_url: string | null } | null;
}) {
  const [content, setContent] = useState("");
  const [isPending, startTransition] = useTransition();
  const remaining = 280 - content.length;

  return (
    <div className="border-b border-border px-4 py-3">
      <div className="flex items-start gap-3">
        <Avatar
          label={profile?.display_name || profile?.handle || "You"}
          src={profile?.avatar_url ?? null}
          className="h-10 w-10 rounded-full bg-border"
        />
        <div className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What’s happening?"
            className="min-h-20 w-full resize-none bg-transparent text-[15px] leading-6 outline-none placeholder:text-muted"
            maxLength={280}
          />

          <div className="mt-2 flex items-center justify-between gap-3">
            <div className="text-xs text-muted">{remaining}</div>
            <button
              disabled={!content.trim() || isPending}
              onClick={() =>
                startTransition(async () => {
                  await createPost(content);
                  setContent("");
                })
              }
              className="rounded-full bg-brand px-4 py-2 text-sm font-extrabold text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending ? "Posting…" : "Twitt"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
