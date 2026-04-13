import { Composer } from "@/components/Composer";
import { Avatar } from "@/components/Avatar";
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
    <div>
      <header className="border-b border-border px-4 py-3">
        <div className="text-lg font-extrabold">Home</div>
        <div className="text-xs text-muted">
          {me ? `@${me.handle}` : "Signed in"}
        </div>
      </header>

      <Composer />

      <section>
        {posts.length === 0 ? (
          <div className="px-4 py-10 text-sm text-muted">
            No twitts yet. Be the first.
          </div>
        ) : null}

        <div className="divide-y divide-border">
          {posts.map((post) => {
            const author = post.author;
            const handle = author?.handle ?? "unknown";
            const display = author?.display_name ?? handle;
            const liked = likedPostIds.has(post.id);

            return (
              <article key={post.id} className="px-4 py-3 hover:bg-border/30">
                <div className="flex gap-3">
                  <Avatar
                    label={display}
                    className="h-10 w-10 rounded-full bg-border text-sm font-extrabold"
                  />

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-2 text-[13px]">
                      <span className="font-extrabold">{display}</span>
                      <span className="text-muted">@{handle}</span>
                      <span className="text-muted">·</span>
                      <span className="text-muted">
                        {new Date(post.created_at).toLocaleString()}
                      </span>
                    </div>

                    <p className="mt-1 whitespace-pre-wrap text-[15px] leading-6">
                      {post.content}
                    </p>

                    <div className="mt-2 flex items-center gap-5">
                      <LikeButton postId={post.id} liked={liked} />
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
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
