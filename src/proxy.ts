import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { supabasePublicEnv } from "@/lib/supabase/public-env";

// Runs before every page request. It keeps the login session fresh and
// sends signed-out visitors away from the CRM.
export async function proxy(request: NextRequest) {
  // A sign-in link that landed on the home page (/?code=...). Supabase sends
  // people to the Site URL when the link's address isn't in its Redirect URLs
  // list. Pass the code on to /auth/callback so the sign-in still finishes.
  if (request.nextUrl.pathname === "/" && request.nextUrl.searchParams.has("code")) {
    const callback = request.nextUrl.clone();
    callback.pathname = "/auth/callback";
    return NextResponse.redirect(callback);
  }

  // Before Supabase is connected (no keys yet), let the page load as it is.
  // The sign-in form then says what's missing instead of a crash.
  let env: ReturnType<typeof supabasePublicEnv>;
  try {
    env = supabasePublicEnv();
  } catch (setupError) {
    console.error("proxy: Supabase not connected", setupError);
    return NextResponse.next();
  }

  let response = NextResponse.next({ request });
  const supabase = createServerClient(env.url, env.publishableKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (cookiesToSet) => {
        for (const { name, value } of cookiesToSet) request.cookies.set(name, value);
        response = NextResponse.next({ request });
        for (const { name, value, options } of cookiesToSet) {
          response.cookies.set(name, value, options);
        }
      },
    },
  });

  const { data } = await supabase.auth.getUser();

  if (!data.user && request.nextUrl.pathname.startsWith("/crm")) {
    const login = request.nextUrl.clone();
    login.pathname = "/login";
    return NextResponse.redirect(login);
  }

  return response;
}

export const config = {
  // Only the pages that care about login, plus the home page when a sign-in
  // code landed there. The rest of the public site and the Inngest endpoint
  // skip this entirely.
  matcher: ["/crm/:path*", "/login", { source: "/", has: [{ type: "query", key: "code" }] }],
};
