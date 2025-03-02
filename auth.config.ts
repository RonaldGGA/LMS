import Credentials from "next-auth/providers/credentials";
import { loginUser } from "./actions/auth-user";

const authConfig = {
  providers: [
    Credentials({
      async authorize(credentials) {
        try {
          if (!credentials?.username || !credentials?.password) {
            throw new Error("Username and password are required");
          }

          const result = await loginUser({
            username: credentials.username as string,
            password: credentials.password as string,
          });

          if (!result.success) {
            if (result.error) {
              // Handle specific error cases if available
              throw new Error(result.error);
            }
            throw new Error("Sign in failed");
          }

          if (result.data && !result.error && result.success) {
            return result.data;
          }

          throw new Error("No user data received");
        } catch (error) {
          console.error("Credentials authorization error:", error);
          if (error instanceof Error) {
            throw new Error(
              error.message || "An unexpected error occurred during sign in"
            );
          }
          throw new Error("An unexpected error occurred during sign in");
        }
      },
    }),
  ],
};

export default authConfig;
