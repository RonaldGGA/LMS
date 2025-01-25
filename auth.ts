import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import db from "@/lib/prisma";
import authConfig from "./auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  callbacks: {
    async session({ token, session }) {
      if (token.username) {
        session.user.name = token.username as string; // Ensure we're setting the session username
      }
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token, user }) {
      try {
        if (user) {
          token.username = user.name as string;
          token.sub = user.id;
        }
        // console.log({ USER: user });
        if (!token.sub) return token;

        const existingUser = await db.user.findUnique({
          where: { id: token.sub },
        });

        if (existingUser) {
          token.username = existingUser.username;
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }

      return token;
    },
  },
  adapter: PrismaAdapter(db),
  debug: true,
  session: { strategy: "jwt" },
  ...authConfig,
});
