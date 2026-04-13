import Link from "next/link";
import { redirect } from "next/navigation";

import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default function Home() {
  return <Landing />;
}

async function Landing() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  if (data.user) redirect("/home");

  return (
    <main className="min-h-dvh bg-background">
      <div className="mx-auto grid min-h-dvh w-full max-w-6xl grid-cols-1 lg:grid-cols-2">
        <div className="hidden items-center justify-center lg:flex">
          <div className="flex items-center justify-center rounded-3xl border border-border bg-card p-14">
            <Logo className="h-40 w-40 text-brand" />
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

          <h1 className="mt-14 text-balance text-6xl font-extrabold leading-[1.02] tracking-tight">
            Happening now
          </h1>
          <h2 className="mt-6 text-balance text-3xl font-extrabold tracking-tight">
            Join Tweeter today.
          </h2>

          <div className="mt-8 flex max-w-sm flex-col gap-3">
            <Link
              href="/auth"
              className="inline-flex items-center justify-center rounded-full bg-brand px-5 py-3 text-sm font-extrabold text-white"
            >
              Create account
            </Link>
            <Link
              href="/auth"
              className="inline-flex items-center justify-center rounded-full border border-border bg-card px-5 py-3 text-sm font-extrabold hover:bg-border"
            >
              Sign in
            </Link>
          </div>

          <p className="mt-6 max-w-sm text-xs text-muted">
            By signing up, you agree to keep it friendly. You can switch to dark
            mode anytime.
          </p>

          <footer className="mt-14 text-xs text-muted">
            Built with Next.js + Supabase. Deployed on Vercel.
          </footer>
        </div>
      </div>
    </main>
  );
}
