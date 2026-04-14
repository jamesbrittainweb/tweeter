import { notFound } from "next/navigation";

import { AdminPanel } from "@/app/(app)/admin/AdminPanel";
import { getAdminEmail } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  const email = data.user?.email ?? "";
  if (!email || email.toLowerCase() !== getAdminEmail().toLowerCase()) {
    notFound();
  }

  return (
    <div>
      <header className="border-b border-border px-4 py-3">
        <div className="text-lg font-extrabold">Admin</div>
        <div className="text-xs text-muted">Restricted access</div>
      </header>
      <div className="px-4 py-4">
        <AdminPanel />
      </div>
    </div>
  );
}

