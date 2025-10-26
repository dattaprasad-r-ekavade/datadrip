import { PrismaAdapter } from "@auth/prisma-adapter";
import type { NextAuthConfig } from "next-auth";
import type { Adapter } from "next-auth/adapters";
import EmailProvider from "next-auth/providers/email";
import { createTransport } from "nodemailer";

import { magicLinkSubject, renderMagicLinkEmail } from "@/lib/email/templates/magic-link";
import { env } from "@/lib/env";
import { prisma } from "@/lib/prisma";

const adapter = PrismaAdapter(prisma) as unknown as Adapter;

const transport = createTransport({
  host: env.EMAIL_SERVER_HOST,
  port: env.EMAIL_SERVER_PORT,
  secure: false,
  auth: {
    user: env.EMAIL_SERVER_USER,
    pass: env.EMAIL_SERVER_PASSWORD,
  },
});

export const authConfig: NextAuthConfig = {
  adapter,
  session: {
    strategy: "database",
  },
  pages: {
    signIn: "/login",
    verifyRequest: "/login/verify",
  },
  providers: [
    EmailProvider({
      from: env.EMAIL_FROM,
      maxAge: 60 * 60 * 24,
      sendVerificationRequest: async ({ identifier, url }) => {
        const html = renderMagicLinkEmail({ email: identifier, url });
        await transport.sendMail({
          to: identifier,
          from: env.EMAIL_FROM,
          subject: magicLinkSubject,
          html,
        });
      },
    }),
  ],
  callbacks: {
    session: async ({ session, user }) => {
      if (session.user) {
        session.user.id = user.id;
        session.user.role = user.role;
        session.user.isSuperAdmin = user.isSuperAdmin;
        session.user.agencyId = user.agencyId;
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
      if (env.NODE_ENV === "development") {
        console.info(`[auth] created user ${user.email}`);
      }
    },
  },
};
