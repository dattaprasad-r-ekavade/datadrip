import type { NextAuthConfig } from "next-auth";

// Edge-compatible auth config (no Node.js dependencies)
// Used by middleware which runs in Edge runtime
export const authConfig = {
  session: {
    strategy: "jwt", // JWT for edge compatibility
  },
  pages: {
    signIn: "/login",
    verifyRequest: "/login/verify",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnProtected =
        nextUrl.pathname.startsWith("/dashboard") || 
        nextUrl.pathname.startsWith("/admin");
      const isOnAuth = nextUrl.pathname.startsWith("/login");

      if (isOnProtected) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login
      }

      if (isLoggedIn && isOnAuth) {
        return Response.redirect(new URL("/dashboard", nextUrl));
      }

      return true;
    },
  },
  providers: [], // Providers will be added in the full config
} satisfies NextAuthConfig;
