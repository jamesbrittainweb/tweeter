import Link from "next/link";
import { notFound } from "next/navigation";

import { Avatar } from "@/components/Avatar";
import { FollowButton } from "@/components/FollowButton";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import { getIsFollowing, getPostsForProfile, getProfileByHandle } from "@/lib/data";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function UserPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const profile = await getProfileByHandle(handle);
  if (!profile) notFound();

  const supabase = await createSupabaseServerClient();
  const { data: userData } = await supabase.auth.getUser();
  const viewer = userData.user ?? null;

  const isMe = Boolean(viewer && viewer.id === profile.id);
  const following = viewer && !isMe ? await getIsFollowing(viewer.id, profile.id) : false;

  const posts = await getPostsForProfile(profile.id);

  return (
    <main className="min-h-dvh bg-background">
      <header className="sticky top-0 z-10 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-3xl items-center justify-between px-4 py-3">
          <Link href="/" className="inline-flex items-center gap-2 font-extrabold">
            <Logo className="h-6 w-6 text-brand" />
            <span>Tweeter</span>
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            {viewer ? (
              <Link
                href="/home"
                className="hidden rounded-full border border-border bg-card px-4 py-2 text-sm font-extrabold hover:bg-border sm:inline-flex"
              >
                Home
              </Link>
            ) : (
              <Link
                href="/auth?mode=signin"
                className="rounded-full bg-foreground px-4 py-2 text-sm font-extrabold text-background"
              >
                Sign in
              </Link>
            )}
          </div>
        </div>
      </header>

      <div className="mx-auto w-full max-w-3xl">
        <section className="border-b border-border px-4 py-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <Avatar
                label={profile.display_name || profile.handle}
                src={profile.avatar_url}
                size={56}
                className="rounded-full bg-border text-lg font-extrabold"
              />
              <div>
                <h1 className="inline-flex items-center gap-1 text-xl font-extrabold leading-tight">
                  {profile.display_name || profile.handle}
                  {profile.verified ? <VerifiedBadge /> : null}
                </h1>
                <div className="text-sm text-muted">@{profile.handle}</div>
                {profile.bio ? (
                  <p className="mt-3 max-w-xl whitespace-pre-wrap text-[15px] leading-6">
                    {profile.bio}
                  </p>
                ) : null}
              </div>
            </div>

            <div className="pt-1">
              {isMe ? (
                <Link
                  href="/settings"
                  className="rounded-full border border-border bg-card px-4 py-2 text-sm font-extrabold hover:bg-border"
                >
                  Edit profile
                </Link>
              ) : viewer ? (
                <FollowButton profileId={profile.id} following={Boolean(following)} />
              ) : (
                <Link
                  href="/auth?mode=signin"
                  className="rounded-full bg-foreground px-4 py-2 text-sm font-extrabold text-background"
                >
                  Follow
                </Link>
              )}
            </div>
          </div>
        </section>

        <section>
          {posts.length === 0 ? (
            <div className="px-4 py-10 text-sm text-muted">No twitts yet.</div>
          ) : null}

          <div className="divide-y divide-border">
            {posts.map((post) => (
              <article key={post.id} className="px-4 py-3 hover:bg-border/30">
                <div className="text-xs text-muted">
                  {new Date(post.created_at).toLocaleString()}
                </div>
                <p className="mt-1 whitespace-pre-wrap text-[15px] leading-6">
                  {post.content}
                </p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

