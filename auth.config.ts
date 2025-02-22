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
              console.log(result.error);
            }
            return null;
          }

          if (result.data && !result.error && result.success) {
            return result.data;
          }

          return null;
        } catch (error) {
          console.error("Credentials authorization error:", error);
          if (error instanceof Error) {
            throw new Error("Error in the server");
          }
          throw new Error("An unexpected error occurred during sign in");
        }
      },
    }),
  ],
};

export default authConfig;
