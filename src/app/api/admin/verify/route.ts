import { NextResponse } from "next/server";

import { createSupabaseAdminClient, getAdminEmail } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as
    | { handle?: string; verified?: boolean }
    | null;

  const handle = body?.handle?.trim().toLowerCase();
  const verified = body?.verified;

  if (!handle || typeof verified !== "boolean") {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const supabase = await createSupabaseServerClient();
  const { data: userData } = await supabase.auth.getUser();
  const email = userData.user?.email ?? null;
  if (!email || email.toLowerCase() !== getAdminEmail().toLowerCase()) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const admin = createSupabaseAdminClient();
  const { data, error } = await admin
    .from("profiles")
    .update({ verified })
    .eq("handle", handle)
    .select("id, handle, display_name, verified")
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ profile: data ?? null });
}

