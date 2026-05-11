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
          return request.cookies.getSetCookie();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 로그인하지 않은 사용자를 /login으로 리다이렉트
  if (!user) {
    const protectedRoutes = ["/posts/new", "/posts/", "/mypage"];
    const isEditRoute = request.nextUrl.pathname.match(/^\/posts\/[^/]+\/edit$/);

    if (
      protectedRoutes.some((route) => request.nextUrl.pathname.startsWith(route)) ||
      isEditRoute
    ) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ["/posts/new", "/posts/:id/edit", "/mypage", "/posts/:id"],
};
