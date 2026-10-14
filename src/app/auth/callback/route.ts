import { NextResponse, type NextRequest } from "next/server";
import { createUserClient } from "@/lib/supabase/server";

// The magic link in the email lands here. We trade the one-time code
// for a login session, then send the person into the CRM.
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
  }

  destination.pathname = "/login";
  return NextResponse.redirect(destination);
}
