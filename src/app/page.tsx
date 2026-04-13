import Link from "next/link";
import { redirect } from "next/navigation";

import { Logo } from "@/components/Logo";
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
    <main className="mx-auto flex min-h-dvh max-w-3xl flex-col px-6 py-14">
      <header className="flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold tracking-tight">
          <Logo className="h-6 w-6 text-brand" />
          <span className="text-brand">Tweeter</span>
        </Link>
        <Link
          href="/auth"
          className="rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background"
        >
          Sign in
        </Link>
      </header>

      <section className="mt-16">
        <h1 className="text-balance text-5xl font-semibold leading-[1.05] tracking-tight">
          Share quick thoughts.
        </h1>
        <p className="mt-5 max-w-xl text-pretty text-lg text-muted">
          Tweeter is a simple, friendly microblog — built with Next.js and
          Supabase, deployed on Vercel.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/auth"
            className="inline-flex items-center justify-center rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white"
          >
            Get started
          </Link>
          <a
            className="inline-flex items-center justify-center rounded-full border border-border bg-background px-5 py-3 text-sm font-semibold"
            href="https://supabase.com/"
            target="_blank"
            rel="noreferrer"
          >
            Powered by Supabase
          </a>
        </div>
      </section>

      <section className="mt-14 grid gap-4 sm:grid-cols-3">
        <Feature title="Twitts" body="Short posts with a 280 character cap." />
        <Feature title="Likes" body="Like posts you enjoy." />
        <Feature title="Follows" body="Follow people to keep up." />
      </section>

      <footer className="mt-auto pt-16 text-sm text-muted">
        Not Twitter. Just Tweeter.
      </footer>
    </main>
  );
}

function Feature({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="text-sm font-semibold">{title}</div>
      <div className="mt-1 text-sm text-muted">{body}</div>
    </div>
  );
}
