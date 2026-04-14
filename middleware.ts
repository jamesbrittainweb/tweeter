import { NextRequest, NextResponse } from "next/server";

import { updateSupabaseSession } from "@/lib/supabase/middleware";

const PROTECTED_PREFIXES = ["/home", "/settings", "/admin"];
const ADMIN_EMAIL = (process.env.SUPABASE_ADMIN_EMAIL ||
  "jamesbrittainweb@gmail.com") as string;

export async function middleware(request: NextRequest) {
  const { supabase, response } = updateSupabaseSession(request);

  const pathname = request.nextUrl.pathname;
  const isProtected = PROTECTED_PREFIXES.some((prefix) =>
    pathname === prefix || pathname.startsWith(`${prefix}/`),
  );

  if (!isProtected) return response;

  const { data } = await supabase.auth.getUser();
  const user = data.user;

  if (!user) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth";
    const redirectResponse = NextResponse.redirect(url);
    for (const cookie of response.cookies.getAll()) {
      redirectResponse.cookies.set(cookie);
    }
    return redirectResponse;
  }

  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    const email = (user.email || "").toLowerCase();
    if (email !== ADMIN_EMAIL.toLowerCase()) {
      const url = request.nextUrl.clone();
      url.pathname = "/home";
      return NextResponse.redirect(url);
    }
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
