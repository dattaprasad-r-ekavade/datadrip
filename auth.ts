import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import type { Adapter } from "next-auth/adapters";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";

import { authConfig } from "@/auth.config";
import { prisma } from "@/lib/prisma";

const adapter = PrismaAdapter(prisma) as unknown as Adapter;

export const { auth, handlers, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter,
  session: {
    strategy: "jwt", // Use JWT for credentials provider
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user || !user.hashedPassword) {
          return null;
        }

        const isValid = await compare(credentials.password as string, user.hashedPassword);

        if (!isValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          isSuperAdmin: user.isSuperAdmin,
          agencyId: user.agencyId,
        };
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user, trigger }) {
      // Initial sign in - add user data to token
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.isSuperAdmin = user.isSuperAdmin;
        token.agencyId = user.agencyId;
      }

      // On update, refresh user data from database
      if (trigger === "update") {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
        });
        if (dbUser) {
          token.role = dbUser.role;
          token.isSuperAdmin = dbUser.isSuperAdmin;
          token.agencyId = dbUser.agencyId;
        }
      }

      return token;
    },
    session: async ({ session, token }) => {
      if (session.user && token) {
        session.user.id = token.id as string;
        session.user.role = token.role as any;
        session.user.isSuperAdmin = token.isSuperAdmin as boolean;
        session.user.agencyId = token.agencyId as string | null;
      }

      return session;
    },
    signIn: async ({ user }) => {
      if (!user.email) {
        return false;
      }

      return true;
    },
  },
  events: {
    createUser: async ({ user }) => {
      if (process.env.NODE_ENV === "development") {
        console.info(`[auth] created user ${user.email}`);
      }
    },
  },
});
