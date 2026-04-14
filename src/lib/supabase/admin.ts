import "server-only";

import { createClient } from "@supabase/supabase-js";

import { getSupabaseConfig } from "@/lib/supabase/config";

function getServiceRoleKey() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) throw new Error("Missing env: SUPABASE_SERVICE_ROLE_KEY");
  return key;
}

export function getAdminEmail() {
  return process.env.SUPABASE_ADMIN_EMAIL || "jamesbrittainweb@gmail.com";
}

export function createSupabaseAdminClient() {
  const { url } = getSupabaseConfig();
  const serviceRoleKey = getServiceRoleKey();

  return createClient(url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}

