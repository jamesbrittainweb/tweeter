"use client";

import { useState } from "react";
import Link from "next/link";

import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export const dynamic = "force-dynamic";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">(
    "idle",
  );
  const [error, setError] = useState<string | null>(null);

  async function sendReset() {
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

    const redirectTo = `${window.location.origin}/auth/callback?next=/auth/reset`;
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    });

    if (error) {
      setError(error.message);
      setStatus("error");
      return;
    }

    setStatus("sent");
  }

  return (
    <main className="min-h-dvh bg-background">
      <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center px-6 py-10">
        <header className="flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2 font-extrabold">
            <Logo className="h-7 w-7 text-brand" />
            <span>Tweeter</span>
          </Link>
          <ThemeToggle />
        </header>

        <div className="mt-10 rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h1 className="text-balance text-2xl font-extrabold">
            Reset your password
          </h1>
          <p className="mt-2 text-sm text-muted">
            Enter your email and we’ll send you a reset link.
          </p>

          <label className="mt-6 block text-sm font-extrabold">Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            className="mt-2 w-full rounded-xl border border-border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-foreground/25"
          />

          <button
            type="button"
            onClick={sendReset}
            disabled={!email || status === "loading"}
            className="mt-5 w-full rounded-xl bg-foreground px-3 py-2 text-sm font-extrabold text-background disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status === "loading" ? "Sending…" : "Send reset link"}
          </button>

          {status === "sent" ? (
            <div className="mt-4 rounded-xl border border-border bg-background p-3 text-sm">
              <div className="font-extrabold">Check your email</div>
              <div className="mt-1 text-muted">
                If that address exists, a reset link is on the way.
              </div>
            </div>
          ) : null}

          {error ? (
            <p className="mt-4 text-sm text-red-600" role="alert">
              {error}
            </p>
          ) : null}

          <div className="mt-6 text-sm">
            <Link
              href="/auth?mode=signin"
              className="font-extrabold text-foreground hover:underline"
            >
              Back to sign in
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

