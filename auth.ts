import NextAuth, { Account, DefaultSession, User } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/prisma";
import authConfig from "./auth.config";
import { Role } from "@prisma/client";

import { type JWT } from "next-auth/jwt";

interface CustomAdapterUser extends User {
  role?: Role;
}

declare module "next-auth/jwt" {
  interface JWT {
    role: Role;
  }
}

declare module "next-auth" {
  interface Session {
    user: {
      role: Role;
    } & DefaultSession["user"];
  }
}
const adapter = PrismaAdapter(prisma);
export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter,
  secret: process.env.AUTH_SECRET,
  trustHost: true,
  debug: process.env.NODE_ENV === "development",
  session: { strategy: "jwt", maxAge: 15 * 24 * 60 * 60 },
  pages: {
    signIn: "/auth/login",
    signOut: "/auth/login",
    error: "/auth/error",
    newUser: "/auth/register",
    verifyRequest: "/auth/verify-request",
  },

  callbacks: {
    async session({ token, session }) {
      if (token.username) {
        session.user.name = token.name;
      }
      if (token.sub && session.user) {
        session.user.id = token.sub;
        session.user.role = token.role;
      }
      return session;
    },
    async jwt({
      token,
      account,
      user,
    }: {
      token: JWT;
      account: Account | null;
      user: CustomAdapterUser;
    }) {
      try {
        if (account?.provider == "credentials") {
          token.credentials = true;
          token.name = user.name;
          token.role = user.role || Role.MEMBER;
        }
        return token;
      } catch (error) {
        console.error("Error fetching user data:", error);
      }

      return token;
    },
  },
  ...authConfig,
});
