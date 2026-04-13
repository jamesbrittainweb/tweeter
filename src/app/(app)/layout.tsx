import Link from "next/link";
import { redirect } from "next/navigation";

import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { SignOutButton } from "@/components/SignOutButton";
import { ensureMyProfile } from "@/lib/data";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect("/auth");

  const me = await ensureMyProfile();

  return (
    <div className="flex w-full flex-1 bg-background">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 md:grid-cols-[260px_1fr] lg:grid-cols-[260px_600px_1fr]">
        <aside className="hidden md:flex md:flex-col md:gap-6 md:px-4 md:py-4">
          <Link
            href="/home"
            className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-lg font-extrabold tracking-tight hover:bg-border"
          >
            <Logo className="h-7 w-7 text-brand" />
            <span className="text-foreground">Tweeter</span>
          </Link>

          <nav className="flex flex-col gap-1 text-base font-semibold">
            <NavItem href="/home">Home</NavItem>
            {me ? <NavItem href={`/u/${me.handle}`}>Profile</NavItem> : null}
            <NavItem href="/settings">Settings</NavItem>
          </nav>

          <div className="mt-auto flex flex-col gap-3">
            <ThemeToggle />
            <SignOutButton />
          </div>
        </aside>

        <div className="min-h-dvh border-x border-border">
          <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-border bg-background/90 px-4 py-3 backdrop-blur md:hidden">
            <Link href="/home" className="inline-flex items-center gap-2 font-extrabold">
              <Logo className="h-6 w-6 text-brand" />
              <span>Tweeter</span>
            </Link>
            <div className="flex items-center gap-2">
              <ThemeToggle />
            </div>
          </div>

          <main>{children}</main>
        </div>

        <aside className="hidden lg:flex lg:flex-col lg:gap-3 lg:px-4 lg:py-4">
          <div className="rounded-2xl border border-border bg-card p-4">
            <div className="text-sm font-extrabold">What’s new</div>
            <div className="mt-1 text-sm text-muted">
              Add trends, search, and notifications next.
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-4">
            <div className="text-sm font-extrabold">Account</div>
            <div className="mt-1 text-sm text-muted">
              Signed in{me ? ` as @${me.handle}` : ""}.
            </div>
            <div className="mt-3">
              <SignOutButton />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function NavItem({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="rounded-full px-3 py-2 text-foreground hover:bg-border"
    >
      {children}
    </Link>
  );
}
