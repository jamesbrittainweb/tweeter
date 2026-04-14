import Link from "next/link";
import { redirect } from "next/navigation";

import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { SignOutButton } from "@/components/SignOutButton";
import { Avatar } from "@/components/Avatar";
import { FollowButtonSmall } from "@/components/FollowButtonSmall";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import { ensureMyProfile, getIsFollowing, getSuggestedProfiles } from "@/lib/data";
import { getAdminEmail } from "@/lib/supabase/admin";
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
  const isAdmin =
    (data.user.email || "").toLowerCase() === getAdminEmail().toLowerCase();

  const me = await ensureMyProfile();
  const suggestions = await getSuggestedProfiles({
    excludeUserId: data.user.id,
    limit: 3,
  });
  const followingMap = new Map<string, boolean>();
  for (const p of suggestions) {
    followingMap.set(p.id, await getIsFollowing(data.user.id, p.id));
  }

  return (
    <div className="flex w-full flex-1">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 md:grid-cols-[260px_1fr] lg:grid-cols-[260px_600px_1fr]">
        <aside className="hidden md:flex md:flex-col md:gap-6 md:px-4 md:py-4">
          <Link
            href="/home"
            className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-lg font-extrabold tracking-tight hover:bg-border"
          >
            <Logo className="h-7 w-7 text-brand" />
            <span className="text-foreground">Tweeter</span>
          </Link>

          <nav className="flex flex-col gap-1 text-base font-bold">
            <NavItem href="/home">Home</NavItem>
            {me ? <NavItem href={`/u/${me.handle}`}>Profile</NavItem> : null}
            <NavItem href="/settings">Settings</NavItem>
            {isAdmin ? <NavItem href="/admin">Admin</NavItem> : null}
          </nav>

          <Link
            href="/home"
            className="mt-2 inline-flex items-center justify-center rounded-full bg-brand px-4 py-3 text-sm font-extrabold text-white"
          >
            Twitt
          </Link>

          <div className="mt-auto flex flex-col gap-3">
            <ThemeToggle />
            <SignOutButton />
          </div>
        </aside>

        <div className="min-h-dvh border-x border-border bg-background">
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
          <div className="rounded-2xl bg-panel p-4">
            <input
              placeholder="Search Tweeter"
              className="w-full rounded-full border border-border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-foreground/10"
            />
          </div>

          <div className="rounded-2xl bg-panel p-4">
            <div className="text-base font-extrabold">Trends for you</div>
            <div className="mt-3 space-y-3 text-sm">
              <div>
                <div className="text-xs text-muted">Trending</div>
                <div className="font-extrabold">#Tweeter</div>
                <div className="text-xs text-muted">1,024 Twitts</div>
              </div>
              <div>
                <div className="text-xs text-muted">Trending</div>
                <div className="font-extrabold">#BuildInPublic</div>
                <div className="text-xs text-muted">512 Twitts</div>
              </div>
              <div>
                <div className="text-xs text-muted">Trending</div>
                <div className="font-extrabold">#Supabase</div>
                <div className="text-xs text-muted">318 Twitts</div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-panel p-4">
            <div className="text-base font-extrabold">Who to follow</div>
            <div className="mt-3 space-y-3">
              {suggestions.length === 0 ? (
                <div className="text-sm text-muted">No suggestions yet.</div>
              ) : null}

              {suggestions.map((p) => (
                <div key={p.id} className="flex items-center justify-between gap-3">
                  <Link href={`/u/${p.handle}`} className="flex min-w-0 items-center gap-3">
                    <Avatar
                      label={p.display_name || p.handle}
                      src={p.avatar_url}
                      className="h-10 w-10 rounded-full bg-border text-sm font-extrabold"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1 truncate text-sm font-extrabold">
                        <span className="truncate">{p.display_name || p.handle}</span>
                        {p.verified ? <VerifiedBadge /> : null}
                      </div>
                      <div className="truncate text-xs text-muted">@{p.handle}</div>
                    </div>
                  </Link>

                  <FollowButtonSmall
                    profileId={p.id}
                    following={Boolean(followingMap.get(p.id))}
                  />
                </div>
              ))}
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
