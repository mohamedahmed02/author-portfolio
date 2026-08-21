import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { defaultLocale, isLocale } from "@/lib/i18n";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Admin API & auth routes handled separately; protect /admin except login
  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login" || pathname.startsWith("/admin/login/")) {
      return NextResponse.next();
    }
    // Session cookie presence check (full auth still enforced server-side)
    const session =
      request.cookies.get("authjs.session-token") ||
      request.cookies.get("__Secure-authjs.session-token");
    if (!session) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // Skip static / api
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const segment = pathname.split("/")[1];
  if (isLocale(segment)) {
    const response = NextResponse.next();
    response.cookies.set("NEXT_LOCALE", segment, {
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365,
    });
    return response;
  }

  const cookieLocale = request.cookies.get("NEXT_LOCALE")?.value;
  const locale =
    cookieLocale && isLocale(cookieLocale) ? cookieLocale : defaultLocale;

  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|uploads|robots.txt|sitemap.xml).*)"],
};
