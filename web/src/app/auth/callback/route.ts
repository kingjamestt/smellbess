import { NextResponse, type NextRequest } from "next/server";
import { authClient, authConfigured } from "@/lib/auth";

/** The magic link lands here: swap the one-time code for a session, then go to admin. */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  if (code && authConfigured()) {
    const supabase = await authClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(`${origin}/admin`);
  }
  return NextResponse.redirect(`${origin}/admin/login?error=link`);
}
