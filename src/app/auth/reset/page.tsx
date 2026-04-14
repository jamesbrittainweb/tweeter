"use client";

import { useState } from "react";
import Link from "next/link";

import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export const dynamic = "force-dynamic";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">(
    "idle",
  );
  const [error, setError] = useState<string | null>(null);

  async function updatePassword() {
    setStatus("loading");
    setError(null);

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      setStatus("error");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      setStatus("error");
      return;
    }

    let supabase: ReturnType<typeof createSupabaseBrowserClient>;
    try {
      supabase = createSupabaseBrowserClient();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Supabase is not configured.");
      setStatus("error");
      return;
    }

    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setError(error.message);
      setStatus("error");
      return;
    }

    setStatus("done");
    window.setTimeout(() => {
      window.location.href = "/home";
    }, 1200);
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
            Choose a new password
          </h1>
          <p className="mt-2 text-sm text-muted">
            This link is only valid for a short time.
          </p>

          <label className="mt-6 block text-sm font-extrabold">New password</label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            autoComplete="new-password"
            placeholder="••••••••"
            className="mt-2 w-full rounded-xl border border-border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-foreground/25"
          />

          <label className="mt-4 block text-sm font-extrabold">
            Confirm password
          </label>
          <input
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            type="password"
            autoComplete="new-password"
            placeholder="••••••••"
            className="mt-2 w-full rounded-xl border border-border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-foreground/25"
          />

          <button
            type="button"
            onClick={updatePassword}
            disabled={!password || !confirm || status === "loading" || status === "done"}
            className="mt-5 w-full rounded-xl bg-foreground px-3 py-2 text-sm font-extrabold text-background disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status === "loading"
              ? "Updating…"
              : status === "done"
                ? "Updated"
                : "Update password"}
          </button>

          {status === "done" ? (
            <div className="mt-4 rounded-xl border border-border bg-background p-3 text-sm">
              <div className="font-extrabold">Password updated</div>
              <div className="mt-1 text-muted">Taking you back home…</div>
            </div>
          ) : null}

          {error ? (
            <div className="mt-4 rounded-xl border border-border bg-background p-3 text-sm">
              <div className="font-extrabold">Couldn’t update password</div>
              <div className="mt-1 text-red-600">{error}</div>
              <div className="mt-3">
                <Link
                  href="/auth/forgot"
                  className="font-extrabold text-foreground hover:underline"
                >
                  Send a new reset link
                </Link>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </main>
  );
}

