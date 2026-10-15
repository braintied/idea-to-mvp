import { NextResponse, type NextRequest } from "next/server";
import { createUserClient } from "@/lib/supabase/server";

// The magic link in the email lands here. We trade the one-time code
// for a login session, then send the person into the CRM.
// If that fails (most often: the link was opened in a different browser
// than the one that asked for it), the login page explains what to do.
export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const destination = request.nextUrl.clone();
  destination.search = "";

  if (code) {
    const supabase = await createUserClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      destination.pathname = "/crm";
      return NextResponse.redirect(destination);
    }
    console.error("sign-in link failed", error);
  }

  destination.pathname = "/login";
  destination.searchParams.set("error", "link");
  return NextResponse.redirect(destination);
}
