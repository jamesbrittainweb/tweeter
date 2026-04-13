import Link from "next/link";
import { redirect } from "next/navigation";

import { Logo } from "@/components/Logo";
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
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-6 py-6">
      <header className="flex items-center justify-between gap-4">
        <Link
          href="/home"
          className="flex items-center gap-2 text-lg font-semibold tracking-tight"
        >
          <Logo className="h-6 w-6 text-brand" />
          <span className="text-brand">Tweeter</span>
        </Link>
        <nav className="flex items-center gap-4 text-sm font-semibold">
          <Link href="/home" className="text-muted hover:text-foreground">
            Home
          </Link>
          {me ? (
            <Link
              href={`/u/${me.handle}`}
              className="text-muted hover:text-foreground"
            >
              Profile
            </Link>
          ) : null}
          <Link href="/settings" className="text-muted hover:text-foreground">
            Settings
          </Link>
        </nav>
      </header>

      <main className="mt-6 flex-1">{children}</main>
    </div>
  );
}
