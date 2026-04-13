"use client";

import { useState } from "react";

import Link from "next/link";

import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export const dynamic = "force-dynamic";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
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

    const { error } =
      mode === "signin"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password });

    if (error) {
      setError(error.message);
      setStatus("error");
      return;
    }

    window.location.href = "/home";
  }

  return (
    <main className="min-h-dvh bg-background">
      <div className="mx-auto grid min-h-dvh w-full max-w-5xl grid-cols-1 lg:grid-cols-2">
        <div className="hidden items-center justify-center lg:flex">
          <div className="flex items-center justify-center rounded-3xl border border-border bg-card p-14">
            <Logo className="h-28 w-28 text-brand" />
          </div>
        </div>

        <div className="flex flex-col justify-center px-6 py-10">
          <header className="flex items-center justify-between">
            <Link href="/" className="inline-flex items-center gap-2 font-extrabold">
              <Logo className="h-7 w-7 text-brand" />
              <span>Tweeter</span>
            </Link>
            <ThemeToggle />
          </header>

          <div className="mt-10 rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h1 className="text-balance text-2xl font-extrabold">
              {mode === "signin" ? "Sign in" : "Create your account"}
            </h1>
            <p className="mt-2 text-sm text-muted">
              {mode === "signin"
                ? "Welcome back."
                : "You’ll be posting in no time."}
            </p>

            <div className="mt-6 inline-flex rounded-full border border-border bg-background p-1 text-sm">
              <button
                type="button"
                onClick={() => setMode("signin")}
                className={
                  mode === "signin"
                    ? "rounded-full bg-foreground px-4 py-1.5 font-extrabold text-background"
                    : "rounded-full px-4 py-1.5 font-extrabold text-muted hover:text-foreground"
                }
              >
                Sign in
              </button>
              <button
                type="button"
                onClick={() => setMode("signup")}
                className={
                  mode === "signup"
                    ? "rounded-full bg-foreground px-4 py-1.5 font-extrabold text-background"
                    : "rounded-full px-4 py-1.5 font-extrabold text-muted hover:text-foreground"
                }
              >
                Sign up
              </button>
            </div>

            <label className="mt-6 block text-sm font-extrabold">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              className="mt-2 w-full rounded-xl border border-border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-foreground/25"
            />

            <label className="mt-4 block text-sm font-extrabold">Password</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              autoComplete={
                mode === "signin" ? "current-password" : "new-password"
              }
              placeholder="••••••••"
              className="mt-2 w-full rounded-xl border border-border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-foreground/25"
            />

            <button
              onClick={handleSubmit}
              disabled={!email || !password || status === "loading"}
              className="mt-5 w-full rounded-xl bg-foreground px-3 py-2 text-sm font-extrabold text-background disabled:cursor-not-allowed disabled:opacity-60"
            >
              {status === "loading"
                ? "Working…"
                : mode === "signin"
                  ? "Sign in"
                  : "Create account"}
            </button>

            {error ? (
              <p className="mt-4 text-sm text-red-600" role="alert">
                {error}
              </p>
            ) : null}

            <p className="mt-5 text-xs text-muted">
              Email/password auth must be enabled in Supabase Auth settings.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
