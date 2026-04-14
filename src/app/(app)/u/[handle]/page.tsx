import Link from "next/link";
import { notFound } from "next/navigation";

import { Avatar } from "@/components/Avatar";
import { FollowButton } from "@/components/FollowButton";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import {
  ensureMyProfile,
  getIsFollowing,
  getPostsForProfile,
  getProfileByHandle,
  getViewer,
} from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function UserPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const profile = await getProfileByHandle(handle);
  if (!profile) notFound();

  const viewer = await getViewer();
  const me = await ensureMyProfile();

  const isMe = Boolean(me && viewer && me.id === profile.id);
  const following =
    viewer && !isMe ? await getIsFollowing(viewer.id, profile.id) : false;

  const posts = await getPostsForProfile(profile.id);

  return (
    <div>
      <header className="border-b border-border px-4 py-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <Avatar
              label={profile.display_name || profile.handle}
              className="h-14 w-14 rounded-full bg-border text-lg font-extrabold"
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
            ) : (
              <FollowButton
                profileId={profile.id}
                following={Boolean(following)}
              />
            )}
          </div>
        </div>
      </header>

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
  );
}
