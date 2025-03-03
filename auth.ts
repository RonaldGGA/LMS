import NextAuth, { DefaultSession } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import db from "@/lib/prisma";
import authConfig from "./auth.config";
import { AdapterUser } from "next-auth/adapters";
import { Role } from "@prisma/client";

interface CustomAdapterUser extends AdapterUser {
  role?: Role;
}

declare module "next-auth" {
  interface Session {
    user: {
      role: Role;
    } & DefaultSession["user"];
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  secret: process.env.AUTH_SECRET,
  trustHost: true,
  debug: process.env.NODE_ENV === "development",
  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth/login",
    signOut: "/auth/login",
    error: "/auth/error",
    newUser: "/auth/register", // Opcional: Para flujo de registro
    verifyRequest: "/auth/verify-request", // Para verificación de email
  },

  logger: {
    error(error) {
      console.error(error);
    },
    warn(code) {
      console.warn(code);
    },
    debug(code, metadata) {
      console.debug({ code, metadata });
    },
  },
  callbacks: {
    async session({ token, session }) {
      if (token.username) {
        session.user.name = token.username as string; // Ensure we're setting the session username
      }
      if (token.sub && session.user) {
        session.user.id = token.sub;
        session.user.role = token.role as Role;
      }
      return session;
    },
    async jwt({ token, user }) {
      try {
        if (user) {
          const customUser = user as CustomAdapterUser;
          token.username = customUser.name as string;
          token.sub = customUser.id;
          token.role = customUser.role || Role.MEMBER; // Assign the role to the token
        }
        // console.log({ USER: user });
        if (!token.sub) return token;

        const existingUser = await db.userAccount.findUnique({
          where: { id: token.sub },
        });

        if (existingUser) {
          token.username = existingUser.username;
          token.role = existingUser.role;
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }

      return token;
    },
  },
  ...authConfig,
});
