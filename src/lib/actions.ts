"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createSupabaseServerClient } from "@/lib/supabase/server";

function normalizeHandle(raw: string) {
  return raw.trim().toLowerCase().replaceAll(/[^a-z0-9_]/g, "");
}

export async function createPost(content: string) {
  const trimmed = content.trim();
  if (!trimmed) return;
  if (trimmed.length > 280) throw new Error("Twitt too long (max 280).");

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect("/auth");

  const { error } = await supabase.from("posts").insert({
    author_id: data.user.id,
    content: trimmed,
  });

  if (error) throw new Error(error.message);

  revalidatePath("/home");
}

export async function toggleLike(postId: string) {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect("/auth");

  const userId = data.user.id;

  const existing = await supabase
    .from("post_likes")
    .select("post_id")
    .eq("post_id", postId)
    .eq("user_id", userId)
    .maybeSingle();

  if (existing.data) {
    const { error } = await supabase
      .from("post_likes")
      .delete()
      .eq("post_id", postId)
      .eq("user_id", userId);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase.from("post_likes").insert({
      post_id: postId,
      user_id: userId,
    });
    if (error) throw new Error(error.message);
  }

  revalidatePath("/home");
}

export async function toggleFollow(profileId: string) {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect("/auth");

  const followerId = data.user.id;
  if (followerId === profileId) return;

  const existing = await supabase
    .from("follows")
    .select("following_id")
    .eq("follower_id", followerId)
    .eq("following_id", profileId)
    .maybeSingle();

  if (existing.data) {
    const { error } = await supabase
      .from("follows")
      .delete()
      .eq("follower_id", followerId)
      .eq("following_id", profileId);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase.from("follows").insert({
      follower_id: followerId,
      following_id: profileId,
    });
    if (error) throw new Error(error.message);
  }

  revalidatePath("/home");
  revalidatePath(`/u`);
}

export async function updateMyProfile(formData: FormData) {
  const handleRaw = String(formData.get("handle") ?? "");
  const displayName = String(formData.get("display_name") ?? "").trim();
  const bio = String(formData.get("bio") ?? "").trim();
  const avatarUrl = String(formData.get("avatar_url") ?? "").trim();

  const handle = normalizeHandle(handleRaw);
  if (!handle) throw new Error("Handle is required.");
  if (handle.length < 3 || handle.length > 20)
    throw new Error("Handle must be 3–20 chars.");

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect("/auth");

  const { error } = await supabase.from("profiles").upsert(
    {
      id: data.user.id,
      handle,
      display_name: displayName || null,
      bio: bio || null,
      avatar_url: avatarUrl || null,
    },
    { onConflict: "id" },
  );

  if (error) throw new Error(error.message);

  revalidatePath("/settings");
  revalidatePath(`/u/${handle}`);
  redirect(`/u/${handle}`);
}

export async function signOut() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/");
}
