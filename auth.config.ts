import Credentials from "next-auth/providers/credentials";

import { loginSchema } from "@/zod-schemas";
import bcrypt from "bcryptjs";
import db from "@/lib/prisma";
import { loginUser } from "./actions/auth-user";
import { ZodError } from "zod";

const authConfig = {
  providers: [
    Credentials({
      async authorize(credentials) {
        const user = await loginUser({
          username: credentials.username as string,
          password: credentials.password as string,
        });
        if (user) {
          console.log("User logged in:", user); // Log user info
          return user;
        } else {
          throw new Error("Invalid username or password");
        }
      },
    }),
  ],
};
export default authConfig;
