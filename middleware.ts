import { NextResponse } from "next/server";

import { auth } from "@/auth";

const PROTECTED_PREFIXES = ["/dashboard", "/admin"] as const;
const PUBLIC_AUTH_ROUTES = ["/login", "/login/verify"] as const;

type ProtectedPrefix = (typeof PROTECTED_PREFIXES)[number];

type PublicAuthRoute = (typeof PUBLIC_AUTH_ROUTES)[number];

const isProtectedRoute = (pathname: string): pathname is ProtectedPrefix =>
  PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));

const isPublicAuthRoute = (pathname: string): pathname is PublicAuthRoute =>
  PUBLIC_AUTH_ROUTES.some((route) => pathname === route);

export default auth((request) => {
  const { nextUrl } = request;
  const session = request.auth;
  const { pathname } = nextUrl;

  if (!session && isProtectedRoute(pathname)) {
    const loginUrl = nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("next", pathname + nextUrl.search);
    return NextResponse.redirect(loginUrl);
  }

  if (session && isPublicAuthRoute(pathname)) {
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
  matcher: ["/dashboard/:path*", "/admin/:path*", "/login", "/login/verify"],
};
