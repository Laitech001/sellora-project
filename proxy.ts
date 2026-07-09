// proxy.ts (at the root of your project)
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request }); // ← pass request here

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!, // ← use publishable key
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // Step 1 — set on request
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          // Step 2 — recreate response with updated request
          supabaseResponse = NextResponse.next({ request });
          // Step 3 — set on response so browser gets them
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Use getClaims() not getUser() it's the new recommended way in Next.js 16
  await supabase.auth.getClaims();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user && request.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/signup", request.url));
  }

  // return supabaseResponse, NOT NextResponse.next()
  return supabaseResponse;
}

export const config = {
  matcher: [
    "/dashboard/:path*"
  ],
};