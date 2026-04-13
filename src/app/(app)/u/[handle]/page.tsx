import Link from "next/link";
import { notFound } from "next/navigation";

import { FollowButton } from "@/components/FollowButton";
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
    <div className="space-y-6">
      <header className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              {profile.display_name || `@${profile.handle}`}
            </h1>
            <div className="mt-1 text-sm text-muted">@{profile.handle}</div>
          </div>

          {isMe ? (
            <Link
              href="/settings"
              className="rounded-full border border-border bg-background px-4 py-2 text-sm font-semibold"
            >
              Edit
            </Link>
          ) : (
            <FollowButton profileId={profile.id} following={Boolean(following)} />
          )}
        </div>

        {profile.bio ? (
          <p className="mt-4 whitespace-pre-wrap text-sm leading-6">
            {profile.bio}
          </p>
        ) : null}
      </header>

      <section className="space-y-3">
        {posts.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-6 text-sm text-muted">
            No posts yet.
          </div>
        ) : null}

        {posts.map((post) => (
          <article
            key={post.id}
            className="rounded-2xl border border-border bg-card p-4"
          >
            <div className="text-xs text-muted">
              {new Date(post.created_at).toLocaleString()}
            </div>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-6">
              {post.content}
            </p>
          </article>
        ))}
      </section>
    </div>
  );
}
