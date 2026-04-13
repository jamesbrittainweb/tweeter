"use client";

import { useState, useTransition } from "react";

import { createPost } from "@/lib/actions";

export function Composer() {
  const [content, setContent] = useState("");
  const [isPending, startTransition] = useTransition();
  const remaining = 280 - content.length;

  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What’s happening?"
        className="min-h-24 w-full resize-none bg-transparent text-sm outline-none"
        maxLength={280}
      />
      <div className="mt-3 flex items-center justify-between gap-3">
        <div className="text-xs text-muted">
          {remaining} <span className="hidden sm:inline">characters left</span>
        </div>
        <button
          disabled={!content.trim() || isPending}
          onClick={() =>
            startTransition(async () => {
              await createPost(content);
              setContent("");
            })
          }
          className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? "Twitting…" : "Twitt"}
        </button>
      </div>
    </div>
  );
}
