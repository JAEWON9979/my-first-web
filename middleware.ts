import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: Array<{ name: string; value: string; options?: Record<string, unknown> }>) {
          cookiesToSet.forEach(({ name, value, options }) => {
              // response.cookies.set expects a specific options shape; cast through unknown to avoid 'any'
              response.cookies.set(name, value, options as unknown as Record<string, unknown>);
          });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    if (
      request.nextUrl.pathname === "/posts/new" ||
      request.nextUrl.pathname.match(/^\/posts\/[^/]+\/edit$/) ||
      request.nextUrl.pathname === "/mypage" ||
      request.nextUrl.pathname === "/goals"
    ) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ["/posts/new", "/posts/:id/edit", "/mypage", "/goals"],
};
