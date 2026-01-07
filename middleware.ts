import NextAuth from "next-auth";
import { NextResponse } from "next/server";

import { authConfig } from "@/auth.config";

const { auth } = NextAuth(authConfig);

export default auth((request) => {
  const { nextUrl } = request;
  const session = request.auth;
  const { pathname } = nextUrl;

  const isProtectedRoute = 
    pathname.startsWith("/dashboard") || 
    pathname.startsWith("/admin");
  const isAuthRoute = pathname === "/login" || pathname === "/login/verify";

  if (!session && isProtectedRoute) {
    const loginUrl = nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("next", pathname + nextUrl.search);
    return NextResponse.redirect(loginUrl);
  }

  if (session && isAuthRoute) {
    const dashboardUrl = nextUrl.clone();
    dashboardUrl.pathname = "/dashboard";
    dashboardUrl.search = "";
    return NextResponse.redirect(dashboardUrl);
  }

  if (pathname.startsWith("/admin") && session && !session.user?.isSuperAdmin) {
    const dashboardUrl = nextUrl.clone();
    dashboardUrl.pathname = "/dashboard";
    dashboardUrl.search = "";
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/dashboard/:path*", 
    "/admin/:path*", 
    "/login", 
    "/login/verify"
  ],
};
