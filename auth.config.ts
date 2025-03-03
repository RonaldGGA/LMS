import Credentials from "next-auth/providers/credentials";
import { loginUser } from "./actions/auth-user";
import type { NextAuthConfig } from "next-auth";

export default {
  providers: [
    Credentials({
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const result = await loginUser({
            username: credentials.username as string,
            password: credentials.password as string,
          });

          if (!result.data) {
            // 🔥 Formato crítico para NextAuth
            throw new Error(
              JSON.stringify({
                code: "INVALID_CREDENTIALS",
                message: "Correo o contraseña incorrectos",
              })
            );
          }

          if (result.data && !result.error && result.success) {
            return result.data;
          }
          return null;
        } catch (error) {
          throw new Error(
            JSON.stringify({
              code: "AUTH_ERROR",
              message:
                error instanceof Error ? error.message : "Error desconocido",
            })
          );
        }
      },
    }),
  ],
} satisfies NextAuthConfig;
