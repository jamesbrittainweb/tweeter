"use client";

import { useTransition } from "react";

import { signOut } from "@/lib/actions";

export function SignOutButton() {
  const [isPending, startTransition] = useTransition();
  return (
    <button
      disabled={isPending}
      onClick={() => startTransition(() => signOut())}
      className="rounded-full border border-border bg-background px-4 py-2 text-sm font-semibold disabled:opacity-60"
    >
      {isPending ? "Signing out…" : "Sign out"}
    </button>
  );
}
