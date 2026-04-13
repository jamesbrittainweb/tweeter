"use client";

import { useState } from "react";

import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export const dynamic = "force-dynamic";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">(
    "idle",
  );
  const [error, setError] = useState<string | null>(null);

  async function sendMagicLink() {
    setStatus("loading");
    setError(null);

    let supabase: ReturnType<typeof createSupabaseBrowserClient>;
    try {
      supabase = createSupabaseBrowserClient();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Supabase is not configured.");
      setStatus("error");
      return;
    }

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
      setStatus("error");
      return;
    }

    setStatus("sent");
  }

  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col justify-center px-6 py-10">
      <div className="rounded-2xl border bg-background p-6 shadow-sm">
        <h1 className="text-balance text-2xl font-semibold">Sign in to Tweeter</h1>
        <p className="mt-2 text-sm text-foreground/70">
          We’ll send you a magic link. No password.
        </p>

        <label className="mt-6 block text-sm font-medium">Email</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="you@example.com"
          className="mt-2 w-full rounded-xl border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-foreground/40"
        />

        <button
          onClick={sendMagicLink}
          disabled={!email || status === "loading"}
          className="mt-4 w-full rounded-xl bg-foreground px-3 py-2 text-sm font-medium text-background disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "loading" ? "Sending…" : "Send magic link"}
        </button>

        {status === "sent" ? (
          <p className="mt-4 text-sm text-green-600">
            Check your inbox for the sign-in link.
          </p>
        ) : null}

        {error ? (
          <p className="mt-4 text-sm text-red-600" role="alert">
            {error}
          </p>
        ) : null}
      </div>
    </main>
  );
}
