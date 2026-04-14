import { NextResponse } from "next/server";

import { createSupabaseAdminClient, getAdminEmail } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const handle = url.searchParams.get("handle")?.trim().toLowerCase();
  if (!handle) {
    return NextResponse.json({ error: "Missing handle" }, { status: 400 });
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
    .select("id, handle, display_name, verified")
    .eq("handle", handle)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ profile: data ?? null });
}

