import Link from "next/link";

import { Composer } from "@/components/Composer";
import { LikeButton } from "@/components/LikeButton";
import { ensureMyProfile, getPostsForFeed, getViewer } from "@/lib/data";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const viewer = await getViewer();
  const me = await ensureMyProfile();
  const posts = await getPostsForFeed();

  const likedPostIds = await getLikedPostIds(
    viewer?.id ?? null,
    posts.map((p) => p.id),
  );

  return (
    <div className="space-y-6">
      <section className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Home</h1>
          <p className="mt-1 text-sm text-muted">
            You’re signed in{me ? ` as @${me.handle}` : ""}.
          </p>
        </div>
        <Link
          href="/settings"
          className="rounded-full border border-border bg-background px-4 py-2 text-sm font-semibold"
        >
          Edit profile
        </Link>
      </section>

      <Composer />

      <section className="space-y-3">
        {posts.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-6 text-sm text-muted">
            No twitts yet. Be the first.
          </div>
        ) : null}

        {posts.map((post) => {
          const author = post.author;
          const handle = author?.handle ?? "unknown";
          const display = author?.display_name ?? `@${handle}`;
          const liked = likedPostIds.has(post.id);

          return (
            <article
              key={post.id}
              className="rounded-2xl border border-border bg-card p-4"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <Link
                    href={`/u/${handle}`}
                    className="truncate text-sm font-semibold hover:underline"
                  >
                    {display}{" "}
                    <span className="font-normal text-muted">@{handle}</span>
                  </Link>
                  <div className="mt-0.5 text-xs text-muted">
                    {new Date(post.created_at).toLocaleString()}
                  </div>
                </div>
              </div>

              <p className="mt-3 whitespace-pre-wrap text-sm leading-6">
                {post.content}
              </p>

              <div className="mt-3 flex items-center gap-4">
                <LikeButton postId={post.id} liked={liked} />
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}

async function getLikedPostIds(viewerId: string | null, postIds: string[]) {
  if (!viewerId || postIds.length === 0) return new Set<string>();

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("post_likes")
    .select("post_id")
    .eq("user_id", viewerId)
    .in("post_id", postIds);

  if (error) throw new Error(error.message);
  return new Set((data ?? []).map((row) => row.post_id as string));
}
