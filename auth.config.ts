import Credentials from "next-auth/providers/credentials";
import { AuthError, type NextAuthConfig } from "next-auth";
import { loginSchema } from "./zod-schemas";
import prisma from "./lib/prisma";
import bcrypt from "bcryptjs";

export default {
  providers: [
    Credentials({
      credentials: {
        username: {},
        password: {},
      },
      async authorize(credentials) {
        try {
          const { success, error, data } = loginSchema.safeParse(credentials);
          // Input validation
          if (!success) {
            throw new Error(error.message);
          }

          // Find user in database
          const dbUser = await prisma.userAccount.findFirst({
            where: {
              username: data.username || "",
            },
          });

          if (!dbUser) {
            throw new Error("User not found");
          }

          // Validate password
          const validatePassword = await bcrypt.compare(
            data.password,
            dbUser.password
          );

          if (!validatePassword) {
            throw new Error("Invalid password");
          }

          const user = {
            id: dbUser.id,
            name: dbUser.username,
            role: dbUser.role,
          };

          return user;
        } catch (error) {
          if (error instanceof AuthError) {
            throw new Error(error.message);
          }
          throw new Error("Could not authorize the user");
        }
      },
    }),
  ],
} satisfies NextAuthConfig;
