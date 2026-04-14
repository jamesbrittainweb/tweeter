import { createSupabaseServerClient } from "@/lib/supabase/server";

export type Profile = {
  id: string;
  handle: string;
  display_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  verified: boolean;
};

export type Post = {
  id: string;
  content: string;
  created_at: string;
  author_id: string;
};

export async function getViewer() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  return data.user ?? null;
}

export async function ensureMyProfile() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  const user = data.user;
  if (!user) return null;

  const profile = await supabase
    .from("profiles")
    .select("id, handle, display_name, bio, avatar_url, verified")
    .eq("id", user.id)
    .maybeSingle();

  if (profile.data) return profile.data as Profile;

  const fallbackHandle = `user_${user.id.slice(0, 8)}`;
  await supabase.from("profiles").insert({
    id: user.id,
    handle: fallbackHandle,
  });

  const created = await supabase
    .from("profiles")
    .select("id, handle, display_name, bio, avatar_url, verified")
    .eq("id", user.id)
    .maybeSingle();

  return (created.data ?? null) as Profile | null;
}

export async function getProfileByHandle(handle: string) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("id, handle, display_name, bio, avatar_url, verified")
    .eq("handle", handle)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return (data ?? null) as Profile | null;
}

export async function getPostsForFeed(limit = 50) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("posts")
    .select("id, content, created_at, author_id")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw new Error(error.message);

  const posts = (data ?? []) as Post[];
  const authorIds = Array.from(new Set(posts.map((p) => p.author_id)));

  type AuthorProfile = Pick<
    Profile,
    "id" | "handle" | "display_name" | "avatar_url" | "verified"
  >;

  const profilesRes: { data: AuthorProfile[] | null } = authorIds.length
    ? await supabase
        .from("profiles")
        .select("id, handle, display_name, avatar_url, verified")
        .in("id", authorIds)
    : { data: [] };

  const profileById = new Map(
    (profilesRes.data ?? []).map((p) => [p.id, p]),
  );

  return posts.map((p) => ({
    ...p,
    author: profileById.get(p.author_id) as
      | AuthorProfile
      | undefined,
  }));
}

export async function getPostsForProfile(profileId: string, limit = 50) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("posts")
    .select("id, content, created_at, author_id")
    .eq("author_id", profileId)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw new Error(error.message);
  return (data ?? []) as Post[];
}

export async function getIsFollowing(viewerId: string, profileId: string) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("follows")
    .select("following_id")
    .eq("follower_id", viewerId)
    .eq("following_id", profileId)
    .maybeSingle();
  if (error && error.code !== "PGRST116") throw new Error(error.message);
  return Boolean(data);
}

export async function getSuggestedProfiles(options: {
  excludeUserId?: string;
  limit?: number;
}) {
  const supabase = await createSupabaseServerClient();
  const limit = options.limit ?? 5;

  const { data, error } = await supabase
    .from("profiles")
    .select("id, handle, display_name, avatar_url, verified")
    .order("created_at", { ascending: false })
    .limit(limit + 5);

  if (error) throw new Error(error.message);

  const profiles = (data ?? []) as Array<
    Pick<Profile, "id" | "handle" | "display_name" | "avatar_url" | "verified">
  >;

  const filtered = options.excludeUserId
    ? profiles.filter((p) => p.id !== options.excludeUserId)
    : profiles;

  return filtered.slice(0, limit);
}
